import { useEffect, useState } from "react";
import axios from 'axios';
import api from "../api";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/bookings/my-bookings");
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings');
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-blue-700 text-lg">
            You have no bookings yet.
          </p>
        ) : (
          bookings.map(b => (
            <div
              key={b.id}
              className="mb-6 p-6 rounded-xl border border-slate-300 bg-white shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                {b.item_title}
              </h2>
              <p className="text-slate-600">
                <span className="font-medium text-slate-700">From:</span> {b.start_date}
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-700">To:</span> {b.end_date}
              </p>
              <p className="mt-2">
                Status:{' '}
                <span className="font-bold text-green-700 uppercase tracking-wide">
                  {b.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>

  );
}

export default Bookings;
