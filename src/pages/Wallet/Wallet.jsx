import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function Wallet() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifsc: '',
    accountHolder: ''
  });
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    // Check if user can view wallet (only users can view their wallet)
    console.log('Wallet useEffect - user:', user);
    if (user?.role !== 'user') {
      console.log('Redirecting non-user from wallet');
      navigate('/dashboard');
      return;
    }

    console.log('Wallet useEffect - fetching wallet...');
    fetchWallet();
    fetchReferralCode();
  }, [user, navigate]);

  const fetchWallet = async () => {
    console.log('fetchWallet called');
    try {
      const response = await api.get('/wallet');
      console.log('fetchWallet response:', response);
      const data = response.data;
      console.log('fetchWallet data:', data);
      
      if (data.success) {
        console.log('fetchWallet success, setting wallet:', data.wallet);
        setWallet(data.wallet);
      } else {
        // Set default wallet if API fails
        console.log('fetchWallet failed, setting default wallet');
        setWallet({ balance: 0, transactions: [] });
        console.log('Wallet API not available, showing default');
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      // Set default wallet if API fails
      setWallet({ balance: 0, transactions: [] });
      console.log('Wallet API not available, showing default');
    } finally {
      console.log('fetchWallet setting loading to false');
      setLoading(false);
    }
  };

  const fetchReferralCode = async () => {
    try {
      const response = await api.get('/referral/code');
      const data = response.data;
      
      if (data.success) {
        setReferralCode(data.referralCode);
      }
      // Don't show error for referral code - it's optional
    } catch (error) {
      console.error('Error fetching referral code:', error);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied!');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!bankDetails.accountNumber || !bankDetails.ifsc || !bankDetails.accountHolder) {
      toast.error('Please fill all bank details');
      return;
    }

    setActionLoading(prev => ({ ...prev, withdraw: true }));

    try {
      const response = await api.post('/wallet/withdraw', {
        amount: withdrawAmount,
        bankDetails
      });

      const data = response.data;

      if (data.success) {
        toast.success('Withdrawal request submitted successfully!');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setBankDetails({ accountNumber: '', ifsc: '', accountHolder: '' });
        fetchWallet(); // Refresh wallet
      } else {
        toast.error(data.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Backend not available. Withdrawal feature coming soon!');
      setShowWithdrawModal(false);
    } finally {
      setActionLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (transferAmount > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!transferEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setActionLoading(prev => ({ ...prev, transfer: true }));

    try {
      const response = await api.post('/wallet/transfer', {
        amount: transferAmount,
        recipientEmail: transferEmail,
        message: transferMessage
      });

      const data = response.data;

      if (data.success) {
        toast.success('Money transferred successfully!');
        setShowTransferModal(false);
        setTransferAmount('');
        setTransferEmail('');
        setTransferMessage('');
        fetchWallet(); // Refresh wallet
      } else {
        toast.error(data.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Error transferring:', error);
      toast.error('Backend not available. Transfer feature coming soon!');
      setShowTransferModal(false);
    } finally {
      setActionLoading(prev => ({ ...prev, transfer: false }));
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? '💰' : '💸';
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? '#4CAF50' : '#F44336';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Wallet</span>
          <h2 className="s-title">Loading Wallet</h2>
          <p className="s-sub">Fetching your wallet information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <div className="section-wrap">
        <span className="s-tag">Wallet</span>
        <h2 className="s-title">My Wallet</h2>
        <p className="s-sub">Manage your SaathCoins and transaction history.</p>

        <div className="gc" style={{ padding: 32, borderRadius: 20 }}>
          {/* Balance Card */}
          <div className="dash-card" style={{ marginBottom: 32, textAlign: 'center', padding: 28 }}>
            <h3 style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 8, fontSize: '0.9rem', fontWeight: 500 }}>
              Available Balance
            </h3>
            <div style={{ fontSize: '2.25rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.6rem' }}>🪙</span>
              {wallet?.balance ?? 0}
            </div>
            <p style={{ color: 'rgba(255,200,220,0.65)', fontSize: '0.88rem', marginTop: 6 }}>
              SaathCoins
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                disabled={!wallet || wallet.balance <= 0}
                className="btn-ghost-nav"
                style={{ opacity: (!wallet || wallet.balance <= 0) ? 0.5 : 1 }}
              >
                💸 Withdraw
              </button>
              <button
                type="button"
                onClick={() => setShowTransferModal(true)}
                disabled={!wallet || wallet.balance <= 0}
                className="btn-ghost-nav"
                style={{ opacity: (!wallet || wallet.balance <= 0) ? 0.5 : 1 }}
              >
                🔄 Transfer
              </button>
            </div>
          </div>

          {/* Referral Code */}
          {referralCode && (
            <div className="gc" style={{ padding: 20, marginBottom: 24 }}>
              <h4 className="s-tag" style={{ marginBottom: 12, fontSize: '0.85rem' }}>
                🎁 Your Referral Code
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 600, color: '#fff', letterSpacing: 2 }}>
                  {referralCode}
                </span>
                <button type="button" onClick={copyReferralCode} className="btn-primary-nav" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  📋 Copy
                </button>
              </div>
              <p className="s-sub" style={{ marginTop: 8, marginBottom: 0, fontSize: '0.82rem' }}>
                Share this code with friends to earn bonus coins!
              </p>
            </div>
          )}

          {/* Transaction History */}
          <div>
            <h3 className="s-tag" style={{ marginBottom: 16, fontSize: '1rem' }}>
              📊 Transaction History
            </h3>

            {!wallet?.transactions?.length ? (
              <div className="gc" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8, color: 'rgba(255,255,255,0.4)' }}>📭</div>
                <p className="s-sub" style={{ marginBottom: 0 }}>No transactions yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {wallet.transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="gc"
                    style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {getTransactionIcon(transaction.type)}
                        </span>
                        <span style={{ 
                          color: 'white', 
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}>
                          {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} coins
                        </span>
                      </div>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        fontSize: '0.9rem',
                        marginBottom: '4px'
                      }}>
                        {transaction.reason}
                      </p>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.5)', 
                        fontSize: '0.8rem'
                      }}>
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: getTransactionColor(transaction.type)
                    }}></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="auth-overlay" style={{ opacity: 1, pointerEvents: 'all' }}>
          <div className="auth-card" style={{ width: '90%', maxWidth: 400 }}>
            <h3 className="auth-title" style={{ marginBottom: 24 }}>
              💸 Withdraw Money
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block'
              }}>
                Amount (SaathCoins)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={wallet?.balance || 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.8rem',
                marginTop: '4px'
              }}>
                Available: {wallet?.balance || 0} coins
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block'
              }}>
                Account Holder Name
              </label>
              <input
                type="text"
                value={bankDetails.accountHolder}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolder: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block'
              }}>
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block'
              }}>
                IFSC Code
              </label>
              <input
                type="text"
                value={bankDetails.ifsc}
                onChange={(e) => setBankDetails(prev => ({ ...prev, ifsc: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={handleWithdraw} disabled={actionLoading.withdraw} className="btn-auth" style={{ flex: 1 }}>
                {actionLoading.withdraw ? 'Processing...' : 'Withdraw'}
              </button>
              <button type="button" onClick={() => setShowWithdrawModal(false)} className="btn-ghost-nav" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="auth-overlay" style={{ opacity: 1, pointerEvents: 'all' }}>
          <div className="auth-card" style={{ width: '90%', maxWidth: 400 }}>
            <h3 className="auth-title" style={{ marginBottom: 24 }}>
              🔄 Transfer Money
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block'
              }}>
                Recipient Email
              </label>
              <input
                type="email"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block'
              }}>
                Amount (SaathCoins)
              </label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                max={wallet?.balance || 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.8rem',
                marginTop: '4px'
              }}>
                Available: {wallet?.balance || 0} coins
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block'
              }}>
                Message (Optional)
              </label>
              <textarea
                value={transferMessage}
                onChange={(e) => setTransferMessage(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={handleTransfer} disabled={actionLoading.transfer} className="btn-auth" style={{ flex: 1 }}>
                {actionLoading.transfer ? 'Processing...' : 'Transfer'}
              </button>
              <button type="button" onClick={() => setShowTransferModal(false)} className="btn-ghost-nav" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
