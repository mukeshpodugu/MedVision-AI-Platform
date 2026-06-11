from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(50), default="doctor") # admin, doctor, patient
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    uploaded_images = relationship("UploadedImage", back_populates="uploader")
    activity_logs = relationship("ActivityLog", back_populates="user")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    predictions = relationship("Prediction", back_populates="patient")

class UploadedImage(Base):
    __tablename__ = "uploaded_images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False) # chest_xray, skin, brain_mri, eye_retinopathy
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    uploader = relationship("User", back_populates="uploaded_images")
    prediction = relationship("Prediction", back_populates="image", uselist=False)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("uploaded_images.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    model_name = Column(String(100), nullable=False) # ResNet50, EfficientNet, MobileNetV2
    predicted_class = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False) # e.g. 0.968
    explainability_path = Column(String(500), nullable=True) # Grad-CAM image path
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    image = relationship("UploadedImage", back_populates="prediction")
    patient = relationship("Patient", back_populates="predictions")
    report = relationship("Report", back_populates="prediction", uselist=False)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    report_path = Column(String(500), nullable=False) # PDF file path
    generated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    prediction = relationship("Prediction", back_populates="report")

class DiseaseCategory(Base):
    __tablename__ = "disease_categories"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), unique=True, nullable=False) # Chest X-Ray, Skin, Brain MRI, Diabetic Retinopathy
    diseases = Column(JSON, nullable=False) # List of supported diseases in this category

class ModelMetrics(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    category_name = Column(String(100), nullable=False) # Chest X-Ray, Skin, Brain MRI, Diabetic Retinopathy
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    confusion_matrix = Column(JSON, nullable=True) # 2D array representing metrics
    evaluated_at = Column(DateTime, default=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="activity_logs")
