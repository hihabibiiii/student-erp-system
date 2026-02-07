from flask import Flask, render_template, request, redirect, url_for, session
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from functools import wraps
import os
from dotenv import load_dotenv


load_dotenv()



# ---------------- CONFIG DATA ----------------
CLASSES = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","BA I", "BA II", "BA III", "BA IV"]

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
if not app.secret_key:
    raise RuntimeError("FLASK_SECRET_KEY not set in .env")

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax"
)

# ---------------- DATABASE ----------------
DB_PATH = os.getenv("DB_PATH", "database.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    # ---------- STUDENTS ----------
    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            roll TEXT,
            class_name TEXT,
            phone TEXT,
            total_fee INTEGER,
            paid_fee INTEGER
        )
    """)

    # ---------- FEE PAYMENTS ----------
    conn.execute("""
        CREATE TABLE IF NOT EXISTS fee_payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            amount INTEGER,
            month TEXT,
            pay_date TEXT
        )
    """)

    # ---------- ADMIN ----------
    conn.execute("""
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    """)

    # 🔐 ADD security_answer COLUMN IF MISSING
    cols = [c[1] for c in conn.execute("PRAGMA table_info(admin)").fetchall()]
    if "security_answer" not in cols:
        conn.execute("ALTER TABLE admin ADD COLUMN security_answer TEXT")

    # ---------- DEFAULT ADMIN ----------
    admin = conn.execute("SELECT * FROM admin").fetchone()
    if not admin:
        ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
        ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
        ADMIN_SECURITY_ANSWER = os.getenv("ADMIN_SECURITY_ANSWER")

        if not ADMIN_USERNAME or not ADMIN_PASSWORD or not ADMIN_SECURITY_ANSWER:
            raise RuntimeError("Admin credentials missing in .env file")

        hashed_pass = generate_password_hash(ADMIN_PASSWORD)
        hashed_ans  = generate_password_hash(ADMIN_SECURITY_ANSWER)

        conn.execute(
            "INSERT INTO admin (username, password, security_answer) VALUES (?, ?, ?)",
            (ADMIN_USERNAME, hashed_pass, hashed_ans)
        )


    conn.commit()
    conn.close()


init_db()

# ---------------- SECURITY ----------------
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "admin" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated

# ---------------- ROUTES ----------------
@app.route("/", methods=["GET","POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db()
        admin = conn.execute(
            "SELECT * FROM admin WHERE username=?",
            (username,)
        ).fetchone()
        conn.close()

        if admin and check_password_hash(admin["password"], password):
            session["admin"] = username
            return redirect(url_for("dashboard"))

        return render_template("login.html", error="Invalid credentials")

    return render_template("login.html")

@app.route("/forgot", methods=["GET", "POST"])
def forgot():
    error = None
    success = None

    if request.method == "POST":
        answer = request.form["answer"]
        new_username = request.form["new_username"]
        new_password = request.form["new_password"]

        conn = get_db()
        admin = conn.execute("SELECT * FROM admin").fetchone()

        if not check_password_hash(admin["security_answer"], answer):
            error = "Security answer is incorrect"
        else:
            hashed_pass = generate_password_hash(new_password)
            conn.execute("""
                UPDATE admin
                SET username=?, password=?
                WHERE id=?
            """, (new_username, hashed_pass, admin["id"]))
            conn.commit()
            success = "Username & Password reset successfully"

        conn.close()

    return render_template("forgot.html", error=error, success=success)


@app.route("/logout")
def logout():
    session.pop("admin", None)
    return redirect(url_for("login"))


@app.route("/change-password", methods=["GET", "POST"])
@login_required
def change_password():
    error = None
    success = None

    if request.method == "POST":
        old_password = request.form["old_password"]
        new_password = request.form["new_password"]
        confirm_password = request.form["confirm_password"]

        conn = get_db()
        admin = conn.execute(
            "SELECT * FROM admin WHERE username=?",
            (session["admin"],)
        ).fetchone()

        # OLD PASSWORD CHECK
        if not check_password_hash(admin["password"], old_password):
            error = "Old password is incorrect"

        elif new_password != confirm_password:
            error = "New passwords do not match"

        elif len(new_password) < 4:
            error = "Password must be at least 4 characters"

        else:
            hashed = generate_password_hash(new_password)
            conn.execute(
                "UPDATE admin SET password=? WHERE username=?",
                (hashed, session["admin"])
            )
            conn.commit()
            success = "Password updated successfully"

        conn.close()

    return render_template(
        "change_password.html",
        error=error,
        success=success
    )

@app.route("/change-username", methods=["GET", "POST"])
@login_required
def change_username():
    error = None
    success = None

    if request.method == "POST":
        new_username = request.form["new_username"].strip()
        password = request.form["password"]

        conn = get_db()

        # current admin
        admin = conn.execute(
            "SELECT * FROM admin WHERE username=?",
            (session["admin"],)
        ).fetchone()

        # password verify
        if not check_password_hash(admin["password"], password):
            error = "Password is incorrect"

        elif not new_username:
            error = "Username cannot be empty"

        else:
            # check duplicate username
            exists = conn.execute(
                "SELECT * FROM admin WHERE username=?",
                (new_username,)
            ).fetchone()

            if exists:
                error = "Username already exists"
            else:
                conn.execute(
                    "UPDATE admin SET username=? WHERE id=?",
                    (new_username, admin["id"])
                )
                conn.commit()
                session["admin"] = new_username
                success = "Username updated successfully"

        conn.close()

    return render_template(
        "change_username.html",
        error=error,
        success=success
    )

@app.route("/change-security-answer", methods=["GET", "POST"])
@login_required
def change_security_answer():
    error = None
    success = None

    if request.method == "POST":
        old_answer = request.form["old_answer"]
        new_answer = request.form["new_answer"]
        confirm_answer = request.form["confirm_answer"]

        conn = get_db()
        admin = conn.execute(
            "SELECT * FROM admin WHERE username=?",
            (session["admin"],)
        ).fetchone()

        # OLD ANSWER VERIFY
        if not check_password_hash(admin["security_answer"], old_answer):
            error = "Old security answer is incorrect"

        elif new_answer != confirm_answer:
            error = "Security answers do not match"

        elif len(new_answer) < 3:
            error = "Security answer must be at least 3 characters"

        else:
            hashed = generate_password_hash(new_answer)
            conn.execute(
                "UPDATE admin SET security_answer=? WHERE id=?",
                (hashed, admin["id"])
            )
            conn.commit()
            success = "Security answer updated successfully"

        conn.close()

    return render_template(
        "change_security_answer.html",
        error=error,
        success=success
    )


@app.route("/dashboard")
@login_required
def dashboard():
    conn = get_db()
    total_students = conn.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    total_fee = conn.execute("SELECT SUM(total_fee) FROM students").fetchone()[0] or 0
    total_paid = conn.execute("SELECT SUM(paid_fee) FROM students").fetchone()[0] or 0
    total_due = total_fee - total_paid
    conn.close()

    return render_template(
        "dashboard.html",
        total_students=total_students,
        total_paid=total_paid,
        total_due=total_due
    )

@app.route("/add-student", methods=["GET","POST"])
@login_required
def add_student():
    if request.method == "POST":
        name = request.form["name"]
        roll = request.form["roll"]
        class_name = request.form["class_name"]
        phone = request.form["phone"]
        total_fee = int(request.form["total_fee"])
        paid_fee = int(request.form["paid_fee"])

        if total_fee < 0 or paid_fee < 0 or paid_fee > total_fee:
            return render_template(
                "add_student.html",
                classes=CLASSES,
                error="Invalid fee amount"
            )

        conn = get_db()
        conn.execute("""
            INSERT INTO students
            (name, roll, class_name, phone, total_fee, paid_fee)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name, roll, class_name, phone, total_fee, paid_fee))
        conn.commit()
        conn.close()

        return redirect(url_for("students"))

    return render_template("add_student.html", classes=CLASSES)

