from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
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

        # Add Indian country code if not present
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
# MONGODB CONNECTION (Safe for Serverless & Standalone)
# =========================================================

mongo_url = os.environ.get("MONGO_URL")
db_name = os.environ.get("DB_NAME", "dentists")

client: Optional[AsyncIOMotorClient] = None
db = None

if mongo_url:
    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        logger.info(f"✅ MongoDB client initialized for database: {db_name}")
    except Exception as e:
        logger.error(f"❌ Failed to initialize MongoDB client: {e}")
else:
    logger.warning("⚠️ MONGO_URL not set in environment variables.")

def check_db():
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="Database connection not configured. Please set MONGO_URL in environment variables."
        )


# =========================================================
# FASTAPI APP & ROUTER
# =========================================================

app = FastAPI(
    title="Orthodontic Surgeon API",
    description="Backend API for Appointments, Status, and Clinic Management",
    version="1.0.0"
)

router = APIRouter()


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
    check_db()
    status_dict = input_data.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    check_db()
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check.get("timestamp"), str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])
    return status_checks


# =========================================================
# APPOINTMENT ROUTES
# =========================================================

@router.get("/appointments/check-availability")
async def check_availability(date: str):
    """
    Checks MongoDB to see how many bookings exist for a specific date
    """
    check_db()
    try:
        count = await db.appointments.count_documents({"preferred_date": date})
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
    check_db()
    try:
        appointment_dict = appointment.model_dump()
        appointment_dict["created_at"] = appointment_dict["created_at"].isoformat()

        # Save to MongoDB
        await db.appointments.insert_one(appointment_dict)
        logger.info(f"✅ Appointment saved for {appointment_dict.get('name')}")

        # SMS Notification via Twilio
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
    check_db()
    # Optional password protection check if password query is provided or admin password is configured
    admin_pw = os.environ.get("ADMIN_PASSWORD", "doctor123")
    if password is not None and password != admin_pw:
        raise HTTPException(status_code=401, detail="Unauthorized")

    appointments = await db.appointments.find({}, {"_id": 0}).to_list(1000)
    return appointments


@router.get("/appointments/date/{selected_date}")
async def get_appointments_by_date(selected_date: str):
    check_db()
    appointments = await db.appointments.find(
        {"preferred_date": selected_date},
        {"_id": 0}
    ).to_list(1000)
    return appointments


@router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    check_db()
    result = await db.appointments.delete_one({"id": appointment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}


# =========================================================
# REGISTER ROUTER & MIDDLEWARES (Supports /api and direct)
# =========================================================

app.include_router(router, prefix="/api")
app.include_router(router)

# Comprehensive CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# SHUTDOWN EVENT
# =========================================================

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()


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