import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageAdapter } from '../services/storageAdapter';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [safetyReports, setSafetyReports] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state from storage
  const refreshData = useCallback(() => {
    try {
      const d = storageAdapter.getDonations();
      const n = storageAdapter.getNgos();
      const t = storageAdapter.getVolunteerTasks();
      const notifs = storageAdapter.getNotifications(currentUser?.id);
      const s = storageAdapter.getSafetyReports();
      const metrics = storageAdapter.getImpactMetrics();

      setDonations(d);
      setNgos(n);
      setTasks(t);
      setNotifications(notifs);
      setSafetyReports(s);
      setImpactMetrics(metrics);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    refreshData();
    // Auto refresh every 20 seconds to catch expired countdowns
    const timer = setInterval(() => {
      refreshData();
    }, 20000);
    return () => clearInterval(timer);
  }, [refreshData]);

  // Donation creation
  const createDonation = async (donationData) => {
    try {
      const created = storageAdapter.createDonation(donationData, currentUser);
      refreshData();
      toast.success(`Donation ${created.id} listed successfully! Calculating NGO matches...`);
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to create donation');
      throw err;
    }
  };

  // NGO accepts donation
  const acceptDonation = async (donationId) => {
    try {
      const updated = storageAdapter.acceptDonationByNgo(donationId, currentUser);
      refreshData();
      toast.success(`Donation ${donationId} accepted! Courier pickup task generated.`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to accept donation');
      throw err;
    }
  };

  // Volunteer claims task
  const claimTask = async (taskId) => {
    try {
      const updated = storageAdapter.claimVolunteerTask(taskId, currentUser);
      refreshData();
      toast.success('Task claimed! Pickup coordinates and token are now active.');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to claim task');
      throw err;
    }
  };

  // QR / Token Pickup verification
  const verifyPickup = async (donationId, token) => {
    try {
      const updated = storageAdapter.verifyPickup(donationId, token);
      refreshData();
      toast.success(`Pickup verified for ${donationId}! Proceed to destination.`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to verify pickup');
      throw err;
    }
  };

  // QR / Token Delivery verification
  const verifyDelivery = async (donationId, token) => {
    try {
      const updated = storageAdapter.verifyDelivery(donationId, token);
      refreshData();
      toast.success(`Delivery handover recorded for ${donationId}! Awaiting NGO confirmation.`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to verify delivery');
      throw err;
    }
  };

  // Final NGO Receipt & Portion verification
  const confirmReceipt = async (donationId, payload) => {
    try {
      const updated = storageAdapter.confirmReceiptAndVerify(donationId, payload);
      refreshData();
      toast.success(`Rescue verified! +${payload.verifiedPortions || 50} portions added to community impact.`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to verify receipt');
      throw err;
    }
  };

  // Report unsafe food
  const submitSafetyReport = async (reportData) => {
    try {
      const report = storageAdapter.submitSafetyReport(reportData, currentUser);
      refreshData();
      toast.warning('Food safety concern logged. Listing placed under review.');
      return report;
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
      throw err;
    }
  };

  // Admin resolves safety report
  const resolveSafetyReport = async (reportId, notes) => {
    try {
      const resolved = storageAdapter.resolveSafetyReport(reportId, notes);
      refreshData();
      toast.success('Safety concern marked as resolved.');
      return resolved;
    } catch (err) {
      toast.error(err.message || 'Failed to resolve report');
      throw err;
    }
  };

  // Admin NGO verification
  const updateNgoVerification = async (ngoId, status) => {
    try {
      const updated = storageAdapter.updateNgoVerification(ngoId, status);
      refreshData();
      toast.success(`NGO verification status updated to "${status}".`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update verification');
      throw err;
    }
  };

  // Mark notification read
  const markNotificationRead = (notifId) => {
    storageAdapter.markNotificationAsRead(notifId);
    refreshData();
  };

  const markAllNotificationsRead = () => {
    storageAdapter.markAllNotificationsRead(currentUser?.id);
    refreshData();
  };

  // Reset entire demo data
  const resetDemoData = () => {
    storageAdapter.resetToDemo();
    refreshData();
    toast.info('Demo dataset reset to initial state.');
  };

  return (
    <DataContext.Provider
      value={{
        donations,
        ngos,
        tasks,
        notifications,
        safetyReports,
        impactMetrics,
        isLoading,
        refreshData,
        createDonation,
        acceptDonation,
        claimTask,
        verifyPickup,
        verifyDelivery,
        confirmReceipt,
        submitSafetyReport,
        resolveSafetyReport,
        updateNgoVerification,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
