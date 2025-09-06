import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) return <Navigate to="/" />
  return children
}
