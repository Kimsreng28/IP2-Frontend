"use client";

import AddressSection from "@/src/app/components/Client/Profiles/Address/AddressSection";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const defaultAddress = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  country: "",
  phone: "",
  id: null,
  is_default: false,
};

const AddressPage = () => {
  const [billingAddress, setBillingAddress] = useState(defaultAddress);
  const [shippingAddress, setShippingAddress] = useState(defaultAddress);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.API_BASE_URL}/api/account/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const resAddress = await fetch(
          `${process.env.API_BASE_URL}/api/profile/addresses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch profile");
        if (!resAddress.ok) throw new Error("Failed to fetch address");

        const data = await res.json();
        setUserData(data);

        const addressData = await resAddress.json();

        // Find billing and shipping addresses
        const billing = addressData.find((addr) => addr.type === "billing");
        const shipping = addressData.find((addr) => addr.type === "shipping");

        if (billing) {
          setBillingAddress({
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            street: `${billing.address_line1}${billing.address_line2 ? ", " + billing.address_line2 : ""}`,
            city: billing.city ?? "",
            country: billing.country ?? "",
            phone: billing.phone_number ?? "",
            id: billing.id,
            is_default: billing.is_default,
          });
        }

        if (shipping) {
          setShippingAddress({
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            street: `${shipping.address_line1}${shipping.address_line2 ? ", " + shipping.address_line2 : ""}`,
            city: shipping.city ?? "",
            country: shipping.country ?? "",
            phone: shipping.phone_number ?? "",
            id: shipping.id,
            is_default: shipping.is_default,
          });
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };

    fetchAddress();
  }, []);

  const handleSaveAddress = async (addressData, type) => {
    try {
      const token = localStorage.getItem("token");

      // Prepare the request body
      const body = {
        address_line1: addressData.street.split(",")[0].trim(),
        address_line2:
          addressData.street.split(",").length > 1
            ? addressData.street.split(",").slice(1).join(",").trim()
            : undefined,
        city: addressData.city,
        country: addressData.country,
        phone_number: addressData.phone,
        is_default: addressData.is_default,
        type: type, // Now we're explicitly setting the type
      };

      const url = addressData.id
        ? `${process.env.API_BASE_URL}/api/profile/addresses/${addressData.id}`
        : `${process.env.API_BASE_URL}/api/profile/addresses`;

      const method = addressData.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save address");

      const updatedAddress = await res.json();

      // Update the local state with the saved address
      const updatedData = {
        ...addressData,
        id: updatedAddress.id,
        is_default: updatedAddress.is_default,
      };

      if (type === "billing") {
        setBillingAddress(updatedData);
      } else {
        setShippingAddress(updatedData);
      }

      return true;
    } catch (error) {
      console.error("Error saving address:", error);
      return false;
    }
  };

  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Address
      </h2>
      <AddressSection
        address={billingAddress}
        type="billing"
        onSave={(data) => handleSaveAddress(data, "billing")}
      />
      <AddressSection
        address={shippingAddress}
        type="shipping"
        onSave={(data) => handleSaveAddress(data, "shipping")}
      />
    </motion.div>
  );
};

export default AddressPage;
