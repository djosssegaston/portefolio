"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Mail, Lock, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
        setLoading(false);
        return;
      }

      if (data.requiresTwoFactor) {
        setTempToken(data.tempToken);
        setStep("2fa");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));
      router.push("/admin");
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
      setLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Entrez le code 2FA");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, code: code.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Code invalide");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));
      router.push("/admin");
    } catch {
      setError("Erreur réseau");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center mb-8"
          >
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="currentColor" className="text-primary" />
                <text x="20" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="system-ui">ET</text>
              </svg>
              <span className="font-heading font-bold text-xl">
                <span className="gradient-text">ElisTech</span>
              </span>
            </Link>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              {step === "login" ? "Connexion Administrateur" : "Authentification 2FA"}
            </h1>
            <p className="text-sm text-secondary mt-1">
              {step === "login"
                ? "Connectez-vous pour accéder au tableau de bord"
                : "Entrez le code généré par votre application d'authentification"}
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          {step === "login" ? (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@djosse.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-muted border-0 text-foreground placeholder:text-secondary/50"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de Passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-muted border-0 text-foreground placeholder:text-secondary/50"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full h-11 rounded-xl font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              onSubmit={handle2FA}
              className="space-y-5"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </motion.div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700 text-center block">
                  Code d&apos;authentification
                </Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="000 000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-11 bg-muted border-0 text-foreground placeholder:text-secondary/50 text-center text-lg tracking-[0.5em] font-mono"
                  disabled={loading}
                  autoComplete="one-time-code"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full h-11 rounded-xl font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Vérifier
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => { setStep("login"); setCode(""); setError("") }}
                className="w-full text-sm text-secondary hover:text-primary transition-colors"
                disabled={loading}
              >
                ← Retour à la connexion
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
