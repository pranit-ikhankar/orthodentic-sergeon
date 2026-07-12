import { useState } from "react";
import axios from "axios";

export default function DoctorScheduler() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Consultation",
    preferred_date: "",
    preferred_time: "",
    message: "",
    type: "appointment"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/appointments", formData);
      if (response.status === 200 || response.status === 201) {
        alert(`${formData.type === "appointment" ? "Appointment" : "Follow-up"} booked successfully! Notification triggered.`);
        setFormData({
          name: "", phone: "", email: "", service: "Consultation",
          preferred_date: "", preferred_time: "", message: "", type: "appointment"
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to book scheduling entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="card w-full max-w-md bg-white p-8 border border-slate-200/80 shadow-sm rounded-[var(--radius)]">
        
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Doctor's Internal Scheduler
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create and sync internal clinical bookings instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Appointment Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Scheduler Type
            </label>
            <div className="relative">
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="appointment">New Appointment</option>
                <option value="follow-up">Patient Follow-up</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Patient Details */}
          <div className="space-y-3">
            <input 
              type="text" 
              name="name" 
              placeholder="Patient Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 transition-all"
            />
            
            <input 
              type="tel" 
              name="phone" 
              placeholder="Patient Phone Number" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 transition-all"
            />
            
            <input 
              type="email" 
              name="email" 
              placeholder="Patient Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Treatment Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Treatment / Service
            </label>
            <div className="relative">
              <select 
                name="service" 
                value={formData.service} 
                onChange={handleChange} 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Consultation">Consultation</option>
                <option value="Braces Adjustment">Braces Adjustment</option>
                <option value="Invisalign Check">Invisalign Check</option>
                <option value="Retainer Fitting">Retainer Fitting</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5"> Date </label>
              <input 
                type="date" 
                name="preferred_date" 
                value={formData.preferred_date} 
                onChange={handleChange} 
                required 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 transition-all cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5"> Time </label>
              <input 
                type="time" 
                name="preferred_time" 
                value={formData.preferred_time} 
                onChange={handleChange} 
                required 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 transition-all cursor-pointer"
              />
            </div>
          </div>
          
          {/* Notes Textarea */}
          <div>
            <textarea 
              name="message" 
              placeholder="Doctor notes / instructions (optional)..." 
              value={formData.message} 
              onChange={handleChange} 
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 transition-all min-h-[80px] resize-y"
            />
          </div>

          {/* Interactive Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full font-medium text-sm text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] py-3 px-4 shadow-sm transition-all focus:outline-none disabled:opacity-70 disabled:pointer-events-none"
            style={{ borderRadius: "var(--radius)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                Processing...
              </span>
            ) : (
              formData.type === "appointment" ? "Confirm Appointment & Notify" : "Schedule Follow-up & Notify"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}