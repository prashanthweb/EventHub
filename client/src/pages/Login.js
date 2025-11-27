import React, {useState} from 'react';
import { TextField, Button, Typography, Alert, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Welcome to EventHub
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Login to continue
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={submit}>
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
          <Button 
            variant="contained" 
            sx={{mt:2, mb:2}} 
            onClick={submit}
            fullWidth
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
        
        <Typography align="center" sx={{mt:2}}>
          Don't have an account? <Link to="/register">Register here</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
