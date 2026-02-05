from flask import Flask, render_template, request, redirect, url_for, session
from datetime import date

import sqlite3

CLASSES = [
    "1st", "2nd", "3rd", "4th", "5th",
    "6th", "7th", "8th", "9th", "10th"
]

MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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


    conn.execute("""
    CREATE TABLE IF NOT EXISTS fee_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        amount INTEGER,
        month TEXT,
        pay_date TEXT,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
""")

    # students table
    
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

    conn = get_db()

    total_students = conn.execute(
        "SELECT COUNT(*) FROM students"
    ).fetchone()[0]

    total_fee = conn.execute(
        "SELECT SUM(total_fee) FROM students"
    ).fetchone()[0] or 0

    total_paid = conn.execute(
        "SELECT SUM(paid_fee) FROM students"
    ).fetchone()[0] or 0

    total_due = total_fee - total_paid

    conn.close()

    return render_template(
        "dashboard.html",
        total_students=total_students,
        total_paid=total_paid,
        total_due=total_due
    )


@app.route("/receipt/<int:id>")
def receipt(id):
    if "admin" not in session:
        return redirect(url_for("login"))

    conn = get_db()
    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()
    conn.close()

    return render_template("receipt.html", student=student)


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
        total_fee = int(request.form["total_fee"])
        paid_fee = int(request.form["paid_fee"])

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
        "SELECT * FROM students WHERE id = ?", (id,)
    ).fetchone()
    conn.close()

    return render_template(
        "edit_student.html",
        student=student,
        classes=CLASSES
    )

@app.route("/pay-fee/<int:id>", methods=["GET", "POST"])
def pay_fee(id):
    if "admin" not in session:
        return redirect(url_for("login"))

    conn = get_db()

    if request.method == "POST":
        amount = int(request.form["amount"])

        # current paid fee
        student = conn.execute(
            "SELECT paid_fee FROM students WHERE id=?",
            (id,)
        ).fetchone()

        new_paid = student["paid_fee"] + amount

        conn.execute(
            "UPDATE students SET paid_fee=? WHERE id=?",
            (new_paid, id)
        )

        conn.commit()
        conn.close()
        return redirect(url_for("students"))

    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()

    conn.close()
    return render_template("pay_fee.html", student=student)


@app.route("/pay-monthly-fee/<int:id>", methods=["GET", "POST"])
def pay_monthly_fee(id):
    if "admin" not in session:
        return redirect(url_for("login"))

    conn = get_db()

    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()

    error = None

    if request.method == "POST":
        amount = int(request.form["amount"])
        month = request.form["month"]

        # 🔒 DUPLICATE MONTH CHECK
        existing = conn.execute("""
            SELECT * FROM fee_payments
            WHERE student_id=? AND month=?
        """, (id, month)).fetchone()

        if existing:
            error = f"Fee for {month} already paid!"
        else:
            # insert payment
            conn.execute("""
                INSERT INTO fee_payments (student_id, amount, month, pay_date)
                VALUES (?, ?, ?, ?)
            """, (id, amount, month, str(date.today())))

            # update paid_fee
            new_paid = student["paid_fee"] + amount
            conn.execute(
                "UPDATE students SET paid_fee=? WHERE id=?",
                (new_paid, id)
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
def monthly_receipt(payment_id):
    if "admin" not in session:
        return redirect(url_for("login"))

    conn = get_db()

    payment = conn.execute("""
        SELECT fp.*, s.name, s.class_name, s.roll
        FROM fee_payments fp
        JOIN students s ON fp.student_id = s.id
        WHERE fp.id=?
    """, (payment_id,)).fetchone()

    conn.close()

    return render_template("monthly_receipt.html", payment=payment)




# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)
