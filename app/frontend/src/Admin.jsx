import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, Eye, EyeOff, ShieldCheck, Stethoscope, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated in this session
    const isAuth = sessionStorage.getItem("doctor_auth") === "true";
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e?.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === "doctor123") {
        sessionStorage.setItem("doctor_auth", "true");
        toast.success("Welcome back, Dr. Ikhankar!");
        navigate("/dashboard");
      } else {
        setError(true);
        toast.error("Incorrect password. Try using 'doctor123'");
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickFill = () => {
    setPassword("doctor123");
    setError(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/60 p-8 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Return to Public Website
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Stethoscope className="h-8 w-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Doctor Secure Portal
          </div>

          <h2
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Clinical Management
          </h2>
          <p className="text-sm text-slate-400 mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Enter authorized access code to manage appointments & schedule
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Access Code / Password
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                title="Fill demo password"
              >
                <Sparkles className="h-3 w-3" /> Fill Demo Code
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password (e.g. doctor123)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                required
                autoFocus
                className={`w-full bg-slate-900/80 border ${
                  error
                    ? "border-red-500/80 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                } rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Incorrect password. Please enter <strong>doctor123</strong> to proceed.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying Credentials...
              </span>
            ) : (
              "Authenticate & Open Portal"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500">
            Internal Access Only • Dr. Ikhankar's Orthopedic Institute
          </p>
        </div>
      </div>
    </div>
  );
}