import { useEffect, useState } from "react";
import axios from 'axios';
// bg-[#F3F4E8]
// bg-[#A7C3AD]
// border-[#D4DBC1]
// text-[#4e5d58]
function Bookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('/api/bookings/my-bookings');
                setBookings(res.data);
            }
        }
    })
}