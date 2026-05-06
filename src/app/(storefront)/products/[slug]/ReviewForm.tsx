"use client";

import { useState } from "react";
import { submitReview } from "./actions";

export default function ReviewForm({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const result = await submitReview(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="bg-primary-container/20 border border-primary text-primary p-4 rounded-xl text-center">
        <span className="material-symbols-outlined text-[32px] mb-2">check_circle</span>
        <p className="font-bold">Thank you for your review!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
      <h3 className="font-bold mb-4">Leave a review</h3>
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="productId" value={productId} />
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select 
            name="rating" 
            className="w-full bg-surface border border-outline-variant rounded p-2 outline-none focus:border-primary"
            required
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea 
            name="comment" 
            rows={4} 
            className="w-full bg-surface border border-outline-variant rounded p-2 outline-none focus:border-primary" 
            placeholder="Share your experience..."
            required
          ></textarea>
        </div>
        {error && <p className="text-error text-xs font-medium">{error}</p>}
        <button 
          disabled={loading}
          className="w-full bg-on-surface text-surface font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
