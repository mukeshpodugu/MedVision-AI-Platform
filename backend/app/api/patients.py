from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..core.security import get_current_user
from .. import models, schemas

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/", response_model=List[schemas.PatientResponse])
def get_patients(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieves all patients with optional search by name.
    """
    query = db.query(models.Patient)
    if search:
        query = query.filter(models.Patient.name.ilike(f"%{search}%"))
    return query.order_by(models.Patient.created_at.desc()).all()

@router.post("/", response_model=schemas.PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_in: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Creates a new patient profile.
    """
    db_patient = models.Patient(
        name=patient_in.name,
        age=patient_in.age,
        gender=patient_in.gender
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieves details of a single patient by ID.
    """
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return patient

@router.get("/{patient_id}/predictions", response_model=List[schemas.PredictionResponse])
def get_patient_predictions(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieves the entire diagnostic/prediction history of a specific patient.
    """
    # Verify patient exists
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
        
    predictions = db.query(models.Prediction).filter(
        models.Prediction.patient_id == patient_id
    ).order_by(models.Prediction.created_at.desc()).all()
    
    return predictions
