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

export async function connectToBleSensor({
  serviceUUID,
  characteristicUUID,
  onData,
}) {
  const BleClient = await getBleClient();
  await BleClient.initialize();
  const device = await BleClient.requestDevice({
    services: [serviceUUID],
  });
  await BleClient.connect(device.deviceId);
  await BleClient.startNotifications(
    device.deviceId,
    serviceUUID,
    characteristicUUID,
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
        onData?.({ raw: Array.from(new Uint8Array(buffer)) });
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
