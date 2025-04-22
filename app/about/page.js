"use client"

import { useState } from "react"
import { ChevronRight, Mail, Phone, MapPin, Clock, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"

export default function AboutPage() {
  const { theme } = useTheme()
  const [activeAccordion, setActiveAccordion] = useState(null)

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      bio: "Sarah founded TechMart in 2015 with a vision to make quality tech products accessible to everyone. With over 15 years of experience in the tech industry, she leads our company's strategic direction.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      bio: "Michael oversees all technical aspects of TechMart, from our website to our inventory systems. His background in software engineering ensures we stay at the cutting edge of e-commerce technology.",
    },
    {
      name: "David Rodriguez",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      bio: "David leads our product team, carefully selecting and curating our catalog of tech products. His keen eye for quality and innovation helps us bring only the best products to our customers.",
    },
    {
      name: "Emily Wong",
      role: "Customer Experience Director",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
      bio: "Emily ensures that every customer has an exceptional experience with TechMart. From website usability to customer service, she's dedicated to making your shopping experience seamless.",
    },
  ]

  const faqs = [
    {
      question: "What makes TechMart different from other electronics retailers?",
      answer:
        "At TechMart, we focus on curating high-quality tech products at competitive prices. We thoroughly test all products before adding them to our catalog, offer a 30-day satisfaction guarantee, and provide exceptional customer service with tech experts available to answer your questions.",
    },
    {
      question: "How do you select the products you sell?",
      answer:
        "Our product team follows a rigorous selection process. We evaluate products based on quality, innovation, value, and customer feedback. We also maintain direct relationships with manufacturers to ensure authenticity and the best possible prices.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy on most items. Products must be returned in their original packaging and in the same condition you received them. Some products, like earbuds and certain accessories, may have different return conditions for hygiene reasons.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. You can see the shipping options available to your country during checkout.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also view your order status and tracking information in your account dashboard under 'Orders'.",
    },
  ]

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Hero Section */}
      <div className={`py-16 ${theme === "dark" ? "bg-gray-800" : "bg-emerald-50"}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center text-sm mb-4">
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </Link>
                <ChevronRight size={16} className="mx-2" />
                <span className="text-gray-500">About Us</span>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About TechMart</h1>
                <p className="text-lg mb-6 opacity-80">
                  We're on a mission to make quality tech accessible to everyone.
                </p>
              </motion.div>
            </div>

            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-64 md:h-96 rounded-lg overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop"
                  alt="TechMart Team"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className={`h-1 w-20 mx-auto mb-6 ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"}`}></div>
            <p className="text-lg mb-6">
              Founded in 2015, TechMart began with a simple idea: make quality tech products accessible to everyone.
              What started as a small online store run out of a garage has grown into a trusted destination for tech
              enthusiasts around the world.
            </p>
            <p className="text-lg">
              Our founder, Sarah Johnson, noticed that many people were overwhelmed by the complexity and high prices of
              tech products. She believed that everyone deserves access to reliable technology that enhances their
              lives, without breaking the bank. This philosophy continues to guide everything we do at TechMart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className={`rounded-lg p-6 text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality First</h3>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                We rigorously test all products before adding them to our catalog, ensuring you only get the best.
              </p>
            </div>

            <div className={`rounded-lg p-6 text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Pricing</h3>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                We work directly with manufacturers to offer competitive prices without compromising on quality.
              </p>
            </div>

            <div className={`rounded-lg p-6 text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                Our team of tech enthusiasts is always ready to help you find the perfect product or solve any issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className={`py-16 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <div className={`h-1 w-20 mx-auto mb-6 ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"}`}></div>
            <p className="text-lg max-w-2xl mx-auto">
              Our diverse team of tech enthusiasts is passionate about bringing you the best products and shopping
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-white"} shadow-md`}
              >
                <div className="relative h-64">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className={`mb-4 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>{member.role}</p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className={`h-1 w-20 mx-auto mb-6 ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"}`}></div>
            <p className="text-lg max-w-2xl mx-auto">
              Have questions about TechMart? Find answers to our most commonly asked questions below.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`mb-4 rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex justify-between items-center w-full p-4 text-left font-medium"
                >
                  {faq.question}
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${activeAccordion === index ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className={`p-4 pt-0 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-16 ${theme === "dark" ? "bg-gray-800" : "bg-emerald-50"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <div className={`h-1 w-20 mx-auto mb-6 ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"}`}></div>
            <p className="text-lg max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Our team is always ready to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"} shadow-sm`}>
                  <Mail className={`h-8 w-8 mb-4 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
                  <h3 className="text-lg font-bold mb-2">Email Us</h3>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>support@techmart.com</p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>sales@techmart.com</p>
                </div>

                <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"} shadow-sm`}>
                  <Phone className={`h-8 w-8 mb-4 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
                  <h3 className="text-lg font-bold mb-2">Call Us</h3>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>+1 (555) 123-4567</p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Mon-Fri: 9am - 6pm EST</p>
                </div>

                <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"} shadow-sm`}>
                  <MapPin className={`h-8 w-8 mb-4 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
                  <h3 className="text-lg font-bold mb-2">Visit Us</h3>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>123 Tech Street</p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>San Francisco, CA 94107</p>
                </div>

                <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"} shadow-sm`}>
                  <Clock className={`h-8 w-8 mb-4 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
                  <h3 className="text-lg font-bold mb-2">Business Hours</h3>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Mon-Fri: 9am - 6pm</p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Sat: 10am - 4pm</p>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0968173775!2d-122.4026!3d37.7909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ3JzI3LjIiTiAxMjLCsDI0JzA5LjQiVw!5e0!3m2!1sen!2sus!4v1620841266018!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="TechMart Location"
                ></iframe>
              </div>
            </div>

            <div className={`rounded-lg p-6 ${theme === "dark" ? "bg-gray-700" : "bg-white"} shadow-sm`}>
              <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    rows="5"
                    className={`w-full px-3 py-2 rounded-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <div className={`h-1 w-20 mx-auto mb-6 ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"}`}></div>
            <p className="text-lg max-w-2xl mx-auto">
              These core principles guide everything we do at TechMart, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <h3 className="text-xl font-bold mb-4 text-emerald-600">Customer First</h3>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                We believe in putting our customers at the center of everything we do. Your satisfaction is our top
                priority, and we're committed to providing an exceptional shopping experience from start to finish.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <h3 className="text-xl font-bold mb-4 text-emerald-600">Integrity</h3>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                We operate with honesty and transparency in all our dealings. From product descriptions to pricing, we
                believe in being straightforward and earning your trust through our actions.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <h3 className="text-xl font-bold mb-4 text-emerald-600">Innovation</h3>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                We're constantly looking for ways to improve and innovate, both in the products we offer and the
                shopping experience we provide. We embrace change and strive to stay ahead of the curve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-16 ${theme === "dark" ? "bg-gray-800" : "bg-emerald-600"} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience TechMart?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Browse our curated selection of premium tech products at competitive prices.
          </p>
          <Link
            href="/products"
            className={`inline-block px-6 py-3 rounded-md font-medium ${
              theme === "dark" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white text-emerald-600 hover:bg-gray-100"
            } transition-colors`}
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
