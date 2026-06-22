"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Key, Smartphone, CheckCircle, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [secret, setSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "generated" | "enabled">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) return router.replace("/admin/login");
    setToken(t);
    checkStatus(t);
  }, []);

  async function checkStatus(t: string) {
    try {
      const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.admin?.two_factor_enabled) {
        setTwoFactorEnabled(true);
        setStep("enabled");
      }
    } catch {}
  }

  async function handleGenerate() {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSecret(data.secret);
      setOtpauthUrl(data.otpauthUrl);
      setStep("generated");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnable() {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable", code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTwoFactorEnabled(true);
      setStep("enabled");
      setSuccess("2FA activé avec succès !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable() {
    if (!token || !code.trim()) {
      setError("Entrez votre code 2FA pour désactiver");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTwoFactorEnabled(false);
      setStep("idle");
      setSecret("");
      setOtpauthUrl("");
      setCode("");
      setSuccess("2FA désactivé");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copié !");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Sécurité</h1>
          <p className="text-sm text-gray-500">Authentification à deux facteurs (2FA)</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 font-medium text-center">
          {success}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-gray-900">Authentification à deux facteurs</h2>
              <p className="text-sm text-gray-500">Protégez votre compte avec une application d&apos;authentification</p>
            </div>
          </div>
          {twoFactorEnabled && (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Activé
            </span>
          )}
        </div>

        {step === "idle" && !twoFactorEnabled && (
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
            Configurer le 2FA
          </Button>
        )}

        {step === "generated" && (
          <div className="space-y-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-700">1. Scannez ce QR code avec Google Authenticator ou Authy :</p>
            {otpauthUrl && (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`}
                  alt="QR Code 2FA"
                  className="rounded-lg"
                  width={200}
                  height={200}
                />
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Ou saisissez cette clé manuellement :</p>
              <button
                onClick={() => copyToClipboard(secret)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 font-mono text-sm hover:bg-gray-50 transition-colors"
              >
                {secret} <Copy className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-700">2. Entrez le code à 6 chiffres pour confirmer :</p>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000 000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full h-11 rounded-xl bg-white border border-gray-200 text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            <Button onClick={handleEnable} disabled={loading || code.length < 6} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
              Activer le 2FA
            </Button>
          </div>
        )}

        {step === "enabled" && twoFactorEnabled && (
          <div className="space-y-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600">
              Le 2FA est actif. Pour le désactiver, entrez un code de votre application :
            </p>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000 000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full h-11 rounded-xl bg-white border border-gray-200 text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={handleDisable} disabled={loading || code.length < 6} variant="destructive" className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Désactiver le 2FA
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
