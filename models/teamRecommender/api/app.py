from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector

app = Flask(__name__)

# Load trained vectorizer
vectorizer = joblib.load("model/vectorizer.pkl")

# MySQL connection config
db_config = {
    "host": "localhost",
    "user": "skillnet",
    "password": "Skillnet@123",
    "database": "skillnet"
}

def fetch_teams_from_db():
    """Fetch all teams from MySQL as a DataFrame"""
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT t_id, t_name, t_skills_req FROM teams")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Convert JSON skills (stored as string) to comma-separated string for vectorizer
    for r in rows:
        if isinstance(r["t_skills_req"], str):
            r["t_skills_req"] = r["t_skills_req"].replace('"', '').replace('[','').replace(']','')
    return pd.DataFrame(rows)

def recommend_teams(student_skills, teams_df, top_n=3):
    """Compute similarity and return top N recommended teams"""
    team_vectors = vectorizer.transform(teams_df["t_skills_req"])
    student_vector = vectorizer.transform([student_skills])
    similarities = cosine_similarity(student_vector, team_vectors).flatten()
    top_indices = similarities.argsort()[::-1][:top_n]
    recommended = teams_df.iloc[top_indices]
    return recommended[["t_name", "t_skills_req"]].to_dict(orient="records")

@app.route("/ml/recommend", methods=["POST"])
def ml_recommend():
    data = request.get_json()
    if not data or "skills" not in data:
        return jsonify({"error": "Please provide 'skills' in JSON body"}), 400

    student_skills = data["skills"]
    top_n = data.get("top_n", 3)

    # Fetch teams dynamically from MySQL
    teams_df = fetch_teams_from_db()
    recommendations = recommend_teams(student_skills, teams_df, top_n)

    return jsonify({
        "student_skills": student_skills,
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
