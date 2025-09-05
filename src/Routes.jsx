import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import VoiceReminderCreation from './pages/voice-reminder-creation';
import ExpenseTrackingInterface from './pages/expense-tracking-interface';
import IncomeTrackingInterface from './pages/income-tracking-interface';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ExpenseTrackingInterface />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/voice-reminder-creation" element={<VoiceReminderCreation />} />
        <Route path="/expense-tracking-interface" element={<ExpenseTrackingInterface />} />
        <Route path="/income-tracking-interface" element={<IncomeTrackingInterface />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;