import React, { useState } from 'react';

// Reusable Star Rating 
const StarRating = ({ label }: { label: string }) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex justify-between items-center mb-3">
      <span className="text-white text-sm">{label}</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            onClick={() => setRating(star)}
            className={`cursor-pointer text-xl ${star <= rating ? 'text-talent-gold' : 'text-gray-500'}`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default function EvaluationForm() {
  return (
    <div className="bg-talent-dark p-6 rounded-xl w-full max-w-sm shadow-lg border border-gray-800">
      <h3 className="text-talent-cyan font-serif text-lg mb-4 flex justify-between items-center">
        Evaluation Scoring
        <span className="text-xs bg-talent-panel px-2 py-1 rounded text-white font-sans">1 review</span>
      </h3>
      
      {/* Ratings */}
      <div className="mb-6">
        <StarRating label="Technical" />
        <StarRating label="Team Fit" />
        <StarRating label="Communication" />
      </div>
      
      {/* Comments */}
      <div className="mb-4">
        <h4 className="text-white text-sm mb-2">Comments</h4>
        <textarea 
          placeholder="Input evaluation comments..." 
          className="w-full bg-talent-panel text-white placeholder-gray-300 border-none rounded-md p-3 resize-none focus:ring-1 focus:ring-talent-cyan outline-none text-sm"
          rows={3}
        />
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end">
        <button className="bg-talent-cyan-dark hover:bg-talent-cyan text-talent-dark font-bold py-2 px-6 rounded-md transition-colors text-sm">
          Send
        </button>
      </div>
    </div>
  );
}