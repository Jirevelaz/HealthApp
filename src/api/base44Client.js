import heartRateSeed from "@/data/HeartRate.json";
import stepsSeed from "@/data/Steps.json";
import {
  fetchSensorData,
  saveSensorReading,
  updateSensorReading,
  isFirebaseReady,
} from "@/services/sensorDataService";

const fallbackData = {
  HeartRate: Array.isArray(heartRateSeed) ? [...heartRateSeed] : [],
  Steps: Array.isArray(stepsSeed) ? [...stepsSeed] : [],
};

function sortData(data, sort) {
  if (!sort) return [...data];
  const direction = sort.startsWith("-") ? -1 : 1;
  const field = sort.replace(/^[-+]/, "");
  return [...data].sort((a, b) => {
    if (a[field] < b[field]) return -1 * direction;
    if (a[field] > b[field]) return 1 * direction;
    return 0;
  });
}

async function listEntity(entityName, sort) {
  if (isFirebaseReady()) {
    try {
      const records = await fetchSensorData(entityName, sort);
      if (records.length) {
        return records;
      }
    } catch (error) {
      console.error(`Error obteniendo ${entityName} desde Firebase:`, error);
    }
  }
  return sortData(fallbackData[entityName] ?? [], sort);
}

async function createEntity(entityName, payload) {
  if (isFirebaseReady()) {
    try {
      const saved = await saveSensorReading(entityName, payload);
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error(`Error guardando ${entityName} en Firebase:`, error);
    }
  }
  const entry = {
    id: `${entityName.toLowerCase()}-${Date.now()}`,
    ...payload,
  };
  fallbackData[entityName]?.unshift(entry);
  return entry;
}

async function updateEntity(entityName, id, updates) {
  if (isFirebaseReady()) {
    try {
      const updated = await updateSensorReading(entityName, id, updates);
      if (updated) {
        return updated;
      }
    } catch (error) {
      console.error(`Error actualizando ${entityName} en Firebase:`, error);
    }
  }
  const list = fallbackData[entityName];
  if (!list) {
    return null;
  }
  const target = list.find((item) => item.id === id);
  if (target) {
    Object.assign(target, updates);
    return target;
  }
  return null;
}

export const base44 = {
  entities: {
    HeartRate: {
      list: (sort) => listEntity("HeartRate", sort),
      create: (data) =>
        createEntity("HeartRate", {
          ...data,
          timestamp: data.timestamp ?? new Date().toISOString(),
        }),
      update: (id, updates) =>
        updateEntity("HeartRate", id, {
          ...updates,
          timestamp: updates.timestamp ?? new Date().toISOString(),
        }),
    },
    Steps: {
      list: (sort) => listEntity("Steps", sort),
      create: (data) =>
        createEntity("Steps", {
          ...data,
          date: data.date ?? new Date().toISOString().slice(0, 10),
        }),
      update: (id, updates) =>
        updateEntity("Steps", id, {
          ...updates,
          date: updates.date ?? new Date().toISOString().slice(0, 10),
        }),
    },
  },
};
