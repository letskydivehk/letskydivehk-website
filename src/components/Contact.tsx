"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, MessageSquare, Clock, Instagram, Phone } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: "aff" | "group" | "general";
  message: string;
}

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call - will be replaced with Firebase
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "general",
      message: "",
    });
    setIsComplete(false);
  };

  const handleInstagramClick = () => {
    window.open("https://instagram.com/lets_skydive_hk", "_blank", "noopener,noreferrer");
  };

  const handleFacebookClick = () => {
    window.open("https://www.facebook.com/lets.skydive.hk/", "_blank", "noopener,noreferrer");
  };

  const handleYouTubeClick = () => {
    window.open("https://www.youtube.com/@letsskydivehk", "_blank", "noopener,noreferrer");
  };

  const subjects = [
    { value: "aff", label: "AFF Course Inquiry" },
    { value: "group", label: "Group Events" },
    { value: "general", label: "General Question" },
  ];

  return (
    <section id="contact" className="relative py-24 bg-card/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">Get in Touch</span>
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">Contact Us</h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Have questions about AFF courses, group events, or anything else? We're here to help!
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-emerald/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-accent-emerald" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                      <p className="text-muted-foreground text-sm mb-2">For bookings and inquiries</p>
                      <a
                        href="mailto:info@letsskydivehk.com"
                        className="text-accent-emerald hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        info@letsskydivehk.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Message our Instagram</h3>
                      <p className="text-muted-foreground text-sm mb-2">Response time in 24 hours</p>
                      <button
                        onClick={handleInstagramClick}
                        className="text-accent-blue hover:underline inline-flex items-center gap-1 cursor-pointer text-left"
                      >
                        <Instagram className="w-4 h-4" />
                        @lets_skydive_hk
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground text-sm mb-2">Quick responses</p>
                      <a
                        href="https://wa.me/85212345678"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-purple hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        +852 1234 5678
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-accent-emerald/5 rounded-2xl p-6 clean-border mobile-transparent-card">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-accent-emerald" />
                  <h3 className="font-semibold text-foreground">Response Time</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please call or WhatsApp us
                  directly.
                </p>
              </div>

              {/* Social Media Links */}
              <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card">
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleInstagramClick}
                    className="w-10 h-10 bg-accent-blue/10 rounded-full flex items-center justify-center hover:bg-accent-blue/20 transition-colors cursor-pointer"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-accent-blue" />
                  </button>
                  <button
                    onClick={handleFacebookClick}
                    className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleYouTubeClick}
                    className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors cursor-pointer"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-3xl p-8 clean-border elevated-shadow mobile-transparent-card">
                {isComplete ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-accent-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={handleReset}
                      className="text-accent-emerald font-semibold hover:underline cursor-pointer inline-flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                        placeholder="+852 1234 5678"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {subjects.map((subject) => (
                          <button
                            key={subject.value}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, subject: subject.value as ContactFormData["subject"] })
                            }
                            className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                              formData.subject === subject.value
                                ? "border-accent-emerald bg-accent-emerald/5 text-accent-emerald"
                                : "border-border text-muted-foreground hover:border-accent-emerald/50 hover:text-foreground"
                            }`}
                          >
                            {subject.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all resize-none"
                        placeholder="Tell us about your inquiry..."
                      />
                      <p className="text-xs text-muted-foreground mt-2">* Required fields</p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-accent-emerald text-white font-semibold rounded-xl hover:bg-accent-emerald/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
