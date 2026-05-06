"use client";

import { useState } from "react";

export default function ReviewForm({ 
  productId,
  onSubmit
}: { 
  productId: string;
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("productId", productId);

    try {
      const res = await onSubmit(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-success-container text-on-success-container p-4 rounded-xl border border-success-fixed-dim text-sm flex items-center gap-3">
        <span className="material-symbols-outlined">check_circle</span>
        Thank you for your review!
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low border border-surface-variant rounded-xl p-6">
      <h3 className="font-bold text-lg mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <label key={s} className="cursor-pointer group">
                <input type="radio" name="rating" value={s} className="hidden peer" required />
                <span className="material-symbols-outlined text-[24px] text-tertiary-container group-hover:scale-110 transition-transform peer-checked:fill-tertiary-container" 
                      style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Your Comment</label>
          <textarea 
            name="comment" 
            required 
            rows={4}
            placeholder="What did you think of this product?"
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        {error && <p className="text-error text-xs">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
}
