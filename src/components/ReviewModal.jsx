import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/reviews', {
        bookingId: booking._id,
        rating,
        comment: comment.trim()
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarButton = ({ starValue }) => (
    <button
      type="button"
      className="p-1 transition-colors"
      onMouseEnter={() => setHoveredStar(starValue)}
      onMouseLeave={() => setHoveredStar(0)}
      onClick={() => setRating(starValue)}
    >
      <Star
        size={32}
        className={`${
          starValue <= (hoveredStar || rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        } transition-colors`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="gc" style={{ 
        maxWidth: '500px', 
        width: '100%', 
        padding: 32, 
        borderRadius: 20, 
        position: 'relative' 
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: 8,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
          }}
        >
          <X size={20} style={{ color: 'rgba(255,255,255,0.7)' }} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
            Leave a Review
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            {booking.partner?.name || 'Service Provider'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Rating */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 14, 
              fontWeight: 'medium', 
              color: 'white', 
              marginBottom: 12 
            }}>
              Rating *
            </label>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton key={star} starValue={star} />
              ))}
            </div>
            {rating > 0 && (
              <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
                {rating} star{rating !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" style={{ 
              display: 'block', 
              fontSize: 14, 
              fontWeight: 'medium', 
              color: 'white', 
              marginBottom: 8 
            }}>
              Comment *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              style={{
                width: '100%',
                padding: 12,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                color: 'white',
                fontSize: 14,
                resize: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              rows={4}
              maxLength={1000}
            />
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {comment.length}/1000 characters
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: 'var(--blush)',
              color: 'white',
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 'medium',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.background = '#e11d48';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.background = 'var(--blush)';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: 16,
                  height: 16,
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
