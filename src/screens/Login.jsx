import React, { useEffect, useMemo, useState } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/providers/AuthProvider";
import { createPageUrl } from "@/utils";

const initialState = { email: "", password: "" };

function getErrorMessage(error) {
  if (!error) {
    return "No se pudo iniciar sesión. Inténtalo de nuevo.";
  }

  const normalizedCode =
    typeof error.code === "string" ? error.code.toLowerCase() : "";

  switch (normalizedCode) {
    case "auth/invalid-email":
      return "El correo electrónico no tiene un formato válido.";
    case "auth/user-disabled":
      return "Esta cuenta está deshabilitada. Contacta al administrador.";
    case "auth/user-not-found":
      return "No encontramos una cuenta con ese correo.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Las credenciales no coinciden. Verifica e inténtalo nuevamente.";
    default:
      return error.message || "No se pudo iniciar sesión. Inténtalo de nuevo.";
  }
}

export default function Login() {
  const { login, user, loading: authLoading, authAvailable } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectPath = useMemo(
    () => location.state?.from?.pathname || createPageUrl("Dashboard"),
    [location.state]
  );

  useEffect(() => {
    if (!authAvailable && !authLoading) {
      navigate(redirectPath, { replace: true });
    }
  }, [authAvailable, authLoading, navigate, redirectPath]);

  useEffect(() => {
    if (user && !authLoading) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, navigate, redirectPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (authLoading || submitting) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      await login(formValues.email, formValues.password);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!authAvailable) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-bg-muted via-background to-surface px-4 py-12 text-center">
        <div className="glass-panel relative max-w-lg px-10 py-12">
          <div
            className="absolute inset-0 pointer-events-none rounded-[32px]"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              mixBlendMode: "overlay",
            }}
          />
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-soft-xl">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Autenticación no disponible
            </h1>
            <p className="text-sm font-medium text-text-muted">
              Configura tus credenciales de Firebase en el archivo <code>.env</code> para habilitar el acceso con
              cuenta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-bg-muted via-background to-surface px-4 py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-info/20 blur-[100px]" />
      </div>

      <Card className="relative z-10 w-full max-w-lg overflow-hidden border border-white/10 bg-white/90 px-0 py-0 backdrop-blur-xl dark:border-white/5 dark:bg-surface/90">
        <CardHeader className="gap-6 px-10 py-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-soft-xl">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Salud
              </p>
              <CardTitle className="text-2xl font-semibold text-text-primary">
                Bienvenido de nuevo
              </CardTitle>
            </div>
          </div>
          <p className="text-sm font-medium leading-relaxed text-text-muted">
            Ingresa tus credenciales para acceder al panel de control y seguir el estado de tus dispositivos.
          </p>
        </CardHeader>

        <CardContent className="px-10 pb-12 pt-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="usuario@salud.com"
                value={formValues.email}
                onChange={handleChange}
                disabled={authLoading || submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                value={formValues.password}
                onChange={handleChange}
                disabled={authLoading || submitting}
              />
            </div>

            {errorMessage ? (
              <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                !formValues.email ||
                !formValues.password ||
                submitting ||
                authLoading
              }
            >
              {submitting ? "Accediendo..." : "Ingresar"}
            </Button>
          </form>

          <div className="mt-8 rounded-2xl border border-outline/30 bg-surface-muted/60 px-6 py-5 text-center text-sm text-text-muted">
            Asegúrate de que tu dispositivo esté conectado para sincronizar métricas al iniciar sesión.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

