import React, { useEffect, useState } from "react";
import {
  Calendar,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  Trash2
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AdminView = () => {

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  // ===================================================
  // FETCH APPOINTMENTS BASED ON SELECTED DATE
  // ===================================================

  useEffect(() => {

    fetchAppointments(selectedDate);

  }, [selectedDate]);


  const fetchAppointments = async (date) => {

    try {

      const formattedDate = date
        .toISOString()
        .split("T")[0];

      const res = await axios.get(
        `http://localhost:8000/api/appointments/date/${formattedDate}`
      );

      setAppointments(res.data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      alert("Failed to connect to backend");

      setLoading(false);
    }
  };

  // ===================================================
  // DELETE APPOINTMENT
  // ===================================================

  const deleteAppointment = async (id) => {

    try {

      await axios.delete(
        `http://localhost:8000/api/appointments/${id}`
      );

      setAppointments(prev =>
        prev.filter(a => a.id !== id)
      );

    } catch (err) {

      alert("Delete failed");
    }
  };

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (dateString) => {

    return new Date(dateString).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center">

              <button
                onClick={() => navigate("/")}
                className="mr-4 p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <h1
                className="text-2xl md:text-3xl font-bold text-slate-900"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Appointment Management
              </h1>
            </div>

            <div className="text-right">

              <p className="text-sm text-slate-600">
                Total Appointments
              </p>

              <p className="text-2xl font-bold text-blue-600">
                {appointments.length}
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

        {/* DATE PICKER */}

        <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200">

          <h2 className="text-lg font-bold mb-4">
            Select Appointment Date
          </h2>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-slate-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* LOADING */}

        {loading ? (

          <div className="text-center py-12">

            <p className="text-slate-600">
              Loading appointments...
            </p>

          </div>

        ) : appointments.length === 0 ? (

          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">

            <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />

            <p className="text-slate-600 text-lg">
              No appointments for this date
            </p>

          </div>

        ) : (

          <div className="grid gap-6">

            {appointments.map((a) => (

              <div
                key={a.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >

                <div className="grid md:grid-cols-2 gap-6">

                  {/* LEFT */}

                  <div>

                    <div className="flex items-start justify-between mb-4">

                      <div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {a.name}
                        </h3>

                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                          {a.service}
                        </span>

                      </div>

                      <button
                        onClick={() => deleteAppointment(a.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-slate-600">

                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-3 text-slate-400" />
                        {a.phone}
                      </div>

                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-slate-400" />
                        {a.email}
                      </div>

                    </div>
                  </div>

                  {/* RIGHT */}

                  <div>

                    <div className="space-y-3">

                      <div className="flex items-center text-slate-600">

                        <Calendar className="h-4 w-4 mr-3 text-slate-400" />

                        <span>
                          Preferred:
                          <strong className="text-slate-800">
                            {" "} {a.preferred_date}
                          </strong>

                          {" "}at{" "}

                          <strong className="text-slate-800">
                            {a.preferred_time}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center text-slate-600">

                        <Clock className="h-4 w-4 mr-3 text-slate-400" />

                        <span>
                          Requested:
                          {" "}
                          {formatDate(a.created_at)}
                        </span>

                      </div>

                      {a.message && (

                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">

                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Patient Note:
                          </p>

                          <p className="text-slate-700 text-sm leading-relaxed">
                            {a.message}
                          </p>

                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;