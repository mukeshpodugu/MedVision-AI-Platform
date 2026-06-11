import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ...app.main import app
from ...app.core.database import Base, get_db
from ...app.core.config import settings

# Setup isolated test database engine (SQLite memory)
TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database session dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "online"
    assert "developer" in json_data
    assert json_data["developer"]["name"] == "PODUGU MUKESH"

def test_user_registration_and_login():
    # 1. Register User
    reg_payload = {
        "email": "test_doctor@medvision.ai",
        "full_name": "Test Medical Doctor",
        "password": "TestPassword123",
        "role": "doctor"
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 201
    reg_data = response.json()
    assert reg_data["email"] == reg_payload["email"]
    assert reg_data["full_name"] == reg_payload["full_name"]
    
    # 2. Login User
    login_payload = {
        "username": "test_doctor@medvision.ai",
        "password": "TestPassword123"
    }
    response = client.post("/api/v1/auth/login", data=login_payload)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    
    # 3. Access current profile
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    profile_data = response.json()
    assert profile_data["email"] == reg_payload["email"]

def test_patient_management():
    # Retrieve login token
    login_payload = {
        "username": "test_doctor@medvision.ai",
        "password": "TestPassword123"
    }
    login_res = client.post("/api/v1/auth/login", data=login_payload)
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Create Patient
    patient_payload = {
        "name": "Alex Mercer",
        "age": 34,
        "gender": "Male"
    }
    response = client.post("/api/v1/patients/", json=patient_payload, headers=headers)
    assert response.status_code == 201
    patient_data = response.json()
    assert patient_data["name"] == patient_payload["name"]
    assert "id" in patient_data
    
    # 2. Read Patients List
    list_res = client.get("/api/v1/patients/", headers=headers)
    assert list_res.status_code == 200
    patients_list = list_res.json()
    assert len(patients_list) >= 1
    assert any(p["name"] == "Alex Mercer" for p in patients_list)
