import heartRateSeed from "@/data/HeartRate.json";
import stepsSeed from "@/data/Steps.json";

const heartRates = Array.isArray(heartRateSeed) ? [...heartRateSeed] : [];
const steps = Array.isArray(stepsSeed) ? [...stepsSeed] : [];

function sortData(data, sort) {
  if (!sort) return data;
  const direction = sort.startsWith("-") ? -1 : 1;
  const field = sort.replace(/^[-+]/, "");
  return [...data].sort((a, b) => {
    if (a[field] < b[field]) return -1 * direction;
    if (a[field] > b[field]) return 1 * direction;
    return 0;
  });
}

async function listEntity(data, sort) {
  return Promise.resolve(sortData(data, sort));
}

async function createEntity(collection, payload) {
  const entry = {
    id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
    ...payload,
  };
  collection.unshift(entry);
  return Promise.resolve(entry);
}

export const base44 = {
  entities: {
    HeartRate: {
      list: (sort) => listEntity(heartRates, sort),
      create: (data) => createEntity(heartRates, { ...data, timestamp: data.timestamp ?? new Date().toISOString() }),
      get: (id) => Promise.resolve(heartRates.find((item) => item.id === id)),
      update: (id, updates) => {
        const index = heartRates.findIndex((item) => item.id === id);
        if (index === -1) {
          return Promise.reject(new Error("Registro no encontrado"));
        }
        heartRates[index] = { ...heartRates[index], ...updates };
        return Promise.resolve(heartRates[index]);
      },
    },
    Steps: {
      list: (sort) => listEntity(steps, sort),
      create: (data) =>
        createEntity(steps, {
          ...data,
          date: data.date ?? new Date().toISOString().slice(0, 10),
        }),
      get: (id) => Promise.resolve(steps.find((item) => item.id === id)),
      update: (id, updates) => {
        const index = steps.findIndex((item) => item.id === id);
        if (index === -1) {
          return Promise.reject(new Error("Registro no encontrado"));
        }
        steps[index] = { ...steps[index], ...updates };
        return Promise.resolve(steps[index]);
      },
    },
  },
};
