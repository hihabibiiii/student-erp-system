from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# ---------- DATABASE ----------
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            roll TEXT,
            class_name TEXT,
            phone TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# ---------- ROUTES ----------
@app.route("/")
def login():
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/add-student", methods=["GET", "POST"])
def add_student():
    if request.method == "POST":
        name = request.form["name"]
        roll = request.form["roll"]
        class_name = request.form["class"]
        phone = request.form["phone"]

        conn = get_db()
        conn.execute(
            "INSERT INTO students (name, roll, class_name, phone) VALUES (?, ?, ?, ?)",
            (name, roll, class_name, phone)
        )
        conn.commit()
        conn.close()

        return redirect(url_for("students"))

    return render_template("add_student.html")

@app.route("/students")
def students():
    conn = get_db()
    data = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    return render_template("students.html", students=data)

@app.route("/delete-student/<int:id>")
def delete_student(id):
    conn = get_db()
    conn.execute("DELETE FROM students WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return redirect(url_for("students"))

@app.route("/edit-student/<int:id>", methods=["GET", "POST"])
def edit_student(id):
    conn = get_db()

    if request.method == "POST":
        name = request.form["name"]
        roll = request.form["roll"]
        class_name = request.form["class_name"]
        phone = request.form["phone"]

        conn.execute("""
            UPDATE students
            SET name=?, roll=?, class_name=?, phone=?
            WHERE id=?
        """, (name, roll, class_name, phone, id))

        conn.commit()
        conn.close()
        return redirect(url_for("students"))

    student = conn.execute(
        "SELECT * FROM students WHERE id = ?", (id,)
    ).fetchone()
    conn.close()

    return render_template("edit_student.html", student=student)

# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)
