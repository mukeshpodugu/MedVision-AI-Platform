from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from ..core.database import get_db
from ..core.security import get_current_user
from ..core.config import settings
from .. import models, schemas

router = APIRouter(prefix="/reports", tags=["Reports Management"])

@router.get("/{prediction_id}", response_model=schemas.ReportResponse)
def get_report_by_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieves the report metadata for a specific prediction ID.
    """
    report = db.query(models.Report).filter(models.Report.prediction_id == prediction_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medical report not found for this prediction."
        )
    return report

@router.get("/{prediction_id}/download")
def download_pdf_report(
    prediction_id: int,
    db: Session = Depends(get_db)
):
    """
    Downloads the generated PDF medical report.
    """
    report = db.query(models.Report).filter(models.Report.prediction_id == prediction_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medical report not found for this prediction."
        )
        
    # Build absolute path to PDF
    filename = os.path.basename(report.report_path)
    abs_path = os.path.join(settings.UPLOAD_DIR, "reports", filename)
    
    if not os.path.exists(abs_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physical PDF file was not found on disk."
        )
        
    # Return as direct file download
    # Get clean patient name for filename
    pred = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    clean_name = pred.patient.name.replace(" ", "_") if pred else "patient"
    
    return FileResponse(
        abs_path,
        media_type="application/pdf",
        filename=f"MedVision_Report_{clean_name}_{prediction_id}.pdf"
    )
