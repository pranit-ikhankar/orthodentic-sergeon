import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Phone, Mail, FileText, ArrowLeft, CheckCircle2, Sparkles, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import api, { formatLocalDate } from "../utils/api";

export default function DoctorScheduler({ isEmbedded = false, onAppointmentCreated }) {
  const navigate = useNavigate();
  const todayStr = formatLocalDate(new Date());

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Joint Replacement Consultation",
    preferred_date: todayStr,
    preferred_time: "10:00 AM",
    message: "",
    type: "appointment",
  });
  const [loading, setLoading] = useState(false);

  const servicesList = [
    "Joint Replacement Consultation",
    "Knee / Hip Pain Evaluation",
    "Sports Injury & ACL Assessment",
    "Arthroscopic Procedure Follow-up",
    "Spine & Posture Check",
    "Fracture Care & Cast Check",
    "Physical Therapy Review",
    "Post-Op Recovery Checkup",
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDatePreset = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    setFormData({ ...formData, preferred_date: formatLocalDate(d) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.preferred_date || !formData.preferred_time) {
      toast.error("Please fill in all mandatory fields (Name, Phone, Date, Time).");
      return;
    }

    setLoading(true);
    try {
      const response = await api.bookAppointment(formData);
      if (response && response.success) {
        toast.success(
          `${formData.type === "appointment" ? "New Clinical Appointment" : "Patient Follow-up"} scheduled successfully!`,
          {
            description: `Patient: ${formData.name} • ${formData.preferred_date} at ${formData.preferred_time}`,
          }
        );

        if (onAppointmentCreated) {
          onAppointmentCreated(response);
        }

        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          service: "Joint Replacement Consultation",
          preferred_date: todayStr,
          preferred_time: "10:00 AM",
          message: "",
          type: "appointment",
        });
      }
    } catch (error) {
      console.error("Scheduler error:", error);
      toast.error(error.response?.data?.detail || "Failed to schedule appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className={`w-full ${isEmbedded ? "max-w-4xl mx-auto" : "max-w-2xl mx-auto"} bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white">
        {!isEmbedded && (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Admin Portal
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-xs text-blue-100 hover:text-white transition-colors"
            >
              Public Website &rarr;
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
              Clinical Direct Booking & Follow-Up
            </h2>
            <p className="text-xs md:text-sm text-blue-100 mt-0.5">
              Directly insert confirmed patient appointments into the clinical registry with instant SMS notification.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Scheduler Type Pill Selectors */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Booking Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "appointment" })}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                formData.type === "appointment"
                  ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2 className={`h-4 w-4 ${formData.type === "appointment" ? "text-blue-600" : "text-slate-400"}`} />
              New Patient Consultation
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "follow-up" })}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                formData.type === "follow-up"
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sparkles className={`h-4 w-4 ${formData.type === "follow-up" ? "text-indigo-600" : "text-slate-400"}`} />
              Post-Op / Follow-up Visit
            </button>
          </div>
        </div>

        {/* Patient Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-blue-600" /> Patient Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Patient Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number (with WhatsApp/SMS) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. patient@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Clinical Service */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Orthopedic Specialty / Treatment
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
          >
            {servicesList.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time with Quick Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-600" /> Appointment Date & Slot *
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleDatePreset(0)}
                className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset(1)}
                className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset(2)}
                className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
              >
                +2 Days
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              />
            </div>
            <div>
              <select
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Clinical Notes / Doctor Instructions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-600" /> Clinical Notes & Preparation (Optional)
          </label>
          <textarea
            name="message"
            placeholder="e.g. Bring previous X-Rays / MRI reports; fasting required for joint injection..."
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Recording in Registry & Sending Notification...
            </span>
          ) : (
            `Confirm & Schedule ${formData.type === "appointment" ? "Appointment" : "Follow-up"}`
          )}
        </button>
      </form>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8">
      {content}
    </div>
  );
}