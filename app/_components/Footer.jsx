'use client';

import { toast } from 'sonner';
import { useRef } from 'react';
import FeedbackForm from './FeedbackForm';

export default function Footer() {
  const formRef = useRef(null);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Query submitted successfully! We'll get back to you soon.");
        formRef.current.reset();
      } else {
        toast.error(result.error || "Failed to submit query.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const handleFeedback = () => {
    toast.info("Feedback form coming soon!");
  };

  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-border mt-20 py-12 px-10 md:px-20 lg:px-36">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Contact Us</h3>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> <a href="mailto:as2172025@gmail.com" className="text-primary hover:underline font-medium transition-colors">as2172025@gmail.com</a></p>
              <p>
                <strong>Phone:</strong> <a href="tel:+917348547153" className="text-primary hover:underline font-medium transition-colors mr-2">+91-7348547153</a>
                <a href="https://wa.me/917348547153" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline font-medium ml-2">
                  💬 WhatsApp
                </a>
              </p>
              <p><strong>Address:</strong> 123 Rudrapur, Deoria, Uttar Pradesh, India 274208</p>
            </div>
          </div>

          {/* Any Query */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Any Query?</h3>
            <form ref={formRef} onSubmit={handleQuerySubmit} className="space-y-3">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-300 text-black py-3 px-6 rounded-lg font-medium hover:bg-yellow-400 transition-all duration-200"
              >
                Send Query
              </button>
            </form>
          </div>

          {/* Feedback */}
          <div>
            <FeedbackForm />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Medi Experi. All rights reserved. | Made with ❤️ for healthcare.</p>
        </div>
      </div>
    </footer>
  );
}
