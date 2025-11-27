import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box, Avatar, Menu, MenuItem, Chip, ThemeProvider, CssBaseline } from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { darkTheme } from './theme/darkTheme';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            EventHub
          </Typography>
          
          <Button color="inherit" component={Link} to="/">
            Events
          </Button>
          
          {user.role === 'organizer' && (
            <Button color="inherit" component={Link} to="/create">
              Create Event
            </Button>
          )}
          
          <Button color="inherit" component={Link} to="/bookings">
            My Bookings
          </Button>
          
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Box sx={{ textAlign: 'right', mr: 2 }}>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {user.name}
              </Typography>
              <Chip 
                label={user.role === 'participant' ? 'Participant' : 'Organizer'} 
                size="small" 
                color={user.role === 'organizer' ? 'secondary' : 'primary'}
                sx={{ 
                  height: 16, 
                  fontSize: '0.7rem',
                  color: 'white',
                  backgroundColor: user.role === 'organizer' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                }}
              />
            </Box>
            
            <Button
              color="inherit"
              onClick={handleMenu}
              startIcon={<AccountCircle />}
            >
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
