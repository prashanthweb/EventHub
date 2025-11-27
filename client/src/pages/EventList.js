import React, {useEffect, useState} from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, TextField, MenuItem } from '@mui/material';

export default function EventList(){
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const categories = ['Tech','Music','Workshop','Sports','Other'];

  useEffect(()=>{ fetchEvents(); }, []);
  const fetchEvents = async () => {
    const res = await API.get('/api/events');
    setEvents(res.data);
  };
  const doSearch = async () => {
    const params = [];
    if (search) params.push('search='+encodeURIComponent(search));
    if (category) params.push('category='+encodeURIComponent(category));
    const q = params.length ? '?'+params.join('&') : '';
    const res = await API.get('/api/events'+q);
    setEvents(res.data);
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>Events</Typography>
      <TextField label="Search" value={search} onChange={e=>setSearch(e.target.value)} sx={{mb:2, mr:2}}/>
      <TextField select label="Category" value={category} onChange={e=>setCategory(e.target.value)} sx={{mb:2, mr:2}} style={{width:200}}>
        <MenuItem value="">All</MenuItem>
        {categories.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
      <Button onClick={doSearch} variant="contained" sx={{ml:1}}>Apply</Button>
      <Grid container spacing={2} sx={{mt:2}}>
        {events.map(ev=>(
          <Grid key={ev._id} item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">{ev.title}</Typography>
                <Typography>{ev.description}</Typography>
                <Typography>When: {new Date(ev.date).toLocaleString()}</Typography>
                <Button component={Link} to={'/events/'+ev._id}>Details</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
