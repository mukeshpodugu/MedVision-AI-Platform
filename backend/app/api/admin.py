from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..core.security import get_current_admin
from .. import models, schemas

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/logs", response_model=List[schemas.ActivityLogResponse])
def get_activity_logs(
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin)
):
    """
    Fetches the system audit activity logs (Admin Only).
    """
    logs = db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).limit(limit).all()
    return logs

@router.get("/users", response_model=List[schemas.UserResponse])
def get_users(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin)
):
    """
    Lists all registered users (Admin Only).
    """
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@router.post("/metrics", response_model=schemas.ModelMetricsResponse)
def add_model_metrics(
    metrics_in: schemas.ModelMetricsCreate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin)
):
    """
    Registers or updates model evaluation performance metrics (Admin Only).
    """
    # Check if metrics exist for model/category combination
    existing = db.query(models.ModelMetrics).filter(
        models.ModelMetrics.model_name == metrics_in.model_name,
        models.ModelMetrics.category_name == metrics_in.category_name
    ).first()
    
    if existing:
        existing.accuracy = metrics_in.accuracy
        existing.precision = metrics_in.precision
        existing.recall = metrics_in.recall
        existing.f1_score = metrics_in.f1_score
        existing.confusion_matrix = metrics_in.confusion_matrix
        db_metrics = existing
    else:
        db_metrics = models.ModelMetrics(
            model_name=metrics_in.model_name,
            category_name=metrics_in.category_name,
            accuracy=metrics_in.accuracy,
            precision=metrics_in.precision,
            recall=metrics_in.recall,
            f1_score=metrics_in.f1_score,
            confusion_matrix=metrics_in.confusion_matrix
        )
        db.add(db_metrics)
        
    db.commit()
    db.refresh(db_metrics)
    
    # Log action
    log = models.ActivityLog(
        user_id=admin_user.id,
        action=f"Updated model metrics for {metrics_in.model_name} ({metrics_in.category_name})"
    )
    db.add(log)
    db.commit()
    
    return db_metrics
