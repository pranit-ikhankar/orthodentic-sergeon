import { useEffect, useState } from "react";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("https://dentist-website-n87i.onrender.com/api/appointments?password=doctor123")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAppointments(data))
      .catch(() => alert("Access Denied"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Appointments</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, index) => (
            <tr key={index}>
              <td>{a.name}</td>
              <td>{a.phone}</td>
              <td>{a.email}</td>
              <td>{a.service}</td>
              <td>{a.preferred_date}</td>
              <td>{a.preferred_time}</td>
              <td>{a.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}