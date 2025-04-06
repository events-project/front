"use client";

import { useState } from "react";

export default function RevealKeyClient() {
  const [accountId, setAccountId] = useState("");
  const [secretId, setSecretId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setApiKey("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/reveal-api-key`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId, secretId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setApiKey(data.apiKey);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-100 text-zinc-800 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-zinc-200">
        <h1 className="text-2xl font-bold text-center mb-6">
          🔐 Reveal API Key
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Secret ID"
            value={secretId}
            onChange={(e) => setSecretId(e.target.value)}
            className="w-full p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          >
            Reveal API Key
          </button>
        </form>

        {apiKey && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md font-mono break-all">
            ✅ API Key: {apiKey}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-md">
            ❌ {error}
          </div>
        )}
      </div>
    </main>
  );
}
