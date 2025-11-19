import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/app/layout/MainLayout";
import Dashboard from "@/screens/Dashboard";
import Sharing from "@/screens/Sharing";
import Browse from "@/screens/Browse";
import Steps from "@/screens/Steps";
import HeartRate from "@/screens/HeartRate";
import Settings from "@/screens/Settings";
import { createPageUrl } from "@/utils";

const appPages = [
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

export default function AppRoutes() {
  return (
    <Routes>
      {appPages.map(({ path, component }) => (
        <Route
          key={path}
          path={path}
          element={<LayoutRoute component={component} />}
        />
      ))}
      <Route
        path="*"
        element={<Navigate to={createPageUrl("Dashboard")} replace />}
      />
    </Routes>
  );
}
