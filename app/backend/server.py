from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from datetime import datetime, timezone
from twilio.rest import Client
import uuid
import os
import logging
import uvicorn

# =========================================================
# LOAD ENV VARIABLES
# =========================================================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# =========================================================
# TWILIO CONFIG
# =========================================================

TWILIO_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_FROM = os.environ.get("TWILIO_SMS_NUMBER")


def send_patient_sms(name: str, phone: str, date: str, time: str, service: str):
    """
    Sends appointment confirmation SMS to patient
    """

    # Prevent crash if Twilio keys are missing
    if not all([TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM]):
        print("⚠️ Twilio credentials missing. SMS skipped.")
        return False

    try:
        client = Client(TWILIO_SID, TWILIO_TOKEN)

        sms_body = (
            f"Hello {name}, your appointment for {service} has been confirmed!\n\n"
            f"📅 Date: {date}\n"
            f"⏰ Time: {time}\n\n"
            f"Dr. Ikhankar looks forward to seeing you!"
        )

        # Add Indian country code if not present
        formatted_phone = (
            phone if phone.startswith("+") else f"+91{phone}"
        )

        message = client.messages.create(
            body=sms_body,
            from_=TWILIO_FROM,
            to=formatted_phone
        )

        print(f"✅ SMS sent successfully! SID: {message.sid}")
        return True

    except Exception as e:
        print(f"❌ SMS sending failed: {str(e)}")
        return False


# =========================================================
# MONGODB CONNECTION
# =========================================================

mongo_url = os.environ["MONGO_URL"]

client = AsyncIOMotorClient(mongo_url)

db = client[os.environ["DB_NAME"]]

# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI()

api_router = APIRouter(prefix="/api")

# =========================================================
# MODELS
# =========================================================

class StatusCheck(BaseModel):

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    client_name: str

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


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

    message: str | None = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


# =========================================================
# ROUTES
# =========================================================

@api_router.get("/")
async def root():
    return {"message": "Backend Running Successfully 🚀"}


# =========================================================
# STATUS CHECK ROUTES
# =========================================================

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):

    status_dict = input.model_dump()

    status_obj = StatusCheck(**status_dict)

    doc = status_obj.model_dump()

    doc["timestamp"] = doc["timestamp"].isoformat()

    await db.status_checks.insert_one(doc)

    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():

    status_checks = await db.status_checks.find(
        {}, {"_id": 0}
    ).to_list(1000)

    for check in status_checks:

        if isinstance(check["timestamp"], str):

            check["timestamp"] = datetime.fromisoformat(
                check["timestamp"]
            )

    return status_checks


# =========================================================
# APPOINTMENT ROUTES
# =========================================================

@api_router.get("/appointments/check-availability")
async def check_availability(date: str):
    """Checks MongoDB to see how many people are booked on a specific date"""
    
    # 1. Count how many documents in MongoDB have this exact preferred_date
    count = await db.appointments.count_documents({"preferred_date": date})
    
    # 2. Set your maximum limit per day (e.g., 10 patients max)
    MAX_PATIENTS_PER_DAY = 10
    
    if count >= MAX_PATIENTS_PER_DAY:
        return {
            "available": False, 
            "message": "Doctor is fully booked on this date. Please select another day."
        }
    
    # If slots are open, tell the frontend it's safe!
    slots_left = MAX_PATIENTS_PER_DAY - count
    return {
        "available": True, 
        "message": f"Date is available! ({slots_left} slots left)"
    }

@api_router.post("/appointments")
async def book_appointment(appointment: Appointment):

    try:
        appointment_dict = appointment.model_dump()

        appointment_dict["created_at"] = (
            appointment_dict["created_at"].isoformat()
        )

        # Save to MongoDB
        await db.appointments.insert_one(appointment_dict)

        print("✅ Appointment saved to MongoDB")

        # SMS
        sms_result = send_patient_sms(
            name=appointment_dict.get("name"),
            phone=appointment_dict.get("phone"),
            date=appointment_dict.get("preferred_date"),
            time=appointment_dict.get("preferred_time"),
            service=appointment_dict.get("service", "Consultation")
        )

        print("SMS RESULT:", sms_result)

        return {
            "message": "Appointment booked successfully",
            "sms_sent": sms_result
        }

    except Exception as e:

        print("❌ ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# FETCH ALL APPOINTMENTS
# =========================================================

@api_router.get("/appointments")
async def get_appointments():

    appointments = await db.appointments.find(
        {}, {"_id": 0}
    ).to_list(1000)

    return appointments


@api_router.get("/appointments/date/{selected_date}")
async def get_appointments_by_date(selected_date: str):

    appointments = await db.appointments.find(
        {"preferred_date": selected_date},
        {"_id": 0}
    ).to_list(1000)

    return appointments

# =========================================================
# DELETE APPOINTMENT
# =========================================================

@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):

    result = await db.appointments.delete_one(
        {"id": appointment_id}
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    return {
        "message": "Appointment deleted successfully"
    }


# =========================================================
# REGISTER ROUTER
# =========================================================

app.include_router(api_router)

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get(
        "CORS_ORIGINS", "*"
    ).split(","),

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# LOGGING
# =========================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# =========================================================
# SHUTDOWN EVENT
# =========================================================

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    uvicorn.run(
        "server:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )