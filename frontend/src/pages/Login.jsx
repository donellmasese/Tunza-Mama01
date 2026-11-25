import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("mother");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("tunza_token", data.token);
      localStorage.setItem("tunza_user", JSON.stringify(data.user));
      const userRole = data.user.role || role;
      if (userRole === "mother") navigate("/woman-dashboard");
      if (userRole === "counsellor") navigate("/counsellor-dashboard");
      if (userRole === "admin") navigate("/admin-dashboard");
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
              Back to Home
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-secondary font-label-lg text-label-lg text-on-primary shadow-sm">
              Create Account
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-28 pb-space-xl px-margin flex items-center justify-center">
        <div className="max-w-md w-full bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-md space-y-space-lg">
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Role-Based Access
            </span>
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
              Welcome Back
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sign in to access your Tunza Mama maternal wellbeing portal.
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
                Quick Role Demo / Account Type
              </label>
              <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1.5 rounded-full">
                {[
                  { id: "mother", label: "Woman" },
                  { id: "counsellor", label: "Counsellor" },
                  { id: "admin", label: "Admin" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`py-2 rounded-full font-label-md text-label-md transition-all ${
                      role === item.id
                        ? "bg-primary text-on-primary font-bold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
            </div>

            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-bright px-4 py-3 rounded-full font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              {loading ? "Signing In..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-surface-container-high">
            <p className="font-body-md text-body-md text-on-surface-variant">
              New to Tunza Mama?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}