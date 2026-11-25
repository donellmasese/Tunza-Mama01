import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, getCurrentUser } from "../api";

const MOODS = [
  { emoji: "🌱", label: "Rested" },
  { emoji: "🌸", label: "Tender" },
  { emoji: "🌧️", label: "Heavy" },
  { emoji: "✨", label: "Hopeful" },
];

export default function WomanDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [selectedMood, setSelectedMood] = useState("Tender");
  const [moodNotice, setMoodNotice] = useState("");
  const [checklist, setChecklist] = useState([true, true, false]);
  const [appointments, setAppointments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");

  const loadDashboardData = async () => {
    try {
      const [appts, notes] = await Promise.all([
        apiRequest("/appointments"),
        apiRequest("/follow-ups"),
      ]);
      setAppointments(appts);
      setFollowUps(notes);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleMoodClick = (label) => {
    setSelectedMood(label);
    setMoodNotice(`Today's feeling '${label}' noted in your wellbeing log.`);
    setTimeout(() => setMoodNotice(""), 3000);
  };

  const toggleChecklist = (idx) => {
    setChecklist((prev) => prev.map((item, i) => (i === idx ? !item : item)));
  };

  const handleCancelAppointment = async (id) => {
    try {
      await apiRequest(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Cancelled" }),
      });
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRescheduleSubmit = async (id) => {
    if (!newDate) return alert("Please pick a new date.");
    try {
      await apiRequest(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "Pending",
          appointmentDate: newDate,
          appointmentTime: newTime,
        }),
      });
      setRescheduleId(null);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const launchTeleRoom = (apptId) => {
    const roomUrl = `https://meet.jit.si/TunzaMama-CareRoom-${apptId || "Demo"}`;
    window.open(roomUrl, "_blank", "noopener,noreferrer");
  };

  const handleRoleSwitch = (e) => {
    const val = e.target.value;
    if (val === "mother") navigate("/woman-dashboard");
    if (val === "counsellor") navigate("/counsellor-dashboard");
    if (val === "admin") navigate("/admin-dashboard");
  };

  const confirmedAppts = appointments.filter((a) => a.status === "Confirmed");
  const pendingAppts = appointments.filter((a) => a.status === "Pending");
  const completedAppts = appointments.filter((a) => a.status === "Completed");
  const readyCount = checklist.filter(Boolean).length;

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg">
            <Link className="flex items-center gap-space-sm" to="/">
              <span className="material-symbols-outlined text-primary text-[30px]">spa</span>
              <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                Tunza Mama
              </span>
            </Link>
            <nav className="hidden xl:flex items-center gap-space-xs">
              <Link className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface rounded-full" to="/">
                Home
              </Link>
              <Link className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface rounded-full" to="/counsellors">
                Find a Counsellor
              </Link>
              <Link className="bg-surface-container-high text-primary font-bold rounded-full px-4 py-2" to="/woman-dashboard">
                Woman Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-space-sm sm:gap-space-md">
            <div className="hidden sm:flex items-center bg-surface-container-low px-3 py-1.5 rounded-full shadow-sm">
              <span className="font-caption text-caption text-on-surface-variant mr-2 uppercase tracking-wider">
                Demo View
              </span>
              <select
                onChange={handleRoleSwitch}
                value="mother"
                className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="mother">Woman Dashboard</option>
                <option value="counsellor">Counsellor Dashboard</option>
                <option value="admin">Admin Dashboard</option>
              </select>
            </div>
            <Link
              onClick={() => {
                localStorage.removeItem("tunza_token");
                localStorage.removeItem("tunza_user");
              }}
              className="px-4 py-2 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg hover:bg-surface-variant"
              to="/"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-surface flex-1">
        <div className="relative w-full max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg flex flex-col gap-space-xl">
          {/* Greeting & Mood Banner */}
          <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-surface-container via-surface-container-high to-surface-variant p-space-lg md:p-space-xl shadow-sm">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
              <div className="flex flex-col gap-space-xs max-w-2xl">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[16px]">child_care</span>
                    Maternal Wellbeing Portal
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-tertiary font-caption text-caption shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    Live Care Sync Active
                  </span>
                </div>

                <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mt-space-xs">
                  Welcome back, {user?.fullName || "Sample User A"}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Manage your counselling sessions, join encrypted video rooms, and review follow-up care guidance.
                </p>

                {/* Daily Mood Selection */}
                <div className="mt-space-sm pt-space-xs flex flex-wrap items-center gap-space-sm">
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    How are you feeling today?
                  </span>
                  <div className="flex items-center gap-2 bg-surface-container-lowest/80 p-1.5 rounded-full shadow-xs">
                    {MOODS.map((m) => {
                      const active = selectedMood === m.label;
                      return (
                        <button
                          key={m.label}
                          type="button"
                          onClick={() => handleMoodClick(m.label)}
                          className={`px-3 py-1 rounded-full text-label-md font-label-md transition-all flex items-center gap-1 ${
                            active
                              ? "bg-primary-container text-on-primary shadow-xs"
                              : "text-on-surface-variant hover:bg-surface-variant"
                          }`}
                        >
                          <span>{m.emoji}</span> {m.label}
                        </button>
                      );
                    })}
                  </div>
                  {moodNotice && (
                    <span className="text-caption font-caption text-primary font-semibold">
                      {moodNotice}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-surface-container-lowest px-5 py-4 rounded-lg shadow-sm flex items-center gap-3 shrink-0">
                <span className="material-symbols-outlined text-secondary text-[28px]">
                  volunteer_activism
                </span>
                <div>
                  <p className="font-label-lg text-label-lg font-bold text-on-surface">
                    Confidential Care
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Protected role-based counselling records
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Action Cards */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
            <Link
              to="/counsellors"
              className="flex flex-col gap-space-xs p-space-md rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary-container/15 flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[26px]">calendar_add_on</span>
              </div>
              <span className="font-title-md text-title-md text-on-surface font-semibold mt-1">
                Book Session
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                Browse counsellors &amp; request a slot
              </span>
            </Link>

            <a
              href="tel:1199"
              className="flex flex-col gap-space-xs p-space-md rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[26px]">emergency_home</span>
              </div>
              <span className="font-title-md text-title-md text-on-surface font-semibold mt-1">
                Urgent Helpline
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                Kenya toll-free support line: 1199
              </span>
            </a>

            <a
              href="#follow-up-plan"
              className="flex flex-col gap-space-xs p-space-md rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                <span className="material-symbols-outlined text-[26px]">healing</span>
              </div>
              <span className="font-title-md text-title-md text-on-surface font-semibold mt-1">
                Follow-Up Plan
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                View counsellor recommendations
              </span>
            </a>

            <button
              type="button"
              onClick={() => launchTeleRoom("InstantCheckIn")}
              className="flex flex-col text-left gap-space-xs p-space-md rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary-container group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[26px]">video_call</span>
              </div>
              <span className="font-title-md text-title-md text-on-surface font-semibold mt-1">
                Tele-Room Test
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                Open encrypted video consultation room
              </span>
            </button>
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              {/* Confirmed Upcoming Sessions */}
              <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Confirmed Counselling Sessions ({confirmedAppts.length})
                    </h2>
                  </div>
                  <Link
                    to="/counsellors"
                    className="px-3.5 py-1.5 rounded-full bg-primary-fixed text-primary font-label-md font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    + Book Another
                  </Link>
                </div>

                {confirmedAppts.length === 0 ? (
                  <div className="p-space-md rounded-lg bg-surface-container-low text-on-surface-variant font-body-md">
                    No confirmed sessions yet. Once your counsellor confirms a pending request below, it will appear here with a live video room button.
                  </div>
                ) : (
                  confirmedAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-md"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                        <div className="flex items-center gap-space-md">
                          <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-headline-md font-bold shrink-0">
                            {appt.counsellor_name?.[0] || "C"}
                          </div>
                          <div>
                            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                              {appt.counsellor_name}
                            </h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                              {appt.specialisation || "Maternal Mental Health Support"}
                            </p>
                            <div className="flex items-center gap-space-sm mt-1 text-primary font-caption font-semibold">
                              <span>
                                {appt.appointment_date} • {appt.appointment_time}
                              </span>
                              <span>•</span>
                              <span>{appt.session_mode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2 w-full md:w-auto">
                          <button
                            type="button"
                            onClick={() => launchTeleRoom(appt.id)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">video_call</span>
                            Join Online Session
                          </button>
                          <div className="flex items-center justify-end gap-3 text-label-md font-label-md">
                            <button
                              type="button"
                              onClick={() =>
                                setRescheduleId(rescheduleId === appt.id ? null : appt.id)
                              }
                              className="text-on-surface-variant hover:text-primary py-1"
                            >
                              Reschedule
                            </button>
                            <span className="text-outline-variant">•</span>
                            <button
                              type="button"
                              onClick={() => handleCancelAppointment(appt.id)}
                              className="text-secondary hover:opacity-80 py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>

                      {rescheduleId === appt.id && (
                        <div className="p-3 rounded-lg bg-surface-container flex flex-wrap items-center gap-3">
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="bg-surface-container-lowest px-3 py-1.5 rounded-full text-body-md"
                          />
                          <select
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="bg-surface-container-lowest px-3 py-1.5 rounded-full text-body-md"
                          >
                            <option>09:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:30 AM</option>
                            <option>02:00 PM</option>
                            <option>04:00 PM</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRescheduleSubmit(appt.id)}
                            className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md font-semibold"
                          >
                            Confirm New Time
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Preparation Checklist */}
                <div className="flex flex-col gap-space-xs bg-surface-container/60 p-space-md rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg text-primary font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">checklist</span>
                      Session Preparation Checklist
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      {readyCount} of 3 ready
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    {[
                      "Baby resting or with caregiver",
                      "Glass of water nearby",
                      "Note down key questions",
                    ].map((label, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded bg-surface-container-lowest cursor-pointer text-body-md"
                      >
                        <input
                          type="checkbox"
                          checked={checklist[idx]}
                          onChange={() => toggleChecklist(idx)}
                          className="w-4 h-4 rounded accent-tertiary"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Appointment Requests */}
              <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[24px]">
                      hourglass_top
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Pending Appointment Requests ({pendingAppts.length})
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">
                    Awaiting Counsellor
                  </span>
                </div>

                {pendingAppts.length === 0 ? (
                  <p className="font-body-md text-on-surface-variant">
                    No pending requests.{" "}
                    <Link to="/counsellors" className="text-primary font-semibold underline">
                      Request a new session here.
                    </Link>
                  </p>
                ) : (
                  pendingAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-space-md rounded-lg bg-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md"
                    >
                      <div className="flex items-center gap-space-md">
                        <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-semibold font-title-md">
                          {appt.counsellor_name?.[0] || "C"}
                        </div>
                        <div>
                          <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                            {appt.counsellor_name}
                          </h4>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            {appt.notes || "Maternal emotional wellbeing session"}
                          </p>
                          <div className="flex items-center gap-2 font-caption text-caption text-primary mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">event</span>
                            Requested: {appt.appointment_date} • {appt.appointment_time} (
                            {appt.session_mode})
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="px-3.5 py-1.5 rounded-full bg-surface text-secondary font-label-md hover:bg-error-container"
                      >
                        Cancel Request
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Completed Consultations */}
              {completedAppts.length > 0 && (
                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Completed Sessions ({completedAppts.length})
                  </h2>
                  {completedAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-space-md rounded-lg bg-surface-container-low flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-title-md font-semibold">{appt.counsellor_name}</h4>
                        <p className="font-body-md text-on-surface-variant">
                          {appt.appointment_date} • {appt.session_mode}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 4 Columns */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              {/* Live Follow-Up Plan from Database */}
              <div
                id="follow-up-plan"
                className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">healing</span>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    Follow-Up Care &amp; Next Steps
                  </h3>
                </div>
                <p className="font-caption text-caption text-on-surface-variant">
                  Live recommendations recorded by your counsellor
                </p>

                <div className="space-y-space-sm">
                  {followUps.length === 0 ? (
                    <div className="p-3 rounded-lg bg-surface-container-low">
                      <span className="font-label-lg text-on-surface font-semibold block">
                        Daily 10-Minute Quiet Rest
                      </span>
                      <span className="font-body-md text-on-surface-variant">
                        Practice slow breathing during afternoon baby naps.
                      </span>
                    </div>
                  ) : (
                    followUps.map((f) => (
                      <div
                        key={f.id}
                        className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-label-lg text-primary font-semibold">
                            {f.session_stage}
                          </span>
                          <span className="font-caption text-tertiary font-semibold">
                            Next: {f.next_check_in}
                          </span>
                        </div>
                        <p className="font-body-md text-on-surface">{f.recommended_action}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Urgent Crisis Support Box */}
              <div className="p-space-md rounded-lg bg-tertiary text-on-tertiary flex items-center justify-between gap-space-sm shadow-md">
                <div>
                  <span className="font-label-md text-label-md uppercase tracking-wider opacity-80 block">
                    Urgent Support (Kenya)
                  </span>
                  <span className="font-title-md text-title-md font-bold mt-0.5 block">
                    Need Immediate Help?
                  </span>
                  <span className="font-caption text-caption opacity-90">
                    Call toll-free 1199 or visit the nearest hospital.
                  </span>
                </div>
                <a
                  href="tel:1199"
                  className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}