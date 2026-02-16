import mysql.connector
import json
import pickle
import os

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "skillnet"),
        password=os.environ.get("DB_PASSWORD", "Skillnet@123"),
        database=os.environ.get("DB_NAME", "skillnet")
    )

def extract_features(job_skills, verified, unverified):
    # Case-insensitive matching
    job_skills = set(s.lower().strip() for s in job_skills)
    verified = set(s.lower().strip() for s in verified)
    unverified = set(s.lower().strip() for s in unverified)

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
    position = job_input.get("position", "")
    top_n = job_input.get("top_n", 20)

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Get students with their skills AND profile info
    cursor.execute("""
        SELECT s.student_id, s.verified_skills, s.unverified_skills,
               a.name, a.username AS email, a.department, a.academic_year
        FROM skills s
        JOIN auth a ON s.student_id = a.id
        WHERE a.category = 'Student'
    """)
    students = cursor.fetchall()
    cursor.close()
    db.close()

    results = []

    for stu in students:
        verified = json.loads(stu["verified_skills"]) if isinstance(stu["verified_skills"], str) else (stu["verified_skills"] or [])
        unverified = json.loads(stu["unverified_skills"]) if isinstance(stu["unverified_skills"], str) else (stu["unverified_skills"] or [])

        features = extract_features(job_skills, verified, unverified)
        score = model.predict([features])[0]

        # Only include students with score > 0
        if score > 0:
            results.append({
                "student_id": stu["student_id"],
                "name": stu["name"],
                "email": stu["email"],
                "department": stu["department"],
                "academic_year": stu["academic_year"],
                "verified_skills": verified,
                "unverified_skills": unverified,
                "score": round(float(score), 2)
            })

    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "position": position,
        "ranked_students": results[:top_n],
        "total_evaluated": len(students),
        "total_matched": len(results)
    }
