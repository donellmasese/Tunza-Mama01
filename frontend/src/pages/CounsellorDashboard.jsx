import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, getCurrentUser } from "../api";

export default function CounsellorDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isAcceptingSlots, setIsAcceptingSlots] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [scheduleSavedNotice, setScheduleSavedNotice] = useState(false);

  // Follow-up modal state
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    womanName: "Sample User A",
    wellbeingNote: "10/30 (Improving)",
    nextCheckIn: "",
    recommendedAction: "",
  });

  // Hospital referral modal state
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralForm, setReferralForm] = useState({
    hospitalName: "Kenyatta National Hospital (Maternal Mental Health Unit)",
    womanName: "",
    rationale: "",
  });

  const loadAll = async () => {
    try {
      const [appts, notes, refs] = await Promise.all([
        apiRequest("/appointments"),
        apiRequest("/follow-ups"),
        apiRequest("/referrals"),
      ]);
      setAppointments(appts);
      setFollowUps(notes);
      setReferrals(refs);
    } catch (err) {
      console.error("Failed to load counsellor data:", err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAppointmentStatus = async (id, status) => {
    try {
      await apiRequest(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/follow-ups", {
        method: "POST",
        body: JSON.stringify({
          counsellorId: user?.id || 1,
          womanName: noteForm.womanName,
          sessionStage: "Postpartum Follow-Up",
          wellbeingNote: noteForm.wellbeingNote,
          recommendedAction: noteForm.recommendedAction,
          nextCheckIn: noteForm.nextCheckIn || "In 2 Weeks",
        }),
      });
      setShowFollowUpModal(false);
      setNoteForm({
        womanName: "",
        wellbeingNote: "10/30 (Improving)",
        nextCheckIn: "",
        recommendedAction: "",
      });
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/referrals", {
        method: "POST",
        body: JSON.stringify({
          counsellorId: user?.id || 1,
          womanName: referralForm.womanName,
          hospitalName: referralForm.hospitalName,
          rationale: referralForm.rationale,
        }),
      });
      setShowReferralModal(false);
      setReferralForm({
        hospitalName: "Kenyatta National Hospital (Maternal Mental Health Unit)",
        womanName: "",
        rationale: "",
      });
      loadAll();
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

  const pendingRequests = appointments.filter((a) => a.status === "Pending");
  const confirmedSessions = appointments.filter((a) => a.status === "Confirmed");

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
                Directory
              </Link>
              <Link className="bg-surface-container-high text-primary font-bold rounded-full px-4 py-2" to="/counsellor-dashboard">
                Counsellor Dashboard
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
                value="counsellor"
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
        <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg space-y-space-xl">
          {/* Counsellor Profile Hero */}
          <div className="relative overflow-hidden bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg">
                <div className="w-20 h-20 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-headline-xl font-bold shrink-0">
                  {user?.fullName?.[0] || "C"}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      {isAcceptingSlots ? "Accepting Appointments" : "Availability Paused"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
                      Live Database Connected
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                    {user?.fullName || "Sample Counsellor A"}
                  </h1>
                  <p className="font-title-md text-title-md text-on-surface-variant font-medium">
                    Maternal Mental Health Counsellor • Prenatal &amp; Postpartum Emotional Support
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md min-w-[280px]">
                <div className="space-y-0.5 text-left w-full sm:w-auto">
                  <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Booking Status
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Control open appointment slots
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAcceptingSlots(!isAcceptingSlots)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-full font-label-lg text-label-lg inline-flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isAcceptingSlots
                      ? "bg-primary text-on-primary"
                      : "bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">sensors</span>
                  <span>{isAcceptingSlots ? "Active (Open)" : "Paused"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-2">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                Pending Requests
              </span>
              <div className="font-headline-xl text-headline-xl text-secondary font-bold">
                {pendingRequests.length}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Awaiting confirmation
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-2">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                Confirmed Sessions
              </span>
              <div className="font-headline-xl text-headline-xl text-primary font-bold">
                {confirmedSessions.length}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Ready for video or in-person care
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-2">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                Follow-Ups Logged
              </span>
              <div className="font-headline-xl text-headline-xl text-tertiary font-bold">
                {followUps.length}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Post-session plans saved
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-2">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                Hospital Referrals
              </span>
              <div className="font-headline-xl text-headline-xl text-secondary font-bold">
                {referrals.length}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Specialist escalations tracked
              </p>
            </div>
          </div>

          {/* Appointment Requests + Confirmed Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left 7 Cols: Incoming Appointment Requests */}
            <div className="lg:col-span-7 space-y-space-md">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Incoming Appointment Requests
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
                  {pendingRequests.length} Pending
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm text-on-surface-variant">
                  No pending requests right now. New requests booked by mothers on the directory page appear here automatically.
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm space-y-space-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface font-bold">
                          {req.woman_name}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                          Requested Counsellor: <strong>{req.counsellor_name}</strong>
                        </p>
                      </div>
                      <span className="self-start px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
                        {req.appointment_date} • {req.appointment_time}
                      </span>
                    </div>

                    <div className="bg-surface-container-low rounded-DEFAULT p-space-md space-y-1">
                      <div className="flex items-center justify-between font-label-md text-label-md text-primary">
                        <span>Client Note</span>
                        <span>Mode: {req.session_mode}</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface italic">
                        "{req.notes || "Requesting maternal emotional wellbeing consultation."}"
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-space-sm pt-1">
                      <button
                        type="button"
                        onClick={() => handleAppointmentStatus(req.id, "Declined")}
                        className="px-4 py-2 rounded-full bg-surface text-on-surface-variant hover:text-error font-label-lg text-label-lg"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAppointmentStatus(req.id, "Confirmed")}
                        className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 inline-flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          event_available
                        </span>
                        Accept &amp; Confirm
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right 5 Cols: Confirmed Schedule */}
            <div className="lg:col-span-5 space-y-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Confirmed Sessions
                </h2>
                <span className="font-label-md text-label-md text-tertiary font-bold bg-tertiary-fixed px-3 py-1 rounded-full">
                  {confirmedSessions.length} Active
                </span>
              </div>

              {confirmedSessions.length === 0 ? (
                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm text-on-surface-variant">
                  Accept a pending request on the left to add it to your confirmed schedule.
                </div>
              ) : (
                confirmedSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="bg-gradient-to-br from-primary-container to-primary text-on-primary rounded-lg p-space-lg shadow-md space-y-space-md"
                  >
                    <span className="px-3 py-1 rounded-full bg-white/20 text-on-primary font-label-md text-label-md font-semibold inline-block">
                      {sess.appointment_date} • {sess.appointment_time}
                    </span>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-white font-bold">
                        {sess.woman_name}
                      </h3>
                      <p className="font-body-md text-body-md text-white/85">
                        {sess.session_mode} Counselling • With {sess.counsellor_name}
                      </p>
                    </div>
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => launchTeleRoom(sess.id)}
                        className="flex-1 py-2.5 px-4 rounded-full bg-surface-container-lowest text-primary font-label-lg font-bold hover:bg-surface-container-low inline-flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">video_call</span>
                        Start Video Room
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAppointmentStatus(sess.id, "Completed")}
                        className="py-2.5 px-4 rounded-full bg-white/20 hover:bg-white/30 text-white font-label-md font-semibold"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Follow-Up Records Table */}
          <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm space-y-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Follow-Up Records &amp; Recommended Next Steps
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Saved notes automatically appear on the mother's dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFollowUpModal(true)}
                className="px-5 py-2.5 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg shadow-sm hover:opacity-90 inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">post_add</span>
                Add Follow-Up Note
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-md text-body-md border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-lg text-label-lg border-b border-surface-container-high">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Wellbeing Note</th>
                    <th className="py-3 px-4">Recommended Next Step</th>
                    <th className="py-3 px-4">Next Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {followUps.map((f) => (
                    <tr key={f.id}>
                      <td className="py-3 px-4 font-semibold text-on-surface">{f.woman_name}</td>
                      <td className="py-3 px-4 text-tertiary font-semibold">{f.wellbeing_note}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{f.recommended_action}</td>
                      <td className="py-3 px-4 font-medium text-primary">{f.next_check_in}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hospital Referral Section */}
          <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm space-y-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Hospital &amp; Specialist Referral Coordination
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Escalate severe maternal mental health cases to partner hospitals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReferralModal(true)}
                className="px-5 py-2.5 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg shadow-sm hover:opacity-90 inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">alt_route</span>
                Initiate Hospital Referral
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-surface-container-low rounded-lg p-space-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-md font-bold">
                      {ref.ref_code}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md font-semibold">
                      {ref.status}
                    </span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    {ref.hospital_name}
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    <strong>Client:</strong> {ref.woman_name} • {ref.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Follow-Up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-lg max-w-lg w-full p-space-lg shadow-xl space-y-space-md">
            <div className="flex items-center justify-between border-b pb-2 border-surface-container-high">
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Add Follow-Up Note
              </h3>
              <button
                type="button"
                onClick={() => setShowFollowUpModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveFollowUp} className="space-y-3">
              <div>
                <label className="block font-label-lg mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={noteForm.womanName}
                  onChange={(e) => setNoteForm({ ...noteForm, womanName: e.target.value })}
                  className="w-full bg-surface px-4 py-2.5 rounded-full shadow-inner"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-lg mb-1">Wellbeing Status</label>
                  <input
                    type="text"
                    value={noteForm.wellbeingNote}
                    onChange={(e) => setNoteForm({ ...noteForm, wellbeingNote: e.target.value })}
                    className="w-full bg-surface px-4 py-2.5 rounded-full shadow-inner"
                  />
                </div>
                <div>
                  <label className="block font-label-lg mb-1">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={noteForm.nextCheckIn}
                    onChange={(e) => setNoteForm({ ...noteForm, nextCheckIn: e.target.value })}
                    className="w-full bg-surface px-4 py-2.5 rounded-full shadow-inner"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-lg mb-1">Recommended Next Steps</label>
                <textarea
                  rows="3"
                  required
                  value={noteForm.recommendedAction}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, recommendedAction: e.target.value })
                  }
                  placeholder="Enter self-care guidance and next appointment plan..."
                  className="w-full bg-surface p-3 rounded-DEFAULT shadow-inner"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 rounded-full bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-tertiary text-on-tertiary font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hospital Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-lg max-w-lg w-full p-space-lg shadow-xl space-y-space-md">
            <div className="flex items-center justify-between border-b pb-2 border-surface-container-high">
              <h3 className="font-headline-md text-headline-md text-secondary font-bold">
                Initiate Hospital Referral
              </h3>
              <button
                type="button"
                onClick={() => setShowReferralModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateReferral} className="space-y-3">
              <div>
                <label className="block font-label-lg mb-1">Receiving Hospital</label>
                <select
                  value={referralForm.hospitalName}
                  onChange={(e) =>
                    setReferralForm({ ...referralForm, hospitalName: e.target.value })
                  }
                  className="w-full bg-surface px-4 py-2.5 rounded-full shadow-inner"
                >
                  <option>Kenyatta National Hospital (Maternal Mental Health Unit)</option>
                  <option>Mathari National Teaching &amp; Referral Hospital</option>
                  <option>Moi Teaching &amp; Referral Hospital (Eldoret)</option>
                </select>
              </div>
              <div>
                <label className="block font-label-lg mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={referralForm.womanName}
                  onChange={(e) => setReferralForm({ ...referralForm, womanName: e.target.value })}
                  placeholder="e.g. Sample User A"
                  className="w-full bg-surface px-4 py-2.5 rounded-full shadow-inner"
                />
              </div>
              <div>
                <label className="block font-label-lg mb-1">Referral Rationale</label>
                <textarea
                  rows="3"
                  required
                  value={referralForm.rationale}
                  onChange={(e) => setReferralForm({ ...referralForm, rationale: e.target.value })}
                  placeholder="Describe symptoms and urgency for hospital follow-up..."
                  className="w-full bg-surface p-3 rounded-DEFAULT shadow-inner"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="px-4 py-2 rounded-full bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-secondary text-on-secondary font-semibold"
                >
                  Submit Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}