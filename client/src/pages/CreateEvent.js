import React, {useState} from 'react';
import API from '../api';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState(100);
  const navigate = useNavigate();
  const submit = async () => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return navigate('/login');
      await API.post('/api/events', { title, description, date, location, category, capacity }, { headers: { Authorization: 'Bearer '+token } });
      alert('Event created');
      navigate('/');
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };
  return (
    <>
      <Typography variant="h5">Create Event</Typography>
      <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} fullWidth sx={{mt:2}}/>
      <TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)} fullWidth sx={{mt:2}}/>
      <TextField label="Date (ISO)" value={date} onChange={e=>setDate(e.target.value)} fullWidth sx={{mt:2}}/>
      <TextField label="Location" value={location} onChange={e=>setLocation(e.target.value)} fullWidth sx={{mt:2}}/>
      <TextField label="Category" value={category} onChange={e=>setCategory(e.target.value)} fullWidth sx={{mt:2}}/>
      <TextField label="Capacity" value={capacity} onChange={e=>setCapacity(e.target.value)} fullWidth sx={{mt:2}}/>
      <Button variant="contained" sx={{mt:2}} onClick={submit}>Create</Button>
    </>
  )
}
