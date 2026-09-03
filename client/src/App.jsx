import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { VoiceProvider } from './context/VoiceContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AskYojnaSetuModal from './components/AskYojnaSetuModal';
import AskYojnaSetuChatbot from './components/AskYojnaSetuChatbot';

import LandingPage from './pages/LandingPage';
import EntrepreneurWizard from './pages/EntrepreneurWizard';
import MatchResultsPage from './pages/MatchResultsPage';
import ScholarSetuPage from './pages/ScholarSetuPage';
import ProviderDashboard from './pages/ProviderDashboard';
import SponsorshipPage from './pages/SponsorshipPage';
import AdminDashboard from './pages/AdminDashboard';
import DocumentVerificationPage from './pages/DocumentVerificationPage';
import TrackApplicationPage from './pages/TrackApplicationPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

export default function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <AuthProvider>
      <LanguageProvider>
        <VoiceProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#F7FAFA] text-[#173B57] selection:bg-[#0F766E] selection:text-white font-sans">
              
              <Navbar onOpenAiModal={() => setIsAiModalOpen(true)} />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage onOpenAiModal={() => setIsAiModalOpen(true)} />} />
                  <Route path="/wizard" element={<EntrepreneurWizard />} />
                  <Route path="/matches" element={<MatchResultsPage />} />
                  <Route path="/scholarsetu" element={<ScholarSetuPage />} />
                  <Route path="/doc-verify" element={<DocumentVerificationPage />} />
                  <Route path="/track-application" element={<TrackApplicationPage />} />
                  <Route path="/provider" element={<ProviderDashboard />} />
                  <Route path="/sponsorship" element={<SponsorshipPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>

              <Footer />

              {/* Floating AskYojnaSetu Sarvam AI Multilingual Voice Chatbot */}
              <AskYojnaSetuChatbot />

              <AskYojnaSetuModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
              />

            </div>
          </Router>
        </VoiceProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
