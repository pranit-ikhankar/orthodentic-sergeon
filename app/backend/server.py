import sys
import traceback
from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid
import os
import logging
import uvicorn

# =========================================================
# LOAD ENV VARIABLES
# =========================================================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
load_dotenv(ROOT_DIR.parent.parent / ".env")

# =========================================================
# LOGGING
# =========================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# =========================================================
# FASTAPI APP & ROUTER
# =========================================================

app = FastAPI(
    title="Orthodontic Surgeon API",
    description="Backend API for Appointments, Status, and Clinic Management",
    version="1.0.0"
)

# Global Diagnostic Error Middleware
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        trace = traceback.format_exc()
        logger.error(f"Unhandled server error: {trace}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": str(exc),
                "type": type(exc).__name__,
                "traceback": trace.splitlines()[-5:]
            }
        )

router = APIRouter()

# =========================================================
# LAZY MONGODB CLIENT
# =========================================================

_client: Optional[AsyncIOMotorClient] = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        mongo_url = os.environ.get("MONGO_URL")
        if not mongo_url:
            raise HTTPException(
                status_code=503,
                detail="Database connection not configured. Please set MONGO_URL in environment variables."
            )

        if "#@" in mongo_url:
            mongo_url = mongo_url.replace("#@", "%23@")

        db_name = os.environ.get("DB_NAME", "dentists")
        try:
            _client = AsyncIOMotorClient(mongo_url)
            _db = _client[db_name]
            logger.info(f"✅ Connected to MongoDB ({db_name})")
        except Exception as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return _db


# =========================================================
# TWILIO CONFIG & SMS HELPER
# =========================================================

TWILIO_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_FROM = os.environ.get("TWILIO_SMS_NUMBER")

def send_patient_sms(name: str, phone: str, date: str, time: str, service: str):
    """
    Sends appointment confirmation SMS to patient using Twilio
    """
    if not all([TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM]):
        logger.warning("⚠️ Twilio credentials missing in environment. SMS skipped.")
        return False

    try:
        from twilio.rest import Client
        client = Client(TWILIO_SID, TWILIO_TOKEN)

        sms_body = (
            f"Hello {name}, your appointment for {service} has been confirmed!\n\n"
            f"📅 Date: {date}\n"
            f"⏰ Time: {time}\n\n"
            f"Dr. Ikhankar looks forward to seeing you!"
        )

        formatted_phone = phone if phone.startswith("+") else f"+91{phone}"

        message = client.messages.create(
            body=sms_body,
            from_=TWILIO_FROM,
            to=formatted_phone
        )

        logger.info(f"✅ SMS sent successfully! SID: {message.sid}")
        return True

    except Exception as e:
        logger.error(f"❌ SMS sending failed: {str(e)}")
        return False


# =========================================================
# MODELS
# =========================================================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    service: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = None
    type: Optional[str] = "appointment"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# =========================================================
# ROOT & STATUS ROUTES
# =========================================================

@router.get("/")
async def root():
    return {
        "status": "online",
        "message": "Orthodontic Surgeon API is Running 🚀",
        "endpoints": ["/api/appointments", "/api/appointments/check-availability", "/api/status"]
    }


@router.post("/status", response_model=StatusCheck)
async def create_status_check(input_data: StatusCheckCreate):
    database = get_db()
    status_dict = input_data.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await database.status_checks.insert_one(doc)
    return status_obj


@router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    database = get_db()
    status_checks = await database.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check.get("timestamp"), str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])
    return status_checks


# =========================================================
# APPOINTMENT ROUTES
# =========================================================

@router.get("/appointments/check-availability")
async def check_availability(date: str):
    database = get_db()
    try:
        count = await database.appointments.count_documents({"preferred_date": date})
        MAX_PATIENTS_PER_DAY = 10

        if count >= MAX_PATIENTS_PER_DAY:
            return {
                "available": False,
                "message": "Doctor is fully booked on this date. Please select another day."
            }

        slots_left = MAX_PATIENTS_PER_DAY - count
        return {
            "available": True,
            "message": f"Date is available! ({slots_left} slots left)"
        }
    except Exception as e:
        logger.error(f"Error checking availability: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/appointments")
async def book_appointment(appointment: Appointment):
    database = get_db()
    try:
        appointment_dict = appointment.model_dump()
        appointment_dict["created_at"] = appointment_dict["created_at"].isoformat()

        await database.appointments.insert_one(appointment_dict)
        logger.info(f"✅ Appointment saved for {appointment_dict.get('name')}")

        sms_result = send_patient_sms(
            name=appointment_dict.get("name", "Patient"),
            phone=appointment_dict.get("phone", ""),
            date=appointment_dict.get("preferred_date", ""),
            time=appointment_dict.get("preferred_time", ""),
            service=appointment_dict.get("service", "Consultation")
        )

        return {
            "success": True,
            "message": "Appointment booked successfully",
            "sms_sent": sms_result,
            "id": appointment_dict.get("id")
        }

    except Exception as e:
        logger.error(f"❌ Booking Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/appointments")
async def get_appointments(password: Optional[str] = None):
    database = get_db()
    admin_pw = os.environ.get("ADMIN_PASSWORD", "doctor123")
    if password is not None and password != admin_pw:
        raise HTTPException(status_code=401, detail="Unauthorized")

    appointments = await database.appointments.find({}, {"_id": 0}).to_list(1000)
    return appointments


@router.get("/appointments/date/{selected_date}")
async def get_appointments_by_date(selected_date: str):
    database = get_db()
    appointments = await database.appointments.find(
        {"preferred_date": selected_date},
        {"_id": 0}
    ).to_list(1000)
    return appointments


@router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    database = get_db()
    result = await database.appointments.delete_one({"id": appointment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}


# =========================================================
# REGISTER ROUTER & MIDDLEWARES
# =========================================================

app.include_router(router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# RUN SERVER (Local Execution)
# =========================================================

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=True
    )