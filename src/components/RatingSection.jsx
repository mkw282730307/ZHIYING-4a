// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Star } from 'lucide-react';

export function RatingSection({
  currentRating,
  onRate
}) {
  return <div>
      <h3 className="font-medium mb-3">评分</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-6 h-6 cursor-pointer transition-colors ${star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} onClick={() => onRate(star)} />)}
      </div>
    </div>;
}