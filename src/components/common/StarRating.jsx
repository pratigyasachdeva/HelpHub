import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 16, interactive = false, onChange }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            <Star
              size={size}
              className={filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
            />
          </button>
        );
      })}
    </div>
  );
}
