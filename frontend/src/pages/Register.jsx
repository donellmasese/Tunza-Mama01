import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("mother");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    stageOrSpecialty: "Pregnant (Antenatal)",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          role: accountType,
        }),
      });
      localStorage.setItem("tunza_token", data.token);
      localStorage.setItem("tunza_user", JSON.stringify(data.user));
      navigate(accountType === "mother" ? "/woman-dashboard" : "/counsellor-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <Link className="flex items-center gap-space-sm" to="/">
            <span className="material-symbols-outlined text-primary text-[30px]">spa</span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              Tunza Mama
            </span>
          </Link>
          <div className="flex items-center gap-space-sm">
            <Link to="/" className="px-4 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface">
              Home
            </Link>
            <Link to="/login" className="px-5 py-2.5 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-28 pb-space-xl px-margin flex items-center justify-center">
        <div className="max-w-lg w-full bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-md space-y-space-lg">
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Confidential Registration
            </span>
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
              Create Your Account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Join Tunza Mama to book maternal mental health counselling or support women as a verified counsellor.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-DEFAULT bg-error-container text-on-error-container font-label-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-space-md">
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1.5">
                I am registering as a:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1.5 rounded-full">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("mother");
                    setForm({ ...form, stageOrSpecialty: "Pregnant (Antenatal)" });
                  }}
                  className={`py-2 rounded-full font-label-md text-label-md transition-all ${
                    accountType === "mother"
                      ? "bg-primary text-on-primary font-bold shadow-xs"
                      : "text-on-surface-variant"
                  }`}
                >
                  Woman Seeking Support
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("counsellor");
                    setForm({ ...form, stageOrSpecialty: "Perinatal Counselling" });
                  }}
                  className={`py-2 rounded-full font-label-md text-label-md transition-all ${
                    accountType === "counsellor"
                      ? "bg-primary text-on-primary font-bold shadow-xs"
                      : "text-on-surface-variant"
                  }`}
                >
                  Maternal Counsellor
                </button>
              </div>
            </div>

            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Sample User A"
                className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="07XX XXX XXX"
                  className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1">
                {accountType === "mother" ? "Current Maternal Stage" : "Primary Counselling Specialisation"}
              </label>
              {accountType === "mother" ? (
                <select
                  value={form.stageOrSpecialty}
                  onChange={(e) => setForm({ ...form, stageOrSpecialty: e.target.value })}
                  className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                >
                  <option>Pregnant (Antenatal)</option>
                  <option>Postpartum (0–6 Months After Birth)</option>
                  <option>Postpartum (6–12 Months After Birth)</option>
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={form.stageOrSpecialty}
                  onChange={(e) => setForm({ ...form, stageOrSpecialty: e.target.value })}
                  placeholder="e.g. Perinatal & Postpartum Mental Health"
                  className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              )}
            </div>

            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1">Create Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              {loading ? "Creating Account..." : accountType === "mother" ? "Create Woman Account" : "Submit Counsellor Registration"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-surface-container-high">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}