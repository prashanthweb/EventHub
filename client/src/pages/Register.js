import React, {useState} from 'react';
import { TextField, Button, Typography, Alert, Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password, role);
    
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Join EventHub
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Create your account
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={submit}>
          <TextField 
            label="Full Name" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            fullWidth 
            sx={{mt:2}}
            required
          />
          <TextField 
            label="Email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            fullWidth 
            sx={{mt:2}}
            required
            type="email"
          />
          <TextField 
            label="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            type="password" 
            fullWidth 
            sx={{mt:2}}
            required
          />
          <FormControl fullWidth sx={{mt:2}}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={e=>setRole(e.target.value)}
            >
              <MenuItem value="participant">Participant</MenuItem>
              <MenuItem value="organizer">Organizer</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            sx={{mt:2, mb:2}} 
            onClick={submit}
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </Box>
        
        <Typography align="center" sx={{mt:2}}>
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
