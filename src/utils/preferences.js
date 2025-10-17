const PREFERENCES_STORAGE_KEY = "appPreferences";

export const defaultPreferences = {
  theme: "light",
  dailyStepGoal: 10000,
  measurementUnit: "metric",
  notifications: {
    heartRateAlerts: true,
    stepGoalReminders: true,
  },
  dataSync: {
    autoSync: true,
    syncFrequencyMinutes: 15,
  },
  heartRate: {
    alertThreshold: 120,
    restingTarget: 65,
  },
};

const isBrowser = () => typeof window !== "undefined";

function mergePreferences(saved) {
  if (!saved || typeof saved !== "object") {
    return { ...defaultPreferences };
  }
  return {
    ...defaultPreferences,
    ...saved,
    notifications: {
      ...defaultPreferences.notifications,
      ...(saved.notifications || {}),
    },
    dataSync: {
      ...defaultPreferences.dataSync,
      ...(saved.dataSync || {}),
    },
    heartRate: {
      ...defaultPreferences.heartRate,
      ...(saved.heartRate || {}),
    },
  };
}

export function loadPreferences() {
  if (!isBrowser()) {
    return { ...defaultPreferences };
  }
  const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
  if (!raw) {
    return { ...defaultPreferences };
  }
  try {
    const parsed = JSON.parse(raw);
    return mergePreferences(parsed);
  } catch (error) {
    console.error("Error parsing app preferences", error);
    return { ...defaultPreferences };
  }
}

export function savePreferences(nextPreferences) {
  if (!isBrowser()) {
    return;
  }
  const merged = mergePreferences(nextPreferences);
  window.localStorage.setItem(
    PREFERENCES_STORAGE_KEY,
    JSON.stringify(merged)
  );
  window.dispatchEvent(
    new CustomEvent("appPreferencesUpdated", { detail: merged })
  );
}

export function getDailyStepGoal() {
  return loadPreferences().dailyStepGoal;
}

export function getHeartRateThreshold() {
  return loadPreferences().heartRate.alertThreshold;
}

export function getMeasurementUnit() {
  return loadPreferences().measurementUnit;
}

export function setThemePreference(theme) {
  if (!isBrowser()) {
    return;
  }
  const current = loadPreferences();
  if (current.theme === theme) {
    return;
  }
  savePreferences({ ...current, theme });
}
