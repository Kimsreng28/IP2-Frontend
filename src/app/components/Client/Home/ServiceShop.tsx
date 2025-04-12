'use client';

import { mdiCashCheck, mdiLockCheckOutline, mdiPhoneOutline, mdiTruckFast } from '@mdi/js';
import { Icon } from '@mdi/react';

export type ServiceShop = {
    id: number;
    icon: string;
    title: string;
    description: string;
};

const mockDataServiceShops: ServiceShop[] = [
    {
        id: 1,
        icon: mdiTruckFast,
        title: 'Free Shipping',
        description: 'Order above $200',
    },
    {
        id: 2,
        icon: mdiCashCheck,
        title: 'Money-back',
        description: '30 days guarantee',
    },
    {
        id: 3,
        icon: mdiLockCheckOutline,
        title: 'Secure Payments',
        description: 'Secure Payments',
    },
    {
        id: 4,
        icon: mdiPhoneOutline,
        title: '24/7 Support',
        description: 'Phone and Email Support',
    },
];

export default function ServiceShop() {
    return (
        <div className="container mx-auto my-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 ">
                {mockDataServiceShops.map((service) => (
                    <div
                        key={service.id}
                        className="flex flex-col items-center text-center border p-5 rounded-xl bg-white dark:bg-gray-900 transition-shadow hover:shadow-lg"
                    >
                        <Icon path={service.icon} size={2} className="text-gray-500 dark:text-blue-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">{service.title}</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-400">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
