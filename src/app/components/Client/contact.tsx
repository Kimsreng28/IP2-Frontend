"use client"

import { ArrowRight, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import SharedFooterComponent from "../shared/footer";
import { Resend } from 'resend';

// Mock data for service shops with proper typing
const resend = new Resend('re_PPTQo3N3_5pccgqwpWSqqrAwEC5kSEv5f');
interface ServiceShop {
    id: number;
    icon: any;
    title: string;
    description: string;
}

const mockDataServiceShops: ServiceShop[] = [
    {
        id: 1,
        icon: MapPin,
        title: 'ADDRESS',
        description: 'TC Soccer Field',
    },
    {
        id: 2,
        icon: Phone,
        title: 'Contact Us',
        description: '+885 89566929',
    },
    {
        id: 3,
        icon: Mail,
        title: 'Email',
        description: 'chansuvannet999@gmail.com',
    },
];

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const [isSending, setIsSending] = useState(false)
    const [sendStatus, setSendStatus] = useState<{ success?: boolean; message?: string }>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSending(true)
        setSendStatus({})

        try {
        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to send message")
        }

        setSendStatus({ success: true, message: "Message sent successfully!" })
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        } catch (error) {
        console.error("Error sending email:", error)
        setSendStatus({
            success: false,
            message: error instanceof Error ? error.message : "Failed to send message",
        })
        } finally {
        setIsSending(false)
        }
    }

    const handleHomeClick = () => {
        // Mock router push functionality
        console.log("Navigate to home")
    }

    return (
        <div className="w-full transition-colors duration-300 bg-white dark:bg-gray-900">
            {/* Breadcrumb */}
            <div className="flex items-start justify-start w-full p-5 py-8 mx-auto mt-20 max-w-7xl">
                <div className="flex items-start mb-8 space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span
                        className="text-black transition-colors cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={handleHomeClick}
                    >
                        Home
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="transition-colors cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">Contact Us</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="flex w-full px-5 mx-auto max-w-7xl">
                <div className="flex flex-col items-center w-full">
                    <div className="flex flex-col items-start justify-start">
                        <h1 className="flex mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl w-full lg:w-[50%] transition-colors">
                            We believe in Product electronics. We provide the best quality of products to customers.
                        </h1>
                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 w-full lg:w-[50%] transition-colors">
                            Our electronics are designed to elevate your lifestyle with cutting-edge technology and unmatched quality. Every product is crafted to deliver exceptional performance and long-lasting reliability.
                        </p>
                    </div>
                    <div className="w-full mt-5">
                        <div className="flex flex-col h-auto gap-4 overflow-hidden transition-colors bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 lg:flex-row dark:border-gray-700">
                            <div className="w-full lg:w-1/2">
                                <img
                                    src="/images/product/contact.png"
                                    alt="Contact Us"
                                    className="object-cover w-full h-64 transition-transform duration-300 lg:h-full hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%23d1d5db' font-family='Arial' font-size='16'%3EContact Image%3C/text%3E%3C/svg%3E";
                                    }}
                                />
                            </div>
                            <div className="w-full p-6 transition-colors lg:w-1/2 bg-gray-50 dark:bg-gray-700">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900 transition-colors dark:text-white">About Us</h2>
                                <p className="mb-6 text-gray-600 transition-colors dark:text-gray-300">
                                    At Ele.Sale core, we believe in the power of innovation and quality to transform lives. Specializing in cutting-edge electronic products, we are driven by a mission to provide our customers with the very best in technology and functionality.
                                    Our customer service is always prepared to support you 24/7.
                                </p>
                                <div className="flex items-center gap-2 text-black transition-colors cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-400 group">
                                    <span className="underline underline-offset-2">Shop Now</span>
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16"></div>

            {/* Contact Information */}
            <div className="px-5 mx-auto mb-16 max-w-7xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 transition-colors dark:text-white">Contact Us</h1>
                    <p className="text-lg text-gray-600 transition-colors dark:text-gray-300">Get in touch with us through any of the following ways</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mockDataServiceShops.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <div
                                key={service.id}
                                className="flex flex-col items-center p-8 text-center transition-all duration-300 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 group hover:bg-gray-50 dark:hover:bg-gray-750"
                            >
                                <div className="p-4 mb-4 transition-colors rounded-full bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50">
                                    <IconComponent size={32} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800 transition-colors dark:text-gray-200">{service.title}</h3>
                                <p className="leading-relaxed text-gray-600 transition-colors dark:text-gray-400">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

      {/* Contact Form */}
      <div className="max-w-4xl px-5 mx-auto mb-16">
        <div className="p-8 transition-colors bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 transition-colors dark:text-white">
            Send us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-700 transition-colors dark:text-gray-300"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 transition-colors dark:text-gray-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-700 transition-colors dark:text-gray-300"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium text-gray-700 transition-colors dark:text-gray-300"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter subject"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-700 transition-colors dark:text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="Enter your message"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSending}
                className={`px-8 py-3 font-semibold text-white transition-colors duration-200 rounded-lg shadow-lg ${
                  isSending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-600 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600"
                } focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:shadow-xl`}
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
              {sendStatus.message && (
                <p
                  className={`mt-4 text-sm ${
                    sendStatus.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {sendStatus.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
      <SharedFooterComponent />
    </div>
  )
}
