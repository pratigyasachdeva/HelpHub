
import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  rating = 0,
  size = 16,
  interactive = false,
  onChange
}) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className="inline-flex items-center gap-1"
      role={interactive ? 'group' : 'img'}
      aria-label={`${roundedRating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= roundedRating;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            aria-label={`Rate ${star} out of 5 stars`}
            aria-pressed={interactive ? star === roundedRating : undefined}
            onClick={() => interactive && onChange?.(star)}
            className={`
              flex items-center justify-center
              rounded-md
              transition-all duration-200
              ${interactive
                ? 'cursor-pointer hover:scale-125 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2'
                : 'cursor-default'
              }
            `}
          >
            <Star
              size={size}
              strokeWidth={1.8}
              className={`
                transition-colors duration-200
                ${filled
                  ? 'fill-amber-400 text-amber-500 drop-shadow-[0_1px_2px_rgba(245,158,11,0.2)]'
                  : 'fill-transparent text-slate-300'
                }
                ${interactive && !filled
                  ? 'hover:text-amber-400 hover:fill-amber-100'
                  : ''
                }
              `}
            />
          </button>
        );
      })}
    </div>
  );
}
