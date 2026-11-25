CREATE DATABASE IF NOT EXISTS tunza_mama;
USE tunza_mama;

-- 1. Users Table (Women, Counsellors, Admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('mother', 'counsellor', 'admin') NOT NULL DEFAULT 'mother',
  maternal_stage VARCHAR(100) NULL,
  specialisation VARCHAR(150) NULL,
  qualification VARCHAR(150) NULL,
  session_mode ENUM('online', 'in-person', 'both') DEFAULT 'both',
  languages VARCHAR(100) DEFAULT 'English & Kiswahili',
  location VARCHAR(150) DEFAULT 'Nairobi & Online',
  bio TEXT NULL,
  verification_status ENUM('Verified', 'Pending Verification', 'Suspended') DEFAULT 'Verified',
  is_accepting_slots BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Appointments Table (Double-Booking Prevention Ready)
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  woman_id INT NOT NULL,
  counsellor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(30) NOT NULL,
  session_mode ENUM('Online', 'In-Person') DEFAULT 'Online',
  notes TEXT NULL,
  status ENUM('Pending', 'Confirmed', 'Completed', 'Declined', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (woman_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Follow-Up Records Table
CREATE TABLE IF NOT EXISTS follow_ups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  counsellor_id INT NOT NULL,
  woman_name VARCHAR(120) NOT NULL,
  session_stage VARCHAR(100) NOT NULL,
  wellbeing_note VARCHAR(120) NOT NULL,
  recommended_action TEXT NOT NULL,
  next_check_in VARCHAR(60) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Hospital Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref_code VARCHAR(30) NOT NULL UNIQUE,
  counsellor_id INT NOT NULL,
  woman_name VARCHAR(120) NOT NULL,
  hospital_name VARCHAR(180) NOT NULL,
  rationale TEXT NOT NULL,
  status ENUM('Transmitted for Review', 'Accepted by Hospital') DEFAULT 'Transmitted for Review',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Initial Sample Counsellors (Safe Placeholder Data)
INSERT IGNORE INTO users (id, full_name, email, phone, password_hash, role, specialisation, qualification, session_mode, languages, location, bio, verification_status)
VALUES
  (1, 'Sample Counsellor A', 'counsellora@tunzamama.test', '0700000001', '$2a$10$placeholderhash1', 'counsellor', 'Prenatal & Postpartum Support', 'MSc Counselling Psychology', 'both', 'English & Kiswahili', 'Nairobi & Online', 'Compassionate support for expectant and new mothers navigating pregnancy stress and post-delivery adjustment.', 'Verified'),
  (2, 'Sample Counsellor B', 'counsellorb@tunzamama.test', '0700000002', '$2a$10$placeholderhash2', 'counsellor', 'First-Time Mother Support', 'BA Community & Maternal Counselling', 'online', 'English & Kiswahili', 'Online Tele-Counselling', 'Helping expectant and first-time mothers build emotional resilience and calm daily routines.', 'Verified'),
  (3, 'Sample Counsellor C', 'counsellorc@tunzamama.test', '0700000003', '$2a$10$placeholderhash3', 'counsellor', 'Postpartum Emotional Distress', 'Diploma in Perinatal Mental Health', 'both', 'English & Kiswahili', 'Kisumu & Online', 'Dedicated emotional support for mothers recovering from difficult deliveries or postpartum exhaustion.', 'Verified'),
  (4, 'Sample User A', 'womana@tunzamama.test', '0700000004', '$2a$10$placeholderhash4', 'mother', NULL, NULL, 'online', 'English & Kiswahili', 'Nairobi', NULL, 'Verified');