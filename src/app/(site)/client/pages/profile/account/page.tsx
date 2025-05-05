"use client";

import AccountForm from "@/src/app/components/Client/Profiles/Account/AccountForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AccountPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await fetch(
          "http://localhost:3001/api/account/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          displayName: data.display_name || "",
          email: data.email || "",
          oldPassword: "",
          newPassword: "",
          repeatPassword: "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      // Validate passwords match if changing password
      if (
        formData.newPassword &&
        formData.newPassword !== formData.repeatPassword
      ) {
        throw new Error("New passwords don't match");
      }

      const response = await fetch(
        "http://localhost:3001/api/account/auth/profile/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            displayName: formData.displayName,
            email: formData.email,
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setFormData({
        ...data.user,
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
          {success}
        </div>
      )}
      <AccountForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AccountPage;
