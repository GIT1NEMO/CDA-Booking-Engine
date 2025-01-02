import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApiTester } from './components/ApiTester';
import { CustomerBooking } from './pages/CustomerBooking';
import { PublishedTours } from './components/admin/PublishedTours';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={
              <div className="container mx-auto px-4 py-8 space-y-8">
                <ApiTester />
                <PublishedTours />
              </div>
            } />
            <Route path="/tours/:tourSlug/:tourCode" element={
              <ErrorBoundary>
                <CustomerBooking />
              </ErrorBoundary>
            } />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;