"use client";

import env from "@/src/envs/env";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Call /wallet/create/{userId} to create a wallet
const connectWallet = async (userId: number) => {
  try {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      throw new Error("User not logged in");
    }

    // Parse user data
    let user;
    try {
      user = JSON.parse(userRaw);
    } catch {
      throw new Error("Invalid user data format");
    }

    if (!user?.id || typeof user.id !== "number") {
      throw new Error("Invalid or missing user ID");
    }

    const res = await fetch(`${env.WALLET_BASE_URL}/wallet/create/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional
      },
      body: JSON.stringify({
        initialBalance: 100,
        name: user.last_name,
        email: user.email,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create wallet");
    }

    return await res.json();
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  }
};


const WalletPage = () => {
  const [loading, setLoading] = useState(true);
  const [iframeSrc, setIframeSrc] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [showConnect, setShowConnect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const setupWalletIframe = async () => {
      try {

        // Validate WALLET_BASE_URL
        if (!env.WALLET_BASE_URL) {
          throw new Error("WALLET_BASE_URL is not defined in environment variables");
        }

        // Retrieve user from localStorage
        const userRaw = localStorage.getItem("user");
        if (!userRaw) {
          throw new Error("User not logged in");
        }

        // Parse user data
        let user;
        try {
          user = JSON.parse(userRaw);
        } catch {
          throw new Error("Invalid user data format");
        }

        if (!user?.id || typeof user.id !== "number") {
          throw new Error("Invalid or missing user ID");
        }

        setUserId(user.id);
        console.log("Fetching wallet check for user ID:", user.id);
        console.log("Wallet check URL:", `${env.WALLET_BASE_URL}/wallet/check/${user.id}`);

        console.log("Fetching wallet check for user ID:", user.id);
        console.log("Wallet check URL:", `${env.WALLET_BASE_URL}/wallet/check/${user.id}`);

        const response = await fetch(`${env.WALLET_BASE_URL}/wallet/check/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            console.log("Wallet not found for user ID:", user.id);
            setShowConnect(true); // Wallet not found, show connect wallet prompt
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to check wallet status (HTTP ${response.status})`);
          }
        } else {
          const data = await response.json();
          console.log("Wallet check response data:", data);
          // Wallet exists, set iframe source to wallet page
          setIframeSrc(`${env.WALLET_BASE_URL}/Wallet/Page/${user.id}`);
          setShowConnect(false);
        }
      } catch (error: any) {
        console.error("Wallet iframe setup error:", error);
        setError(
          error.message || "Failed to set up wallet. Please check your network or try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    setupWalletIframe();
  }, [router]);

  const handleConnectWallet = async () => {
    if (!userId) {
      setError("User ID not available. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      await connectWallet(userId);
      setIframeSrc(`${env.WALLET_BASE_URL}/Wallet/Page/${userId}`);
      setShowConnect(false);
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet. Please try again.");
      console.error("Connect wallet error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[500px]">
        <p className="text-gray-700">Loading Wallet...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center w-full min-h-[500px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render main content
  return (
    <div className="flex items-center justify-center w-full h-[900px]">
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          className="border-none"
          title="Wallet View"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : showConnect ? (
        <button
          onClick={handleConnectWallet}
          className="px-6 py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-gray-700 mb-4">Please login to view your wallet.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletPage;