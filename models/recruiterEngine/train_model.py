# train_model.py
import mysql.connector
import json
import pickle
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="skillnet",
        password="Skillnet@123",
        database="skillnet"
    )

def extract_features(job_skills, verified, unverified):
    job_skills = set(job_skills)
    verified = set(verified)
    unverified = set(unverified)

    total = len(job_skills)
    if total == 0:
        return [0, 0, 0, 0, 0]

    verified_matches = len(job_skills & verified)
    unverified_matches = len(job_skills & unverified)

    return [
        verified_matches,
        unverified_matches,
        total,
        verified_matches / total,
        unverified_matches / total
    ]

# Dummy job (for bootstrapping training)
job_skills = ["Java", "Spring Boot", "MySQL"]

db = get_db_connection()
cursor = db.cursor(dictionary=True)
cursor.execute("SELECT * FROM skills")
students = cursor.fetchall()

X = []
y = []

for stu in students:
    verified = json.loads(stu["verified_skills"])
    unverified = json.loads(stu["unverified_skills"])

    features = extract_features(job_skills, verified, unverified)
    score = (
        (features[0] / features[2]) * 70 +
        (features[1] / features[2]) * 30
    ) if features[2] > 0 else 0

    X.append(features)
    y.append(score)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved as model.pkl")
