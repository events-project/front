"use client";

import { useOrganization } from "@clerk/nextjs";
import { useState } from "react";
import { Eye, EyeOff, Copy, KeyRound, XCircle, Shield } from "lucide-react";
import { revealApiKey } from "@/actions/revealApiKey";

interface Props {
  trigger: React.ReactNode;
}

const RevealKeyModal = ({ trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);


  const { organization } = useOrganization();

  const handleReveal = async () => {
    if (!organization?.id) return setError("No organization ID found");
  
    try {
      setLoading(true);
      const secretId = await getSecret(organization.id);
  
      const key = await revealApiKey({
        orgId: organization.id,
        secretId,
      });
  
      setApiKey(key);
      setVisible(true);
    } catch {
      setError("â Failed to reveal key");
    } finally {
      setLoading(false);
    }
  };
  

  const handleToggle = async () => {
    if (!apiKey) {
      await handleReveal(); // fetch on first reveal
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

  const masked = (text: string) => "â¢".repeat(text.length);

  const handleClose = () => {
    setIsOpen(false);
    setApiKey("");
    setVisible(false);
    setError("");
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-2xl overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-gradient" />

            <div className="relative bg-zinc-900/90 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 p-4 pb-4">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">API Key</h2>
              </div>

              {/* Content */}
              <div className="p-6 font-mono">
                <div className="flex items-center gap-3 mb-4">
                <button
                onClick={handleToggle}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200"
                title={visible ? "Hide API Key" : "Show API Key"}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                ) : visible ? (
                  <EyeOff className="w-4 h-4 text-zinc-400 hover:text-white" />
                ) : (
                  <Eye className="w-4 h-4 text-zinc-400 hover:text-white" />
                )}
              </button>
                  <button
                    onClick={handleCopy}
                    disabled={!apiKey}
                    className={p-2 hover:bg-white/5 rounded-lg transition-colors duration-200 ${
                      !apiKey && "opacity-50 cursor-not-allowed"
                    }}
                    title="Copy to Clipboard"
                  >
                    <Copy
                      className={w-4 h-4 ${
                        copied
                          ? "text-green-400"
                          : "text-zinc-400 hover:text-white"
                      }}
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

                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-4 flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};