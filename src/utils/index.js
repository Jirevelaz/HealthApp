const routes = {
  Dashboard: "/dashboard",
  Sharing: "/sharing",
  Browse: "/browse",
  Steps: "/steps",
  HeartRate: "/heart-rate",
  Settings: "/settings",
};

export function createPageUrl(pageName) {
  return routes[pageName] ?? `/${String(pageName).toLowerCase()}`;
}

export function getPageNameFromPath(pathname) {
  const entry = Object.entries(routes).find(([, path]) => path === pathname);
  return entry ? entry[0] : "Dashboard";
}

export const appRoutes = routes;
