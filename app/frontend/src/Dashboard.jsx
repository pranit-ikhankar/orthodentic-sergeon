import { useEffect, useState } from "react";
import api from "./utils/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getAppointments("doctor123")
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Access Denied or Failed to fetch appointments");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Doctor Appointments Dashboard
            </h1>
          </div>
          <span className="bg-blue-50 text-blue-700 font-semibold px-4 py-1.5 rounded-full text-sm">
            Total: {appointments.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-500">
            No appointments booked yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {appointments.map((a, index) => (
                    <tr key={a.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">{a.name}</td>
                      <td className="py-3.5 px-4">{a.phone}</td>
                      <td className="py-3.5 px-4">{a.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {a.service}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{a.preferred_date}</td>
                      <td className="py-3.5 px-4">{a.preferred_time}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate">{a.message || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}