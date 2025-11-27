import React, {useEffect, useState} from 'react';
import API from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Card, CardContent, Grid, Box, Chip } from '@mui/material';
import { Event, LocationOn, CalendarToday, People, AttachMoney, Delete } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function EventDetails(){
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(()=>{ 
    API.get('/api/events/'+id).then(r=>setEv(r.data)); 
  },[id]);
  
  const book = async () => {
    const token = localStorage.getItem('token');
    if(!token) return navigate('/login');
    await API.post('/api/bookings', { eventId: id, seats: 1 }, { headers: { Authorization: 'Bearer '+token } });
    alert('Booked — check bookings page');
    navigate('/bookings');
  };

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return navigate('/login');
      
      await API.delete('/api/events/'+id, { headers: { Authorization: 'Bearer '+token } });
      alert('Event deleted successfully');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
    setDeleteDialogOpen(false);
  };

  const isOrganizer = user && ev && user._id === ev.organizer;
  const isParticipant = user && user.role === 'participant';
  
  if(!ev) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Typography>Loading...</Typography>
    </Box>
  );
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {ev.title}
            </Typography>
            {isOrganizer && (
              <Chip 
                label="Your Event" 
                color="secondary" 
                size="small"
              />
            )}
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {ev.description}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">Location</Typography>
              </Box>
              <Typography variant="body1">{ev.location}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">Date & Time</Typography>
              </Box>
              <Typography variant="body1">{new Date(ev.date).toLocaleString()}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">Capacity</Typography>
              </Box>
              <Typography variant="body1">{ev.capacity} people</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">Price</Typography>
              </Box>
              <Typography variant="body1">${ev.price}</Typography>
            </Grid>
          </Grid>

          {/* Special section for organizers to see attendees count */}
          {isOrganizer && (
            <Card sx={{ backgroundColor: 'background.paper', border: '1px solid', borderColor: 'primary.main', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Event Management
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body2" color="text.secondary">Current Attendees</Typography>
                </Box>
                <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                  {ev.attendeesCount || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  out of {ev.capacity} capacity
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Event Status: {ev.attendeesCount >= ev.capacity ? 'Fully Booked' : 'Available'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Regular attendees count for participants */}
          {isParticipant && !isOrganizer && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Attendees: {ev.attendeesCount || 0} / {ev.capacity}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {isParticipant && !isOrganizer && (
              <Button 
                variant="contained" 
                onClick={book}
                size="large"
              >
                Book Event
              </Button>
            )}
            
            {isOrganizer && (
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => setDeleteDialogOpen(true)}
                startIcon={<Delete />}
              >
                Delete Event
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{ev.title}"? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will also cancel all existing bookings for this event.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteEvent} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
