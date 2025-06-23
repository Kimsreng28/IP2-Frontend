"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import Image from 'next/image';
import env from "@/src/envs/env";

export interface Vendor {
  id: number;
  uuid: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  status: 'pending' | 'approved' | 'rejected'; 
  created_at: string;
  updated_at: string;
  user: VendorUser;
}

export interface VendorUser {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

export default function Settings() {

  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [settingInfo, SetSettingInfo] = useState<Vendor | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);


  // const env.API_BASE_URL = process.env.env.API_BASE_URL || 'http://localhost:3001';
  // const env.FILE_BASE_URL = process.env.env.FILE_BASE_URL;

  useEffect(() => {
    const fetchSettingInfo = async () => {
      try {
        const url = new URL(`${env.API_BASE_URL}/vendor/setting`);


        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); // Adjust based on your auth storage

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch OrdersHistories');
        }
        const data: Vendor = await response.json();
        // console.log('Fetched response:', response);
        SetSettingInfo(data);
        console.log('Fetched vendorInfo:', data);

        // console.log('Recent Orders:', recentOrders);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSettingInfo();

  }, [env.API_BASE_URL]);
  return (
    <>
      <div className={`rounded-lg px-6 py-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}>
        <div className='flex gap-2'>
          <IoSettingsOutline className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Setting</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              // handleCreateClick()
            }}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700  flex items-center gap-2"
          >
            Update
          </button>
          <button
            onClick={() => {
              // handleCreateClick()
            }}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700  flex items-center gap-2"
          >
            Change Password
          </button>
        </div>
      </div>
      <div className={`rounded-lg p-6  shadow-md flex flex-row gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <div className="flex flex-row gap-4">
          <div className="flex-shrink-0 flex justify-center items-center p-4 ">
            <Image
              className="h-50 w-50 rounded-full object-cover border-2 border-gray-500"
              src={`${settingInfo?.user.avatar}` || `${env.FILE_BASE_URL}${settingInfo?.user.avatar}`}
              alt={"user"}
              width={80}
              height={80}
              unoptimized={true}
            />
          </div>
          <div className=" pl-10">
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white">Last Name </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white">First Name </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white">Email </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white">Business Email </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white">Business Phone </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white">Business name </p>
          </div>
          <div className=" px-2">
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white"> : </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white"> : </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white"> : </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white"> : </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white"> : </p>
            <p className="text-base pb-5 text-right text-gray-600 dark:text-white"> : </p>
          </div>
          <div className="font-semibold">
            <p className="text-base pb-5 text-left text-gray-600 dark:text-white">{settingInfo?.user?.lastName || "Null"}</p>
            <p className="text-base pb-5 text-left text-gray-600 dark:text-white">{settingInfo?.user?.firstName || "Null"}</p>
            <p className="text-base pb-5 text-left text-gray-600 dark:text-white">{settingInfo?.user?.email || "Null"}</p>
            <p className="text-base pb-5 text-left text-gray-600 dark:text-white">{settingInfo?.business_email || "Null"}</p>
            <p className="text-base pb-5 text-left text-gray-600 dark:text-white">{settingInfo?.business_phone || "Null"}</p>
            <p className="text-base pb-5 text-left text-gray-600 dark:text-white">{settingInfo?.business_name || "Null"}</p>
          </div>
        </div>
      </div>
    </>
  );
}

