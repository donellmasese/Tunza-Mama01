const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "tunza_mama_secret_key_2026";

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", database: "SQLite (tunza_mama.db)" });
});

// 1. Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, phone, password, role, stageOrSpecialty } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === "counsellor" ? "counsellor" : "mother";
    const verification = userRole === "counsellor" ? "Pending Verification" : "Verified";

    const info = db
      .prepare(
        `INSERT INTO users (full_name, email, phone, password_hash, role, maternal_stage, specialisation, verification_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        fullName,
        email,
        phone,
        hashed,
        userRole,
        userRole === "mother" ? stageOrSpecialty : null,
        userRole === "counsellor" ? stageOrSpecialty : null,
        verification
      );

    const token = jwt.sign({ id: info.lastInsertRowid, role: userRole }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: info.lastInsertRowid,
        fullName,
        email,
        role: userRole,
        verification_status: verification,
      },
    });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// 2. Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Public Verified Counsellors
app.get("/api/counsellors", (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, full_name, qualification, specialisation, session_mode, languages, location, bio, is_accepting_slots FROM users WHERE role = 'counsellor' AND verification_status = 'Verified'"
      )
      .all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Book Appointment (With Double-Booking Prevention)
app.post("/api/appointments", (req, res) => {
  try {
    let {
      womanId,
      counsellorId,
      appointmentDate,
      appointmentTime,
      sessionMode,
      notes,
    } = req.body;

    // Ensure womanId exists in users table (fallback to any mother or create demo user)
    let woman = womanId
      ? db.prepare("SELECT id FROM users WHERE id = ?").get(womanId)
      : db.prepare("SELECT id FROM users WHERE role = 'mother' LIMIT 1").get();

    if (!woman) {
      const wInfo = db
        .prepare(
          `INSERT INTO users (full_name, email, phone, password_hash, role, verification_status)
           VALUES (?, ?, ?, ?, 'mother', 'Verified')`
        )
        .run("Sample Mother", `mother_${Date.now()}@tunzamama.org`, "0700000000", "demo_hash");
      woman = { id: wInfo.lastInsertRowid };
    }

    // Ensure counsellorId exists in users table (seed prototype counsellor if needed)
    let counsellor = counsellorId
      ? db.prepare("SELECT id FROM users WHERE id = ? AND role = 'counsellor'").get(counsellorId)
      : null;

    if (!counsellor) {
      const sampleEmail = `counsellor${counsellorId || 1}@tunzamama.org`;
      let existing = db.prepare("SELECT id FROM users WHERE email = ?").get(sampleEmail);
      if (!existing) {
        const cInfo = db
          .prepare(
            `INSERT INTO users (full_name, email, phone, password_hash, role, specialisation, verification_status)
             VALUES (?, ?, ?, ?, 'counsellor', 'Perinatal Mental Health', 'Verified')`
          )
          .run(
            `Sample Counsellor ${String.fromCharCode(64 + (Number(counsellorId) || 1))}`,
            sampleEmail,
            "0711000000",
            "demo_hash"
          );
        existing = { id: cInfo.lastInsertRowid };
      }
      counsellor = existing;
    }

    const conflict = db
      .prepare(
        `SELECT id FROM appointments 
         WHERE counsellor_id = ? AND appointment_date = ? AND appointment_time = ? AND status IN ('Pending', 'Confirmed')`
      )
      .get(counsellor.id, appointmentDate, appointmentTime);

    if (conflict) {
      return res.status(409).json({
        error: "This counsellor already has an appointment booked for that date and time slot.",
      });
    }

    const info = db
      .prepare(
        `INSERT INTO appointments (woman_id, counsellor_id, appointment_date, appointment_time, session_mode, notes)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        woman.id,
        counsellor.id,
        appointmentDate,
        appointmentTime,
        sessionMode || "Online",
        notes || ""
      );

    res.status(201).json({
      id: info.lastInsertRowid,
      status: "Pending",
      message: "Appointment request submitted.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get All Appointments
app.get("/api/appointments", (req, res) => {
  try {
    const rows = db
      .prepare(
        `SELECT a.*, w.full_name AS woman_name, c.full_name AS counsellor_name, c.specialisation
         FROM appointments a
         JOIN users w ON a.woman_id = w.id
         JOIN users c ON a.counsellor_id = c.id
         ORDER BY a.created_at DESC`
      )
      .all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Update Appointment Status / Reschedule
app.patch("/api/appointments/:id", (req, res) => {
  try {
    const { status, appointmentDate, appointmentTime } = req.body;
    db.prepare(
      `UPDATE appointments 
       SET status = COALESCE(?, status),
           appointment_date = COALESCE(?, appointment_date),
           appointment_time = COALESCE(?, appointment_time)
       WHERE id = ?`
    ).run(status || null, appointmentDate || null, appointmentTime || null, req.params.id);

    res.json({ message: "Appointment updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Follow-Up Records
app.get("/api/follow-ups", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM follow_ups ORDER BY created_at DESC").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/follow-ups", (req, res) => {
  try {
    const {
      counsellorId = 1,
      womanName,
      sessionStage,
      wellbeingNote,
      recommendedAction,
      nextCheckIn,
    } = req.body;

    const info = db
      .prepare(
        `INSERT INTO follow_ups (counsellor_id, woman_name, session_stage, wellbeing_note, recommended_action, next_check_in)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        counsellorId,
        womanName,
        sessionStage || "Follow-Up Session",
        wellbeingNote,
        recommendedAction,
        nextCheckIn
      );

    res.status(201).json({ id: info.lastInsertRowid, message: "Follow-up saved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Hospital Referrals
app.get("/api/referrals", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM referrals ORDER BY created_at DESC").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/referrals", (req, res) => {
  try {
    const { counsellorId = 1, womanName, hospitalName, rationale } = req.body;
    const refCode = `REF-HOSP-${Math.floor(100 + Math.random() * 900)}`;

    const info = db
      .prepare(
        `INSERT INTO referrals (ref_code, counsellor_id, woman_name, hospital_name, rationale)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(refCode, counsellorId, womanName, hospitalName, rationale);

    res.status(201).json({ id: info.lastInsertRowid, refCode, status: "Transmitted for Review" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Admin: Counsellor Verification
app.get("/api/admin/counsellors", (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, full_name, qualification, specialisation, verification_status FROM users WHERE role = 'counsellor'"
      )
      .all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/admin/counsellors/:id", (req, res) => {
  try {
    const { verificationStatus } = req.body;
    db.prepare("UPDATE users SET verification_status = ? WHERE id = ?").run(
      verificationStatus,
      req.params.id
    );
    res.json({ message: "Verification status updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Tunza Mama API running on http://localhost:${PORT}`);
});