import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Header from './components/Header';
import Home from './pages/Home';
import FailureStories from './pages/FailureStories';
import TeardownDetail from './pages/TeardownDetail';
import Newsletter from './pages/Newsletter';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import SubmitStory from './pages/SubmitStory';
import Footer from './components/Footer';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/failure-stories" element={<FailureStories />} />
              <Route path="/teardown/:id" element={<TeardownDetail />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/submit-story" element={<SubmitStory />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;