import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Table as TableIcon,
  PlusCircle,
  LogOut,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Trash2,
  Download,
  ExternalLink,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  Activity,
  AlertCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import api, { formatLocalDate } from "./utils/api";
import AdminView from "./pages/AdminView";
import DoctorScheduler from "./pages/DoctorScheduler";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'calendar' | 'schedule'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [apiOnline, setApiOnline] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check URL query tab if provided (e.g. ?tab=calendar or ?tab=schedule)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["table", "calendar", "schedule"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Sync tab change to URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Auth gate check
  useEffect(() => {
    const isAuth = sessionStorage.getItem("doctor_auth") === "true";
    if (!isAuth) {
      toast.info("Please enter your access code to enter the doctor portal.");
      navigate("/admin");
    }
  }, [navigate]);

  // Fetch all appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getAppointments("doctor123");
      setAppointments(Array.isArray(data) ? data : []);
      setApiOnline(true);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setApiOnline(false);
      toast.error("Failed to connect to backend server. Ensure API is running.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("doctor_auth");
    toast.success("Logged out from Doctor Portal.");
    navigate("/admin");
  };

  // Delete appointment
  const handleDelete = async (id, patientName) => {
    if (!window.confirm(`Are you sure you want to delete the appointment record for ${patientName || 'this patient'}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Appointment for ${patientName || "patient"} removed.`);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete appointment.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (a.name && a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.phone && a.phone.includes(searchQuery)) ||
        (a.email && a.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.service && a.service.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.preferred_date && a.preferred_date.includes(searchQuery));

      const matchesService =
        selectedService === "all" ||
        (a.service && a.service.toLowerCase().includes(selectedService.toLowerCase()));

      return matchesSearch && matchesService;
    });
  }, [appointments, searchQuery, selectedService]);

  // Summary Metrics
  const todayStr = useMemo(() => formatLocalDate(new Date()), []);
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.preferred_date === todayStr);
  }, [appointments, todayStr]);

  const upcomingAppointments = useMemo(() => {
    return appointments.filter((a) => a.preferred_date && a.preferred_date >= todayStr);
  }, [appointments, todayStr]);

  // Export to CSV helper
  const exportToCSV = () => {
    if (appointments.length === 0) {
      toast.info("No appointment records to export.");
      return;
    }

    const headers = ["ID", "Patient Name", "Phone", "Email", "Service", "Date", "Time", "Type", "Patient Notes", "Created At"];
    const rows = appointments.map((a) => [
      `"${a.id || ""}"`,
      `"${a.name || ""}"`,
      `"${a.phone || ""}"`,
      `"${a.email || ""}"`,
      `"${a.service || ""}"`,
      `"${a.preferred_date || ""}"`,
      `"${a.preferred_time || ""}"`,
      `"${a.type || "appointment"}"`,
      `"${(a.message || "").replace(/"/g, '""')}"`,
      `"${a.created_at || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clinical_appointments_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Appointments exported to CSV file.");
  };

  const servicesList = [
    { label: "All Specialties", value: "all" },
    { label: "Joint Replacement", value: "joint" },
    { label: "Sports Medicine", value: "sports" },
    { label: "Arthroscopy", value: "arthroscopic" },
    { label: "Spine & Back Care", value: "spine" },
    { label: "Fracture Care", value: "fracture" },
    { label: "Rehabilitation", value: "rehab" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* ========================================================= */}
      {/* TOP CLINICAL PORTAL HEADER BAR */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-slate-200/90 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Left: Branding & Status */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
                +
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="text-lg md:text-xl font-bold text-slate-900 tracking-tight"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Dr. Ikhankar's Clinic
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <Activity className="h-3 w-3 text-blue-600" /> Doctor Portal
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${apiOnline ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {apiOnline ? "Live Database Connected" : "API Reconnecting..."}
                  </span>
                  <span>•</span>
                  <span>Total: <strong>{appointments.length}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={fetchAppointments}
                disabled={loading}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
                title="Refresh Records"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
              </button>

              <button
                onClick={() => navigate("/")}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Public Site
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-colors"
                title="Log out of Doctor Portal"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION STRIP */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleTabChange("table")}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === "table"
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <TableIcon className="h-4 w-4" />
              All Appointments Table
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700 font-bold">
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("calendar")}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === "calendar"
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              Daily Calendar View
              {todayAppointments.length > 0 && (
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {todayAppointments.length} Today
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange("schedule")}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === "schedule"
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              Quick Doctor Scheduler
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN BODY AREA */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                {appointments.length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">In Clinic Database</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Visits</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                {todayAppointments.length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{todayStr}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                {upcomingAppointments.length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Future Scheduled</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Status</p>
              <h3 className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Operational
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Twilio & MongoDB Ready</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ALL APPOINTMENTS TABLE VIEW */}
        {/* ========================================================= */}
        {activeTab === "table" && (
          <div className="space-y-4">
            {/* Filter & Action Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient name, phone, email, date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Service Filter Dropdown & Export */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 font-medium focus:bg-white focus:border-blue-500 transition-all cursor-pointer"
                >
                  {servicesList.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
                  title="Download all appointments as CSV"
                >
                  <Download className="h-4 w-4" /> Export CSV
                </button>

                <button
                  onClick={() => handleTabChange("schedule")}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-blue-600/20"
                >
                  <PlusCircle className="h-4 w-4" /> New Booking
                </button>
              </div>
            </div>

            {/* Table Container */}
            {loading ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium text-slate-600">Loading patient appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {searchQuery || selectedService !== "all"
                    ? "No appointments match your search criteria"
                    : "No appointments booked in the database yet"}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                  {searchQuery || selectedService !== "all"
                    ? "Try adjusting your search query or selecting 'All Specialties'."
                    : "You can create new clinical bookings directly or wait for patients to submit requests from the public site."}
                </p>
                <button
                  onClick={() => handleTabChange("schedule")}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <PlusCircle className="h-4 w-4" /> Create Clinical Appointment
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/75 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Patient Name</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Treatment / Service</th>
                        <th className="py-3.5 px-4">Scheduled Slot</th>
                        <th className="py-3.5 px-4">Patient Notes</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                      {filteredAppointments.map((a, index) => (
                        <tr
                          key={a.id || index}
                          className="hover:bg-blue-50/40 transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{a.name}</span>
                              {a.type === "follow-up" && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                                  Follow-up
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <a
                                href={`tel:${a.phone}`}
                                className="flex items-center gap-1.5 text-slate-800 hover:text-blue-600 font-medium"
                              >
                                <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                {a.phone}
                              </a>
                              {a.email && (
                                <a
                                  href={`mailto:${a.email}`}
                                  className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-xs"
                                >
                                  <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                  <span className="max-w-[160px] truncate">{a.email}</span>
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                              {a.service || "Consultation"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">
                              {a.preferred_date || "Not set"}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">
                              {a.preferred_time || "-"}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            {a.message ? (
                              <span className="line-clamp-2 text-xs text-slate-600" title={a.message}>
                                {a.message}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-xs">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`tel:${a.phone}`}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Call patient"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() => handleDelete(a.id, a.name)}
                                disabled={deletingId === a.id}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete appointment record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DAILY CALENDAR VIEW (Embedded AdminView) */}
        {/* ========================================================= */}
        {activeTab === "calendar" && (
          <div className="bg-transparent">
            <AdminView
              isEmbedded={true}
              onNavigateToScheduler={() => handleTabChange("schedule")}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: INTERNAL CLINICAL SCHEDULER (Embedded DoctorScheduler) */}
        {/* ========================================================= */}
        {activeTab === "schedule" && (
          <div className="bg-transparent">
            <DoctorScheduler
              isEmbedded={true}
              onAppointmentCreated={() => {
                fetchAppointments();
                handleTabChange("table");
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}