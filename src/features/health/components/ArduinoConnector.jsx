import React, { useState, useEffect, useRef } from "react";
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
  const [status, setStatus] = useState("disconnected");
  const [port, setPort] = useState(null);
  const [lastMessage, setLastMessage] = useState("");
  const readerRef = useRef(null);
  const portRef = useRef(null);

  const handleConnect = async () => {
    if (!("serial" in navigator)) {
      alert(
        "Tu navegador no soporta la Web Serial API. Por favor, usa Chrome o Edge."
      );
      return;
    }
    try {
      setStatus("connecting");
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
            if (value) {
              try {
                const data = JSON.parse(value);
                onDataReceived(data);
                setLastMessage(value);
              } catch (error) {
                console.warn("Dato no JSON recibido:", value);
              }
            }
          }
        } catch (error) {
          console.error("Error leyendo del puerto:", error);
          handleDisconnect();
          break;
        }
      }
    };

    if (port && status === "connected") {
      readLoop();
    }

    return () => {
      handleDisconnect();
    };
  }, [port, status, onDataReceived]);

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
            Conecta tu Arduino para sincronizar datos de ritmo cardiaco y pasos
            en tiempo real.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between rounded-2xl border border-outline/40 bg-surface-muted/40 px-4 py-3">
            <span className="text-sm font-semibold text-text-secondary">
              Estado
            </span>
            {renderBadge()}
          </div>
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
