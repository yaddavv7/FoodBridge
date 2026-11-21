import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// 22 Application Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DonorDashboard from './pages/DonorDashboard';
import CreateDonationPage from './pages/CreateDonationPage';
import MyDonationsPage from './pages/MyDonationsPage';
import DonationDetailsPage from './pages/DonationDetailsPage';
import SmartMatchingPage from './pages/SmartMatchingPage';
import NgoDashboard from './pages/NgoDashboard';
import BrowseDonationsPage from './pages/BrowseDonationsPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import DeliveryDetailsPage from './pages/DeliveryDetailsPage';
import QRVerificationPage from './pages/QRVerificationPage';
import LiveMapPage from './pages/LiveMapPage';
import ImpactAnalyticsPage from './pages/ImpactAnalyticsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboard from './pages/AdminDashboard';
import UserProfilePage from './pages/UserProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsGuidelinesPage from './pages/TermsGuidelinesPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = React.useMemo(() => window.location, []);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // If user role is not allowed, guide to their respective dashboard
    if (currentUser.role === 'donor') return <Navigate to="/donor" replace />;
    if (currentUser.role === 'ngo') return <Navigate to="/ngo" replace />;
    if (currentUser.role === 'volunteer') return <Navigate to="/volunteer" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen bg-offwhite text-slate-800 dark:bg-darkbg dark:text-slate-100 transition-colors duration-200">
                <Navbar />
                
                <main className="flex-1">
                  <Routes>
                    {/* 1. Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* 2. About Page */}
                    <Route path="/about" element={<AboutPage />} />

                    {/* 3. Login Page */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* 4. Registration Page */}
                    <Route path="/register" element={<RegisterPage />} />

                    {/* 5. Donor Dashboard */}
                    <Route
                      path="/donor"
                      element={
                        <ProtectedRoute allowedRoles={['donor', 'admin']}>
                          <DonorDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 6. Create Donation */}
                    <Route
                      path="/create-donation"
                      element={
                        <ProtectedRoute allowedRoles={['donor', 'admin']}>
                          <CreateDonationPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 7. My Donations */}
                    <Route
                      path="/donor/donations"
                      element={
                        <ProtectedRoute allowedRoles={['donor', 'admin']}>
                          <MyDonationsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 8. Donation Details */}
                    <Route path="/donations/:id" element={<DonationDetailsPage />} />

                    {/* 9. Smart NGO Matching */}
                    <Route
                      path="/matching/:id"
                      element={
                        <ProtectedRoute allowedRoles={['donor', 'admin']}>
                          <SmartMatchingPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 10. NGO Dashboard */}
                    <Route
                      path="/ngo"
                      element={
                        <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                          <NgoDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 11. Browse Donations */}
                    <Route path="/browse" element={<BrowseDonationsPage />} />

                    {/* 12. Volunteer Courier Dashboard */}
                    <Route
                      path="/volunteer"
                      element={
                        <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                          <VolunteerDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 13. Delivery Details */}
                    <Route
                      path="/volunteer/delivery/:id"
                      element={
                        <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                          <DeliveryDetailsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 14. QR Verification */}
                    <Route path="/verify-qr" element={<QRVerificationPage />} />

                    {/* 15. Live Donation Map */}
                    <Route path="/map" element={<LiveMapPage />} />

                    {/* 16. Impact Analytics */}
                    <Route path="/impact" element={<ImpactAnalyticsPage />} />

                    {/* 17. Leaderboard & Gamification */}
                    <Route path="/leaderboard" element={<LeaderboardPage />} />

                    {/* 18. Admin Control Dashboard */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 19. User Profile */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <UserProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 20. Notifications Center */}
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 21. Privacy Policy */}
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />

                    {/* 22. Terms & Food Safety Guidelines */}
                    <Route path="/terms" element={<TermsGuidelinesPage />} />

                    {/* Fallback Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
