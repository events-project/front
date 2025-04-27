"use client";

import {useAuth} from "@clerk/nextjs";
import { useState } from "react";
import { Eye, EyeOff, Copy, KeyRound, Shield, XCircle } from "lucide-react";
import { revealApiKey, getSecretId } from "@/actions";

export const RevealKeyPanel = () => {
  const [apiKey, setApiKey] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { orgId } = useAuth();

  const handleReveal = async () => {
    if (!orgId) return setError("No organization ID found");

    try {
      setLoading(true);
      const result = await getSecretId({ appId: orgId });
      const key = await revealApiKey({
        accountId: orgId,
        secretId: result.secretId,
      });

      setApiKey(key);
      setVisible(true);
      setError("");
    } catch {
      setError("Failed to reveal API key");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!apiKey) {
      await handleReveal();
    } else {
      setVisible((v) => !v);
    }
  };

  const handleCopy = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const masked = (text: string) => "•".repeat(text.length);

  return (
      <div className="w-full max-w-2xl mx-auto bg-zinc-900/90 rounded-2xl border border-white/10 shadow-2xl p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <KeyRound className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">API Key</h2>
        </div>

        {/* Key Actions */}
        <div className="flex items-center gap-4 mb-6">
          <button
              onClick={handleToggle}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200"
              title={visible ? "Hide API Key" : "Show API Key"}
              disabled={loading}
          >
            {loading ? (
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            ) : visible ? (
                <EyeOff className="w-5 h-5 text-zinc-400 hover:text-white" />
            ) : (
                <Eye className="w-5 h-5 text-zinc-400 hover:text-white" />
            )}
          </button>

          <button
              onClick={handleCopy}
              disabled={!apiKey}
              className={`p-2 hover:bg-white/5 rounded-lg transition-colors duration-200 ${
                  !apiKey ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Copy to Clipboard"
          >
            <Copy
                className={`w-5 h-5 ${
                    copied ? "text-green-400" : "text-zinc-400 hover:text-white"
                }`}
            />
          </button>

          {copied && (
              <span className="text-xs text-green-400 animate-fade-in">
            Copied!
          </span>
          )}
        </div>

        {/* API Key Display */}
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm border border-white/5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-zinc-400">API_KEY=</span>
            <span className="text-white">
            {apiKey
                ? visible
                    ? apiKey
                    : masked(apiKey)
                : masked("sk_test_XXXXXXXXXXXXXXXXXXXX")}
          </span>
          </div>
        </div>

        {/* Error */}
        {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              {error}
            </div>
        )}
      </div>
  );
};
