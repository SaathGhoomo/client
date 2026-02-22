import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import api from '../api/axios';

const PartnerReviews = ({ partnerId, partnerName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState(null);
  const [partnerStats, setPartnerStats] = useState(null);

  useEffect(() => {
    if (partnerId) {
      fetchReviews();
    }
  }, [partnerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/partner/${partnerId}`);
      
      if (response.data.success) {
        setReviews(response.data.reviews || []);
        setRatingDistribution(response.data.ratingDistribution || []);
        setPartnerStats(response.data.partnerStats || {});
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = 'small') => {
    const starSize = size === 'large' ? 24 : size === 'medium' ? 16 : 12;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingBarWidth = (count) => {
    const total = partnerStats?.totalReviews || 0;
    return total > 0 ? (count / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="gc" style={{ padding: 24, borderRadius: 16 }}>
        <div className="animate-pulse">
          <div style={{ height: 24, background: 'rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 16 }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}></div>
            <div style={{ height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 4, width: '75%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="gc" style={{ padding: 24, borderRadius: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle size={20} style={{ color: 'var(--blush)' }} />
          Reviews
        </h3>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
          {partnerStats?.totalReviews || 0} review{(partnerStats?.totalReviews || 0) !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Rating Summary */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
              {partnerStats?.averageRating?.toFixed(1) || '0.0'}
            </div>
            {renderStars(Math.round(partnerStats?.averageRating || 0), 'large')}
          </div>
          
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const ratingData = ratingDistribution?.find(r => r._id === rating);
              const count = ratingData?.count || 0;
              return (
                <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', width: 32 }}>{rating}★</span>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 8 }}>
                    <div
                      style={{
                        background: '#fbbf24',
                        height: 8,
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        width: `${getRatingBarWidth(count)}%`
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', width: 32, textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
            <MessageCircle size={48} style={{ margin: '0 auto' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>No reviews yet</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            Be the first to review {partnerName}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayedReviews.map((review) => (
            <div key={review._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 'medium', color: 'white' }}>
                    {review.user?.name || 'Anonymous'}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {renderStars(review.rating, 'small')}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                {review.comment}
              </p>
            </div>
          ))}

          {/* Show More/Less Button */}
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              style={{
                width: '100%',
                padding: 8,
                textAlign: 'center',
                color: 'var(--blush)',
                fontWeight: 'medium',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
            >
              {showAllReviews ? (
                <>
                  <ChevronUp size={16} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show {reviews.length - 3} More Review{reviews.length - 3 !== 1 ? 's' : ''}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PartnerReviews;
