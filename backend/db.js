const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "tunza_mama.db"));
db.pragma("foreign_keys = ON");

// Create Tables Automatically
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'mother',
    maternal_stage TEXT,
    specialisation TEXT,
    qualification TEXT,
    session_mode TEXT DEFAULT 'both',
    languages TEXT DEFAULT 'English & Kiswahili',
    location TEXT DEFAULT 'Nairobi & Online',
    bio TEXT,
    verification_status TEXT DEFAULT 'Verified',
    is_accepting_slots INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    woman_id INTEGER NOT NULL,
    counsellor_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    session_mode TEXT DEFAULT 'Online',
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (woman_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS follow_ups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    counsellor_id INTEGER NOT NULL,
    woman_name TEXT NOT NULL,
    session_stage TEXT NOT NULL,
    wellbeing_note TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    next_check_in TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_code TEXT NOT NULL UNIQUE,
    counsellor_id INTEGER NOT NULL,
    woman_name TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'Transmitted for Review',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Seed Initial Sample Counsellors & Demo User if Empty
const count = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
if (count === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, full_name, email, phone, password_hash, role, specialisation, qualification, session_mode, languages, location, bio, verification_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    1,
    "Sample Counsellor A",
    "counsellora@tunzamama.test",
    "0700000001",
    "$2a$10$placeholderhash1",
    "counsellor",
    "Prenatal & Postpartum Support",
    "MSc Counselling Psychology",
    "both",
    "English & Kiswahili",
    "Nairobi & Online",
    "Compassionate support for expectant and new mothers navigating pregnancy stress and post-delivery adjustment.",
    "Verified"
  );
  insertUser.run(
    2,
    "Sample Counsellor B",
    "counsellorb@tunzamama.test",
    "0700000002",
    "$2a$10$placeholderhash2",
    "counsellor",
    "First-Time Mother Support",
    "BA Community & Maternal Counselling",
    "online",
    "English & Kiswahili",
    "Online Tele-Counselling",
    "Helping expectant and first-time mothers build emotional resilience and calm daily routines.",
    "Verified"
  );
  insertUser.run(
    3,
    "Sample Counsellor C",
    "counsellorc@tunzamama.test",
    "0700000003",
    "$2a$10$placeholderhash3",
    "counsellor",
    "Postpartum Emotional Distress",
    "Diploma in Perinatal Mental Health",
    "both",
    "English & Kiswahili",
    "Kisumu & Online",
    "Dedicated emotional support for mothers recovering from difficult deliveries or postpartum exhaustion.",
    "Verified"
  );
  insertUser.run(
    4,
    "Sample User A",
    "womana@tunzamama.test",
    "0700000004",
    "$2a$10$placeholderhash4",
    "mother",
    null,
    null,
    "online",
    "English & Kiswahili",
    "Nairobi",
    null,
    "Verified"
  );
}

module.exports = db;