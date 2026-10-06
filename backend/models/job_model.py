from sqlalchemy import Column, String, Text, DateTime
from datetime import datetime
from backend.core.database import Base


class JobModel(Base):
    __tablename__ = "jobs"

    job_id = Column(String, primary_key=True, index=True)
    status = Column(String, nullable=False, default="pending")
    result_payload = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)