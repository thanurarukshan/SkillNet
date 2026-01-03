import mysql.connector
import json
import pickle

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

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

def recruiter_engine_ml(job_input):
    job_skills = job_input.get("skills", [])
    position = job_input.get("position")

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM skills")
    students = cursor.fetchall()

    results = []

    for stu in students:
        verified = json.loads(stu["verified_skills"])
        unverified = json.loads(stu["unverified_skills"])

        features = extract_features(job_skills, verified, unverified)
        score = model.predict([features])[0]

        results.append({
            "student_id": stu["student_id"],
            "score": round(float(score), 2)
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "position": position,
        "ranked_students": results
    }
