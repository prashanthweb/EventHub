import React, {useEffect, useState} from 'react';
import API from '../api';
import { Typography, Card, CardContent } from '@mui/material';

export default function BookingHistory(){
  const [bookings, setBookings] = useState([]);
  useEffect(()=>{ fetch(); },[]);
  const fetch = async () => {
    const token = localStorage.getItem('token');
    if(!token) return;
    const res = await API.get('/api/bookings', { headers: { Authorization: 'Bearer '+token } });
    setBookings(res.data);
  };
  return (
    <>
      <Typography variant="h4">Bookings</Typography>
      {bookings.map(b=>(
        <Card key={b._id} sx={{mt:2}}>
          <CardContent>
            <Typography>{b.event.title}</Typography>
            <Typography>Seats: {b.seats}</Typography>
            <Typography>Status: {b.status}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
