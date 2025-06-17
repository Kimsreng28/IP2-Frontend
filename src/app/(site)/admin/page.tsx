"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "./lib/admin-api";

export default function AdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const checkAPI = async () => {
      try {
        setStatus("Calling API...");
        const response = await adminApi.test();
        console.log("API Response:", response);
        setStatus(`API Success: ${JSON.stringify(response)}`);
        
        // Only redirect after successful API call
        setTimeout(() => router.push("/admin/pages/dashboard"), 2000);
      } catch (error) {
        setStatus(`API Error: ${error.message}`);
        console.error("API Error Details:", error);
      }
    };

    checkAPI();
  }, [router]);

  return (
    <div className="p-4">
      <h1>API Connection Status</h1>
      <pre>{status}</pre>
    </div>
  );
}