@app.route("/students")
@login_required
def students():
    selected_class = request.args.get("class")

    conn = get_db()

    # 🔹 CLASS FILTER + DUE SORT
    if selected_class and selected_class != "all":
        students = conn.execute("""
            SELECT *,
            (total_fee - paid_fee) AS due_amount
            FROM students
            WHERE class_name=?
            ORDER BY due_amount DESC
        """, (selected_class,)).fetchall()
    else:
        students = conn.execute("""
            SELECT *,
            (total_fee - paid_fee) AS due_amount
            FROM students
            ORDER BY due_amount DESC
        """).fetchall()

    conn.close()

    return render_template(
        "students.html",
        students=students,
        classes=CLASSES,
        selected_class=selected_class
    )

@app.route("/delete-student/<int:id>")
@login_required
def delete_student(id):
    conn = get_db()
    conn.execute("DELETE FROM students WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return redirect(url_for("students"))

@app.route("/edit-student/<int:id>", methods=["GET","POST"])
@login_required
def edit_student(id):
    conn = get_db()

    if request.method == "POST":
        name = request.form["name"]
        roll = request.form["roll"]
        class_name = request.form["class_name"]
        phone = request.form["phone"]
        total_fee = int(request.form["total_fee"])
        paid_fee = int(request.form["paid_fee"])

        conn.execute("""
            UPDATE students
            SET name=?, roll=?, class_name=?, phone=?, total_fee=?, paid_fee=?
            WHERE id=?
        """, (name, roll, class_name, phone, total_fee, paid_fee, id))

        conn.commit()
        conn.close()
        return redirect(url_for("students"))

    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()
    conn.close()

    return render_template(
        "edit_student.html",
        student=student,
        classes=CLASSES
    )
@app.route("/pay-fee/<int:id>", methods=["GET","POST"])
@login_required
def pay_fee(id):
    conn = get_db()

    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()

    if not student:
        conn.close()
        return redirect(url_for("students"))

    error = None
    remaining = student["total_fee"] - student["paid_fee"]

    if request.method == "POST":
        amount = int(request.form["amount"])

        # ❌ INVALID PAYMENT BLOCK
        if amount <= 0 or amount > remaining:
            error = "Invalid payment amount"
        else:
            new_paid = student["paid_fee"] + amount

            conn.execute(
                "UPDATE students SET paid_fee=? WHERE id=?",
                (new_paid, id)
            )

            conn.commit()
            conn.close()
            return redirect(url_for("students"))

    conn.close()
    return render_template(
        "pay_fee.html",
        student=student,
        remaining=remaining,
        error=error
    )


@app.route("/pay-monthly-fee/<int:id>", methods=["GET","POST"])
@login_required
def pay_monthly_fee(id):
    conn = get_db()
    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()

    error = None

    if request.method == "POST":
        amount = int(request.form["amount"])
        month = request.form["month"]

        remaining = student["total_fee"] - student["paid_fee"]

        if amount <= 0 or amount > remaining:
            error = "Invalid payment amount"
        else:
            existing = conn.execute("""
                SELECT * FROM fee_payments
                WHERE student_id=? AND month=?
            """, (id, month)).fetchone()

            if existing:
                error = f"Fee for {month} already paid!"
            else:
                conn.execute("""
                    INSERT INTO fee_payments
                    (student_id, amount, month, pay_date)
                    VALUES (?, ?, ?, ?)
                """, (id, amount, month, str(date.today())))

                conn.execute(
                    "UPDATE students SET paid_fee=? WHERE id=?",
                    (student["paid_fee"] + amount, id)
                )

                conn.commit()
                conn.close()
                return redirect(url_for("students"))

    payments = conn.execute(
        "SELECT * FROM fee_payments WHERE student_id=?",
        (id,)
    ).fetchall()
    conn.close()

    return render_template(
        "monthly_fee.html",
        student=student,
        payments=payments,
        error=error,
        months=MONTHS
    )

@app.route("/monthly-receipt/<int:payment_id>")
@login_required
def monthly_receipt(payment_id):
    conn = get_db()
    payment = conn.execute("""
        SELECT fp.*, s.name, s.class_name, s.roll
        FROM fee_payments fp
        JOIN students s ON fp.student_id = s.id
        WHERE fp.id=?
    """, (payment_id,)).fetchone()
    conn.close()

    return render_template("monthly_receipt.html", payment=payment)

@app.route("/receipt/<int:id>")
@login_required
def receipt(id):
    conn = get_db()

    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()

    conn.close()

    if not student:
        return "Student not found", 404

    return render_template("receipt.html", student=student)



# ---------------- RUN ----------------
if __name__ == "__main__":
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=DEBUG)

