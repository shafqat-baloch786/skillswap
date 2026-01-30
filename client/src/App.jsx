import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Swaps from './pages/Swaps';
import MyPosts from './pages/MyPosts';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import PostDetails from './pages/PostDetails';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <Layout><Dashboard /></Layout>
            </ProtectedRoute>
        } />
        
        <Route path="/marketplace" element={
            <ProtectedRoute>
                <Layout><Marketplace /></Layout>
            </ProtectedRoute>
        } />

        {/* Updated Route to handle single post view */}
        <Route path="/posts/:id" element={
            <ProtectedRoute>
                <Layout><PostDetails /></Layout>
            </ProtectedRoute>
        } />

        <Route path="/swaps" element={
            <ProtectedRoute>
                <Layout><Swaps /></Layout>
            </ProtectedRoute>
        } />

        <Route path="/my-posts" element={
            <ProtectedRoute>
                <Layout><MyPosts /></Layout>
            </ProtectedRoute>
        } />

        <Route path="/profile" element={
            <ProtectedRoute>
                <Layout><Profile /></Layout>
            </ProtectedRoute>
        } />

        <Route path="/profile/edit" element={
            <ProtectedRoute>
                <Layout><EditProfile /></Layout>
            </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;