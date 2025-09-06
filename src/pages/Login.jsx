import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'

export default function Login({ setIsAuth }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === '1234') {
      setIsAuth(true)
        localStorage.setItem("isAuth", "true"); // persist across reloads

      navigate('/home')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="centered">
      <Box className="card" component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>RE Solutions Login</Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </div>
  )
}
