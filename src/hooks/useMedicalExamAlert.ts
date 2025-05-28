
import { useState, useEffect } from 'react';

export const useMedicalExamAlert = () => {
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = () => {
    // Check if alert was already shown in this session
    const alreadyShown = sessionStorage.getItem('medicalExamAlertShown');
    
    if (!alreadyShown) {
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return {
    showAlert,
    triggerAlert,
    closeAlert,
  };
};
