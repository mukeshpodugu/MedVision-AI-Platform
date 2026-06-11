from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "doctor" # admin, doctor, patient

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Patient Schemas
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# UploadedImage Schemas
class UploadedImageResponse(BaseModel):
    id: int
    filename: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True

# Prediction Schemas
class PredictionCreate(BaseModel):
    patient_name: str
    patient_age: int
    patient_gender: str
    category: str  # chest_xray, skin, brain_mri, eye_retinopathy
    model_name: str # ResNet50, EfficientNet, MobileNetV2

class PredictionResponse(BaseModel):
    id: int
    image_id: int
    patient_id: int
    model_name: str
    predicted_class: str
    confidence: float
    explainability_path: Optional[str] = None
    created_at: datetime
    patient: PatientResponse
    image: UploadedImageResponse

    class Config:
        from_attributes = True

# Report Schemas
class ReportResponse(BaseModel):
    id: int
    prediction_id: int
    report_path: str
    generated_at: datetime

    class Config:
        from_attributes = True

# Model Metrics Schemas
class ModelMetricsCreate(BaseModel):
    model_name: str
    category_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: Optional[List[List[int]]] = None

class ModelMetricsResponse(ModelMetricsCreate):
    id: int
    evaluated_at: datetime

    class Config:
        from_attributes = True

# Analytics Schemas
class DashboardStats(BaseModel):
    total_scans: int
    total_patients: int
    average_confidence: float
    disease_distribution: Dict[str, int]
    monthly_predictions: Dict[str, int]
    model_performance: List[Dict[str, Any]]

# Activity Log Schemas
class ActivityLogResponse(BaseModel):
    id: int
    action: str
    timestamp: datetime
    user_id: Optional[int] = None
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True
