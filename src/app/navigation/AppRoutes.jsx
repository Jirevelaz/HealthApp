import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "@/app/layout/MainLayout";
import Dashboard from "@/screens/Dashboard";
import Sharing from "@/screens/Sharing";
import Browse from "@/screens/Browse";
import Steps from "@/screens/Steps";
import HeartRate from "@/screens/HeartRate";
import Settings from "@/screens/Settings";
import Login from "@/screens/Login";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/app/providers/AuthProvider";

const protectedPages = [
  { name: "Dashboard", path: createPageUrl("Dashboard"), component: Dashboard },
  { name: "Sharing", path: createPageUrl("Sharing"), component: Sharing },
  { name: "Browse", path: createPageUrl("Browse"), component: Browse },
  { name: "Steps", path: createPageUrl("Steps"), component: Steps },
  { name: "HeartRate", path: createPageUrl("HeartRate"), component: HeartRate },
  { name: "Settings", path: createPageUrl("Settings"), component: Settings },
];

function LayoutRoute({ component: Component }) {
  return (
    <MainLayout>
      <Component />
    </MainLayout>
  );
}

function ProtectedRoute({ component }) {
  const { user, loading, authAvailable } = useAuth();
  const location = useLocation();

  if (!authAvailable) {
    return <LayoutRoute component={component} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={createPageUrl("Login")}
        state={{ from: location }}
        replace
      />
    );
  }

  return <LayoutRoute component={component} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={createPageUrl("Login")} element={<Login />} />
      {protectedPages.map(({ path, component }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute component={component} />}
        />
      ))}
      <Route
        path="*"
        element={<Navigate to={createPageUrl("Dashboard")} replace />}
      />
    </Routes>
  );
}
