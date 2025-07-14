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
    <div className="min-h-screen bg-[#F3F4E8] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4e5d58] mb-8 text-center">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-[#819A91] text-lg">
            You have no bookings yet.
          </p>
        ) : (
          bookings.map(b => (
            <div
              key={b.id}
              className="mb-6 p-6 rounded-xl border border-[#D4DBC1] bg-white shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-[#4e5d58] mb-2">
                {b.item_title}
              </h2>
              <p className="text-[#667c75]">
                <span className="font-medium text-[#4e5d58]">From:</span> {b.start_date}
              </p>
              <p className="text-[#667c75]">
                <span className="font-medium text-[#4e5d58]">To:</span> {b.end_date}
              </p>
              <p className="mt-2">
                Status:{' '}
                <span className="font-bold text-[#A7C3AD] uppercase tracking-wide">
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
