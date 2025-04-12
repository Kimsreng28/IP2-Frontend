'use client';
import { mdiArrowRight } from '@mdi/js';
import Icon from '@mdi/react';
export default function ShopCollection() {

    return (
        <>
            <div className="container mx-auto my-6">
                <div className="flex items-center justify-between mb-4 px-5">
                    <h2 className="text-2xl text-black dark:text-gray-300 font-semibold">Shop Collection</h2>
                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                        View All
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 items-start">
                    {/* Left Collection (Big) */}
                    <div className="w-full">
                        <div className="border rounded-lg bg-gray-100 dark:bg-transparent overflow-hidden h-auto md:h-[700px] group transition-shadow hover:shadow-lg">
                            <div className='flex justify-center'>
                                <img
                                    src="/images/product/image.png"
                                    alt="Main Shop Collection"
                                    className="w-[500px] h-[550px] mt-5 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="text-start px-10 pb-5">
                                <h3 className="text-2xl font-semibold mb-1 text-black dark:text-white">Headband</h3>
                                <a
                                    href="#"
                                    className="text-sm text-gray-800 dark:text-gray-400 dark:gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                >
                                    <div className="flex items-center gap-2 underline underline-offset-2">
                                        <span>Collection</span>
                                        <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </a>

                            </div>
                        </div>
                    </div>

                    {/* Right Collections (Stacked Small) */}
                    <div className="w-full flex flex-col gap-5">
                        <div
                            className="border rounded-lg bg-gray-100 dark:bg-transparent overflow-hidden group transition-shadow hover:shadow-lg h-auto md:h-[339px] flex flex-col md:flex-row justify-between items-center"
                        >
                            <div className='flex justify-end items-end'>
                                <div className="text-start px-10 pb-5">
                                    <h3 className="text-2xl font-semibold mb-1 text-black dark:text-white">Earbuds</h3>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-800 dark:text-gray-400 dark:gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                    >
                                        <div className="flex items-center gap-2 underline underline-offset-2">
                                            <span>Collection</span>
                                            <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>

                                </div>
                                <div className='flex justify-end'>
                                    <img
                                        src="/images/product/image5.png"
                                        alt="Main Shop Collection"
                                        className="w-[300px] h-[300px] mt-5 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            </div>

                        </div>
                        <div
                            className="border rounded-lg  bg-gray-100 dark:bg-transparent overflow-hidden group transition-shadow hover:shadow-lg h-auto md:h-[339px] flex flex-col md:flex-row justify-between items-center"
                        >
                            <div className='flex justify-end items-end'>
                                <div className="text-start px-10 pb-5">
                                    <h3 className="text-2xl font-semibold mb-1 text-black dark:text-white">Accessories</h3>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-800 dark:text-gray-400 dark:gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                    >
                                        <div className="flex items-center gap-2 underline underline-offset-2">
                                            <span>Collection</span>
                                            <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>

                                </div>
                                <div className='flex justify-center'>
                                    <img
                                        src="/images/product/image3.png"
                                        alt="Main Shop Collection"
                                        className="w-[300px] h-[300px] mt-5 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}