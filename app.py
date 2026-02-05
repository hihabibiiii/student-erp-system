from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3

CLASSES = [
    "1st", "2nd", "3rd", "4th", "5th",
    "6th", "7th", "8th", "9th", "10th"
]

app = Flask(__name__)
app.secret_key = "secret123"   # session key


# ---------- DATABASE ----------
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    # students table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            roll TEXT,
            class_name TEXT,
            phone TEXT
        )
    """)

    # admin table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    """)

    # default admin insert (only once)
    admin = conn.execute("SELECT * FROM admin").fetchone()
    if not admin:
        conn.execute(
            "INSERT INTO admin (username, password) VALUES (?, ?)",
            ("admin", "1234")
        )

    conn.commit()
    conn.close()


init_db()

# ---------- ROUTES ----------
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db()
        admin = conn.execute(
            "SELECT * FROM admin WHERE username=? AND password=?",
            (username, password)
        ).fetchone()
        conn.close()

        if admin:
            session["admin"] = username
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", error="Invalid credentials")

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    if "admin" not in session:
        return redirect(url_for("login"))
    return render_template("dashboard.html")


@app.route("/logout")
def logout():
    session.pop("admin", None)
    return redirect(url_for("login"))


@app.route("/add-student", methods=["GET", "POST"])
def add_student():
    if "admin" not in session:
        return redirect(url_for("login"))

    if request.method == "POST":
        name = request.form["name"]
        roll = request.form["roll"]
        class_name = request.form["class_name"]
        phone = request.form["phone"]

        conn = get_db()
        conn.execute(
            "INSERT INTO students (name, roll, class_name, phone) VALUES (?, ?, ?, ?)",
            (name, roll, class_name, phone)
        )
        conn.commit()
        conn.close()

        return redirect(url_for("students"))

    return render_template("add_student.html", classes=CLASSES)


@app.route("/students")
def students():
    if "admin" not in session:
        return redirect(url_for("login"))

    selected_class = request.args.get("class")

    conn = get_db()

    if selected_class and selected_class != "all":
        students = conn.execute(
            "SELECT * FROM students WHERE class_name = ?",
            (selected_class,)
        ).fetchall()
    else:
        students = conn.execute("SELECT * FROM students").fetchall()

    conn.close()

    return render_template(
        "students.html",
        students=students,
        classes=CLASSES,
        selected_class=selected_class
    )


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
