import React, { useState, useEffect, useRef, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Usb, X, CheckCircle, Loader2, Signal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { connectToBleSensor } from "@/platform/nativeBluetooth";
import {
  saveSensorReading,
  isFirebaseReady,
} from "@/services/sensorDataService";

const statusBadge = {
  connected: (
    <Badge variant="success" className="bg-success/20 text-success">
      Conectado
    </Badge>
  ),
  connecting: (
    <Badge variant="outline" className="border-warning/50 text-warning">
      Conectando...
    </Badge>
  ),
  disconnected: <Badge variant="secondary">Desconectado</Badge>,
};

export default function ArduinoConnector({
  isOpen,
  onOpenChange,
  onDataReceived,
}) {
  const isNative = Capacitor.isNativePlatform();
  const [status, setStatus] = useState("disconnected");
  const [port, setPort] = useState(null);
  const [bleConnection, setBleConnection] = useState(null);
  const [serviceUUID, setServiceUUID] = useState(
    "0000ffe0-0000-1000-8000-00805f9b34fb"
  );
  const [characteristicUUID, setCharacteristicUUID] = useState(
    "0000ffe1-0000-1000-8000-00805f9b34fb"
  );
  const [deviceNamePrefix, setDeviceNamePrefix] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [warning, setWarning] = useState("");
  const readerRef = useRef(null);
  const portRef = useRef(null);

  const persistReading = useCallback(async (payload) => {
    if (!payload) return;
    if (!isFirebaseReady()) {
      return;
    }
    try {
      if (payload.type === "heartRate") {
        await saveSensorReading("HeartRate", {
          bpm: payload.value,
          activity: payload.activity ?? "reposo",
          timestamp: payload.timestamp ?? new Date().toISOString(),
        });
      } else if (payload.type === "steps") {
        await saveSensorReading("Steps", {
          count: payload.value,
          date:
            payload.date ??
            new Date().toISOString().slice(0, 10),
          distance: payload.distance,
          calories: payload.calories,
          timestamp: payload.timestamp ?? new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error al guardar lectura en Firebase:", error);
    }
  }, []);

  const handleIncomingData = useCallback(
    (raw) => {
      try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        setLastMessage(JSON.stringify(parsed));
        onDataReceived?.(parsed);
        persistReading(parsed);
      } catch (error) {
        console.warn("Dato recibido no es JSON válido:", raw);
      }
    },
    [onDataReceived, persistReading]
  );

  const handleConnect = async () => {
    if (isNative) {
      try {
        setStatus("connecting");
        setWarning("");
        const connection = await connectToBleSensor({
          serviceUUID: serviceUUID.trim(),
          characteristicUUID: characteristicUUID.trim(),
          namePrefix: deviceNamePrefix.trim(),
          onData: handleIncomingData,
        });
        setBleConnection(connection);
        setStatus("connected");
      } catch (error) {
        console.error("Error al conectar por Bluetooth:", error);
        setWarning(
          "No fue posible establecer la conexión Bluetooth. Verifica el UUID y que el sensor esté encendido."
        );
        setStatus("disconnected");
      }
      return;
    }

    if (!("serial" in navigator)) {
      setWarning(
        "Este dispositivo no soporta Web Serial. Usa el build nativo (Capacitor) para conectarte por Bluetooth."
      );
      return;
    }

    try {
      setStatus("connecting");
      setWarning("");
      const serialPort = await navigator.serial.requestPort();
      await serialPort.open({ baudRate: 9600 });
      setPort(serialPort);
      portRef.current = serialPort;
      setStatus("connected");
    } catch (error) {
      console.error("Error al conectar con el puerto serie:", error);
      setStatus("disconnected");
    }
  };

  const handleDisconnect = async () => {
    if (isNative) {
      if (bleConnection) {
        await bleConnection.disconnect();
        setBleConnection(null);
      }
      setStatus("disconnected");
      return;
    }

    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
      } catch (error) {
        console.error("Error al cancelar el lector:", error);
      }
    }
    if (portRef.current && portRef.current.writable) {
      try {
        await portRef.current.writable.getWriter().close();
      } catch (error) {
        console.error("Error al cerrar el escritor:", error);
      }
    }
    if (portRef.current) {
      try {
        await portRef.current.close();
      } catch (error) {
        console.error("Error al cerrar el puerto:", error);
      }
    }

    setPort(null);
    portRef.current = null;
    readerRef.current = null;
    setStatus("disconnected");
  };

  useEffect(() => {
    const readLoop = async () => {
      if (!port) return;

      while (port.readable) {
        const textDecoder = new TextDecoderStream();
        const reader = textDecoder.readable.getReader();
        readerRef.current = reader;
        port.readable.pipeTo(textDecoder.writable);

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              break;
            }
            if (value && value.length) {
              handleIncomingData(value);
            }
          }
        } catch (error) {
          console.error("Error leyendo del puerto:", error);
          handleDisconnect();
          break;
        }
      }
    };

    if (!isNative && port && status === "connected") {
      readLoop();
    }

    return () => {
      if (!isNative && (port || readerRef.current)) {
        handleDisconnect();
      }
    };
  }, [isNative, port, status, handleIncomingData]);

  useEffect(() => {
    return () => {
      if (isNative && bleConnection) {
        bleConnection.disconnect();
      }
    };
  }, [isNative, bleConnection]);

  const renderBadge = () => {
    if (status === "connected") return statusBadge.connected;
    if (status === "connecting") return statusBadge.connecting;
    return statusBadge.disconnected;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Usb className="h-5 w-5 text-primary" />
            Conexion de dispositivo
          </DialogTitle>
          <DialogDescription className="text-sm text-text-muted">
            {isNative
              ? "Activa Bluetooth y selecciona tu módulo para recibir lecturas en tiempo real."
              : "Conecta tu placa mediante USB (Web Serial) para recibir lecturas en tiempo real."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between rounded-2xl border border-outline/40 bg-surface-muted/40 px-4 py-3">
            <span className="text-sm font-semibold text-text-secondary">
              Estado
            </span>
            {renderBadge()}
          </div>
          {isNative && (
            <div className="space-y-3 rounded-2xl border border-outline/20 bg-surface-muted/40 px-4 py-3">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-text-muted">
                  Nombre o prefijo (opcional)
                </Label>
                <Input
                  value={deviceNamePrefix}
                  onChange={(event) => setDeviceNamePrefix(event.target.value)}
                  placeholder="Ej. ESP32"
                />
                <p className="text-xs text-text-muted">
                  Si lo indicas filtramos la lista, si lo dejas vac&iacute;o se
                  mostrar&aacute;n todos los dispositivos disponibles.
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-text-muted">
                  Service UUID
                </Label>
                <Input
                  value={serviceUUID}
                  onChange={(event) => setServiceUUID(event.target.value)}
                  placeholder="UUID del servicio (por ej. 0000FFE0-...)"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-text-muted">
                  Characteristic UUID
                </Label>
                <Input
                  value={characteristicUUID}
                  onChange={(event) => setCharacteristicUUID(event.target.value)}
                  placeholder="UUID de la característica (por ej. 0000FFE1-...)"
                />
              </div>
            </div>
          )}
          {warning && (
            <div className="rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
              {warning}
            </div>
          )}
          {status === "connected" && (
            <div className="rounded-2xl border border-outline/30 bg-surface-muted/60 px-4 py-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-secondary">
                <Signal className="h-4 w-4 text-primary" />
                Ultimo mensaje recibido
              </p>
              <code className="block max-h-24 overflow-y-auto rounded-xl bg-background-muted/60 p-3 text-xs text-text-primary">
                {lastMessage || "Esperando datos..."}
              </code>
            </div>
          )}
        </div>
        <DialogFooter>
          {status === "connected" ? (
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="w-full gap-2"
            >
              <X className="h-4 w-4" />
              Desconectar
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              className="w-full gap-2"
              disabled={status === "connecting"}
            >
              {status === "connecting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Buscar y conectar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
