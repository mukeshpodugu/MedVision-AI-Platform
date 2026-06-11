from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import uuid
from datetime import datetime
from ..core.database import get_db
from ..core.security import get_current_user
from ..core.config import settings
from ..services.ai_service import AIService
from ..services.report_service import ReportService
from .. import models, schemas

router = APIRouter(prefix="/predictions", tags=["Predictions & Diagnostic Workflows"])

# Allowed extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

@router.post("/analyze", response_model=schemas.PredictionResponse, status_code=status.HTTP_201_CREATED)
async def analyze_scan(
    category: str = Form(...),
    model_name: str = Form(...),
    patient_name: str = Form(...),
    patient_age: int = Form(...),
    patient_gender: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Primary endpoint: Handles scan upload, registers/finds patient, runs CNN model,
    performs Grad-CAM generation, registers DB entries, and generates PDF report.
    """
    # 1. Image Validation
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    # Create file paths
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    scan_filepath = os.path.join(settings.UPLOAD_DIR, "scans", unique_filename)
    
    # Save the file
    try:
        with open(scan_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save uploaded file: {e}"
        )
        
    # 2. Get or Create Patient
    patient = db.query(models.Patient).filter(
        models.Patient.name == patient_name,
        models.Patient.age == patient_age,
        models.Patient.gender == patient_gender
    ).first()
    
    if not patient:
        patient = models.Patient(
            name=patient_name,
            age=patient_age,
            gender=patient_gender
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
        
    # 3. Create UploadedImage record
    db_image = models.UploadedImage(
        filename=file.filename,
        file_path=f"/uploads/scans/{unique_filename}",
        category=category,
        uploaded_by=current_user.id
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    # 4. Invoke AI Inference Service
    try:
        ai_res = AIService.classify_image(scan_filepath, category, model_name)
    except Exception as e:
        # Cleanup file if error occurs
        if os.path.exists(scan_filepath):
            os.remove(scan_filepath)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI inference error: {e}"
        )
        
    # 5. Create Prediction Record
    db_prediction = models.Prediction(
        image_id=db_image.id,
        patient_id=patient.id,
        model_name=model_name,
        predicted_class=ai_res["predicted_class"],
        confidence=ai_res["confidence"],
        explainability_path=ai_res["explainability_path"]
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    # 6. Generate PDF Medical Report
    # Format dates and schemas for PDF generator
    prediction_dict = {
        "id": db_prediction.id,
        "category": category,
        "model_name": model_name,
        "predicted_class": db_prediction.predicted_class,
        "confidence": db_prediction.confidence,
        "findings": ai_res["findings"],
        "created_at": db_prediction.created_at
    }
    patient_dict = {
        "id": patient.id,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender
    }
    
    try:
        report_url = ReportService.generate_pdf_report(
            prediction_dict,
            patient_dict,
            db_image.file_path,
            db_prediction.explainability_path
        )
        
        # Save Report Record
        db_report = models.Report(
            prediction_id=db_prediction.id,
            report_path=report_url
        )
        db.add(db_report)
        db.commit()
    except Exception as e:
        print(f"Failed to generate PDF report: {e}")
        # Not throwing HTTP error to prevent failing the entire prediction process; 
        # report download is treated as a secondary feature.
        
    # Log Activity
    log = models.ActivityLog(
        user_id=current_user.id,
        action=f"Completed {category} diagnosis for patient {patient.name} ({ai_res['predicted_class']})"
    )
    db.add(log)
    db.commit()
    
    # Return formatted prediction response
    # (FastAPI will serialize relationships defined in models automatically)
    return db_prediction

@router.get("/", response_model=List[schemas.PredictionResponse])
def get_predictions(
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_confidence: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieves and filters diagnostic prediction histories.
    """
    query = db.query(models.Prediction).join(models.Patient).join(models.UploadedImage)
    
    if search:
        # Search by patient name or predicted class
        query = query.filter(
            (models.Patient.name.ilike(f"%{search}%")) |
            (models.Prediction.predicted_class.ilike(f"%{search}%"))
        )
    if category:
        query = query.filter(models.UploadedImage.category == category)
    if min_confidence:
        query = query.filter(models.Prediction.confidence >= min_confidence)
        
    return query.order_by(models.Prediction.created_at.desc()).all()

@router.get("/{prediction_id}", response_model=schemas.PredictionResponse)
def get_prediction_detail(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieves full details of a specific prediction.
    """
    prediction = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    return prediction
