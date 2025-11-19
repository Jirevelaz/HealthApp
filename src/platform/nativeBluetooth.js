const textDecoder = new TextDecoder();

let bleClientPromise = null;

async function getBleClient() {
  if (!bleClientPromise) {
    bleClientPromise = import("@capacitor-community/bluetooth-le").then(
      (module) => module.BleClient
    );
  }
  return bleClientPromise;
}

function shouldRetryScan(error) {
  if (!error) {
    return false;
  }
  const message =
    typeof error === "string"
      ? error
      : error.message || error?.toString() || "";
  if (!message) {
    return false;
  }
  const normalized = message.toLowerCase();
  return (
    normalized.includes("no device found") ||
    normalized.includes("no devices found")
  );
}

function buildScanOptions({ serviceUUID, namePrefix }) {
  const normalizedServiceUUID = serviceUUID?.trim();
  const normalizedNamePrefix = namePrefix?.trim();
  const options = {};
  if (normalizedServiceUUID) {
    options.services = [normalizedServiceUUID];
    options.optionalServices = [normalizedServiceUUID];
  }
  if (normalizedNamePrefix) {
    options.namePrefix = normalizedNamePrefix;
  }
  return options;
}

export async function connectToBleSensor({
  serviceUUID,
  characteristicUUID,
  namePrefix,
  onData,
}) {
  const normalizedServiceUUID = serviceUUID?.trim();
  const normalizedCharacteristicUUID = characteristicUUID?.trim();
  const BleClient = await getBleClient();
  await BleClient.initialize();
  const initialOptions = buildScanOptions({
    serviceUUID: normalizedServiceUUID,
    namePrefix,
  });
  const fallbackOptions =
    initialOptions.services && initialOptions.services.length > 0
      ? {
          optionalServices: initialOptions.optionalServices,
          ...(initialOptions.namePrefix
            ? { namePrefix: initialOptions.namePrefix }
            : {}),
        }
      : initialOptions;

  let device;
  try {
    device = await BleClient.requestDevice(initialOptions);
  } catch (error) {
    if (!shouldRetryScan(error)) {
      throw error;
    }
    device = await BleClient.requestDevice(fallbackOptions);
  }
  await BleClient.connect(device.deviceId);
  await BleClient.startNotifications(
    device.deviceId,
    normalizedServiceUUID,
    normalizedCharacteristicUUID,
    (value) => {
      const bytes =
        value instanceof DataView
          ? new Uint8Array(value.buffer)
          : value instanceof ArrayBuffer
          ? new Uint8Array(value)
          : new Uint8Array();
      const payload = textDecoder.decode(bytes);
      try {
        const parsed = JSON.parse(payload);
        onData?.(parsed);
      } catch (error) {
        onData?.({ raw: Array.from(bytes) });
      }
    }
  );
  return {
    deviceId: device.deviceId,
    async disconnect() {
      try {
        await BleClient.stopNotifications(
          device.deviceId,
          serviceUUID,
          characteristicUUID
        );
      } catch (error) {
        // ignore
      }
      try {
        await BleClient.disconnect(device.deviceId);
      } catch (error) {
        // ignore
      }
    },
  };
}
