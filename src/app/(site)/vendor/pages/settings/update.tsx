"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import Image from 'next/image';

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

interface UpdateSettingProps {
    settingInfo: Vendor;
    onClose: () => void;
}

const UpdateSetting: React.FC<UpdateSettingProps> = ({
    settingInfo,
    onClose
}) => {
    const { theme } = useTheme();

    const FILE_BASE_URL = process.env.FILE_BASE_URL;
    const [error, setError] = useState<string | null>(null);
    return (
        <div>
            <div className="flex-shrink-0 flex justify-center items-center p-4 ">
                <Image
                    className="h-50 w-50 rounded-full object-cover border-2 border-gray-500"
                    src={`${settingInfo?.user.avatar}` || `${FILE_BASE_URL}${settingInfo?.user.avatar}`}
                    alt={"user"}
                    width={80}
                    height={80}
                    unoptimized={true}
                />
            </div>
            <div className=" pl-10">
                <p className="text-base pb-5 text-right text-gray-600">Last Name </p>
                <p className="text-base pb-5 text-right text-gray-600">First Name </p>
                <p className="text-base pb-5 text-right text-gray-600">Email </p>
                <p className="text-base pb-5 text-right text-gray-600">Business Email </p>
                <p className="text-base pb-5 text-right text-gray-600">Business Phone </p>
                <p className="text-base pb-5 text-right text-gray-600">Business name </p>
            </div>
            <div className=" px-2">
                <p className="text-base pb-5 text-right text-gray-600"> : </p>
                <p className="text-base pb-5 text-right text-gray-600"> : </p>
                <p className="text-base pb-5 text-right text-gray-600"> : </p>
                <p className="text-base pb-5 text-right text-gray-600"> : </p>
                <p className="text-base pb-5 text-right text-gray-600"> : </p>
                <p className="text-base pb-5 text-right text-gray-600"> : </p>
            </div>
            <div className="font-semibold">
                <p className="text-base pb-5 text-left text-gray-600">{settingInfo?.user?.lastName || "Null"}</p>
                <p className="text-base pb-5 text-left text-gray-600">{settingInfo?.user?.firstName || "Null"}</p>
                <p className="text-base pb-5 text-left text-gray-600">{settingInfo?.user?.email || "Null"}</p>
                <p className="text-base pb-5 text-left text-gray-600">{settingInfo?.business_email || "Null"}</p>
                <p className="text-base pb-5 text-left text-gray-600">{settingInfo?.business_phone || "Null"}</p>
                <p className="text-base pb-5 text-left text-gray-600">{settingInfo?.business_name || "Null"}</p>
            </div>
        </div>
    );
}

export default UpdateSetting;