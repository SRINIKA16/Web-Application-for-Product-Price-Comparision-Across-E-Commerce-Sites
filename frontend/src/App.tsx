import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { AlertsProvider } from './context/AlertsContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { WishlistPage } from './pages/WishlistPage';
import { AlertsPage } from './pages/AlertsPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AlertsProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/recommendations" element={<RecommendationPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/dashboard" element={<UserDashboardPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AlertsProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;
