import React, {useState, useEffect} from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Avatar, 
  Chip, 
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from '@mui/material';
import { 
  Person, 
  Email, 
  Badge, 
  CalendarToday, 
  Event, 
  Bookmark,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function Profile(){
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [userStats, setUserStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    eventsCreated: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch user's bookings
      const bookingsResponse = await API.get('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch user's created events (if organizer)
      let eventsCreated = 0;
      if (user.role === 'organizer') {
        const eventsResponse = await API.get('/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        eventsCreated = eventsResponse.data.filter(event => event.organizer === user._id).length;
      }

      setUserStats({
        totalEvents: bookingsResponse.data.length,
        totalBookings: bookingsResponse.data.reduce((sum, booking) => sum + booking.seats, 0),
        eventsCreated
      });
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Update user profile via API
      const response = await API.put('/api/auth/profile', 
        { name }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update auth context with the new user data
      setUser(response.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if(!user) return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h6">Please log in to view your profile</Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Profile Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              
              <Chip 
                label={user.role === 'participant' ? 'Participant' : 'Organizer'}
                color={user.role === 'organizer' ? 'secondary' : 'primary'}
                sx={{ mb: 2 }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Badge sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    {user.role === 'participant' ? 'Event Participant' : 'Event Organizer'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics and Activity */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Statistics Cards */}
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Event sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" color="primary">
                  {userStats.totalEvents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Events Joined
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Bookmark sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4" color="secondary">
                  {userStats.totalBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tickets
                </Typography>
              </Paper>
            </Grid>
            
            {user.role === 'organizer' && (
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <Person sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {userStats.eventsCreated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Events Created
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Edit Profile Section */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Profile Information</Typography>
                {!isEditing ? (
                  <Button 
                    startIcon={<Edit />} 
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box>
                    <Button 
                      startIcon={<Save />} 
                      onClick={handleSave}
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button 
                      startIcon={<Cancel />} 
                      onClick={handleCancel}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Full Name" 
                    value={name} 
                    onChange={e=>setName(e.target.value)} 
                    fullWidth 
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Email" 
                    value={email} 
                    disabled
                    fullWidth 
                    helperText="Email cannot be changed"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
