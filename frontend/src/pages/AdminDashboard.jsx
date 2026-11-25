import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [counsellors, setCounsellors] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [referralsCount, setReferralsCount] = useState(0);

  const loadData = async () => {
    try {
      const [cList, appts, refs] = await Promise.all([
        apiRequest("/admin/counsellors"),
        apiRequest("/appointments"),
        apiRequest("/referrals"),
      ]);
      setCounsellors(cList);
      setAppointmentsCount(appts.length);
      setReferralsCount(refs.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleVerification = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Verified" ? "Suspended" : "Verified";
    try {
      await apiRequest(`/admin/counsellors/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ verificationStatus: nextStatus }),
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRoleSwitch = (e) => {
    const val = e.target.value;
    if (val === "mother") navigate("/woman-dashboard");
    if (val === "counsellor") navigate("/counsellor-dashboard");
    if (val === "admin") navigate("/admin-dashboard");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
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
                Public Directory
              </Link>
              <Link className="bg-surface-container-high text-primary font-bold rounded-full px-4 py-2" to="/admin-dashboard">
                Admin Oversight
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
                value="admin"
                className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="mother">Woman Dashboard</option>
                <option value="counsellor">Counsellor Dashboard</option>
                <option value="admin">Admin Dashboard</option>
              </select>
            </div>
            <Link className="px-4 py-2 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg" to="/">
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg space-y-space-xl">
          <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-md text-label-md mb-2">
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Live Database Administration
            </span>
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
              Tunza Mama Platform Administration
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Approve newly registered counsellors, suspend accounts if needed, and monitor platform activity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-1">
              <span className="font-label-md text-label-md uppercase text-on-surface-variant">Verified Counsellors</span>
              <div className="font-headline-xl text-headline-xl text-tertiary font-bold">
                {counsellors.filter((c) => c.verification_status === "Verified").length}
              </div>
              <p className="font-caption text-caption text-on-surface-variant">Visible in public directory</p>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-1">
              <span className="font-label-md text-label-md uppercase text-on-surface-variant">Booked Appointments</span>
              <div className="font-headline-xl text-headline-xl text-primary font-bold">{appointmentsCount}</div>
              <p className="font-caption text-caption text-on-surface-variant">Saved in SQLite database</p>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-1">
              <span className="font-label-md text-label-md uppercase text-on-surface-variant">Hospital Referrals</span>
              <div className="font-headline-xl text-headline-xl text-secondary font-bold">{referralsCount}</div>
              <p className="font-caption text-caption text-on-surface-variant">Escalated specialist transfers</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm space-y-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Counsellor Account Verification &amp; Status Management
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-md text-body-md border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-lg text-label-lg border-b border-surface-container-high">
                    <th className="py-3.5 px-4">Counsellor</th>
                    <th className="py-3.5 px-4">Qualification</th>
                    <th className="py-3.5 px-4">Specialisation</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {counsellors.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-bright">
                      <td className="py-3.5 px-4 font-semibold text-on-surface">{c.full_name}</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">{c.qualification || "Verified Credentials"}</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">{c.specialisation}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full font-label-md text-label-md font-semibold ${
                            c.verification_status === "Verified"
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : "bg-secondary-fixed text-on-secondary-fixed"
                          }`}
                        >
                          {c.verification_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleVerification(c.id, c.verification_status)}
                          className="px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          {c.verification_status === "Verified" ? "Suspend Account" : "Approve & Verify"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}