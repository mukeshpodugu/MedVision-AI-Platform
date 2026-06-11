from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from .core.config import settings
from .core.database import Base, engine, SessionLocal
from .core.security import get_password_hash
from . import models

# Import routers
from .api import auth, patients, predictions, reports, analytics, admin

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed database with initial users and metrics
def seed_database():
    db = SessionLocal()
    try:
        # 1. Check if admin user exists, else seed it
        admin_email = "admin@medvision.ai"
        admin_user = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin_user:
            hashed_pw = get_password_hash("AdminPassword123")
            admin_user = models.User(
                email=admin_email,
                hashed_password=hashed_pw,
                full_name="MedVision Admin",
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("Seeded admin user.")

        # 2. Check if default developer user (doctor) exists, else seed it
        dev_email = "mukesh@medvision.ai"
        dev_user = db.query(models.User).filter(models.User.email == dev_email).first()
        if not dev_user:
            hashed_pw = get_password_hash("MukeshPassword123")
            dev_user = models.User(
                email=dev_email,
                hashed_password=hashed_pw,
                full_name="PODUGU MUKESH",
                role="doctor"
            )
            db.add(dev_user)
            db.commit()
            print("Seeded developer doctor user (PODUGU MUKESH).")
            
        # 3. Seed some default disease category mappings
        categories = [
            ("chest_xray", ["Normal", "Pneumonia", "Tuberculosis"]),
            ("skin", ["Healthy Skin", "Melanoma", "Eczema", "Psoriasis", "Acne"]),
            ("brain_mri", ["Normal Brain", "Brain Tumor"]),
            ("eye_retinopathy", ["Normal", "Mild", "Moderate", "Severe"])
        ]
        for name, diseases in categories:
            cat_exists = db.query(models.DiseaseCategory).filter(models.DiseaseCategory.category_name == name).first()
            if not cat_exists:
                db_cat = models.DiseaseCategory(category_name=name, diseases=diseases)
                db.add(db_cat)
        db.commit()

        # 4. Seed initial model metrics if empty
        metrics_count = db.query(models.ModelMetrics).count()
        if metrics_count == 0:
            initial_metrics = [
                models.ModelMetrics(model_name="ResNet50", category_name="chest_xray", accuracy=0.954, precision=0.948, recall=0.951, f1_score=0.949, confusion_matrix=[[45, 3, 2], [2, 48, 0], [1, 2, 47]]),
                models.ModelMetrics(model_name="EfficientNet", category_name="chest_xray", accuracy=0.972, precision=0.969, recall=0.970, f1_score=0.969, confusion_matrix=[[48, 1, 1], [1, 49, 0], [0, 1, 49]]),
                models.ModelMetrics(model_name="MobileNetV2", category_name="chest_xray", accuracy=0.938, precision=0.931, recall=0.935, f1_score=0.933, confusion_matrix=[[44, 4, 2], [3, 46, 1], [2, 3, 45]]),
                
                models.ModelMetrics(model_name="EfficientNet", category_name="skin", accuracy=0.945, precision=0.941, recall=0.943, f1_score=0.942, confusion_matrix=[[38, 2, 0], [1, 39, 0], [0, 1, 39]]),
                models.ModelMetrics(model_name="EfficientNet", category_name="brain_mri", accuracy=0.983, precision=0.980, recall=0.982, f1_score=0.981, confusion_matrix=[[49, 1], [0, 50]]),
                models.ModelMetrics(model_name="EfficientNet", category_name="eye_retinopathy", accuracy=0.958, precision=0.952, recall=0.955, f1_score=0.953, confusion_matrix=[[24, 1, 0, 0], [1, 23, 1, 0], [0, 1, 24, 0], [0, 0, 1, 24]])
            ]
            db.bulk_save_objects(initial_metrics)
            db.commit()
            print("Seeded default model metrics.")
            
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Disease Detection & Health Analytics Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, configure specifically
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory to serve files statically
# Ensure paths are served as "/uploads" -> settings.UPLOAD_DIR
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(patients.router, prefix=settings.API_V1_STR)
app.include_router(predictions.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def get_root():
    return {
        "status": "online",
        "message": "Welcome to MedVision AI API Platform",
        "developer": {
            "name": settings.DEVELOPER_NAME,
            "email": settings.DEVELOPER_EMAIL,
            "phone": settings.DEVELOPER_PHONE,
            "location": settings.DEVELOPER_LOCATION,
        },
        "docs": "/docs"
    }
