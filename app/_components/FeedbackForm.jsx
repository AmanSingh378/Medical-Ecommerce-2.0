'use client';

import { toast } from 'sonner';
import { useRef } from 'react';

export default function FeedbackForm() {
  const formRef = useRef(null);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      rating: formData.get('rating'),
    };

    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Feedback submitted successfully! Thank you.");
        formRef.current.reset();
      } else {
        toast.error(result.error || "Failed to submit feedback.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-foreground mb-4">Feedback</h3>
      <form ref={formRef} onSubmit={handleFeedbackSubmit} className="space-y-3">
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
        <select
          name="rating"
          className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        >
          <option value="">Select Rating (1-5)</option>
          <option value="5">5 Stars - Excellent</option>
          <option value="4">4 Stars - Good</option>
          <option value="3">3 Stars - Average</option>
          <option value="2">2 Stars - Poor</option>
          <option value="1">1 Star - Bad</option>
        </select>
        <textarea
          name="message"
          placeholder="Your Feedback"
          rows={3}
          className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-300 text-secondary-foreground py-3 px-6 rounded-lg font-medium hover:bg-yellow-400 transition-all duration-200 border"
        >
          Submit Feedback
        </button>
      </form>
      <p className="text-sm text-muted-foreground mt-2">Help us improve our service.</p>
    </>
  );
}
