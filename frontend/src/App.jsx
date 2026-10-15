import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://commissionweb.wuaze.com";

export default function App() {
  const [view, setView] = useState('offers'); // 'offers' | 'login' | 'dashboard'
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // New/Edit Offer Form States
  const [editOfferId, setEditOfferId] = useState(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  // Order Submission Form State
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [clientEmail, setClientEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [orderMsg, setOrderMsg] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/offers.php`);
      const data = await res.json();
      if (Array.isArray(data)) setOffers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/commissions.php`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setView('dashboard');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Could not reach backend server');
    }
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    const method = editOfferId ? 'PUT' : 'POST';
    const payload = editOfferId
      ? { id: editOfferId, title: offerTitle, description: offerDesc, base_price: offerPrice }
      : { title: offerTitle, description: offerDesc, base_price: offerPrice };

    try {
      const res = await fetch(`${API_BASE_URL}/offers.php`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditOfferId(null);
        setOfferTitle('');
        setOfferDesc('');
        setOfferPrice('');
        fetchOffers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/commissions.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: clientEmail,
          offer_id: selectedOffer.id,
          custom_requirements: requirements
        })
      });
      if (res.ok) {
        setOrderMsg('Order placed successfully!');
        setClientEmail('');
        setRequirements('');
        setSelectedOffer(null);
      }
    } catch (err) {
      setOrderMsg('Failed to place order.');
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setView('offers');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <nav style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <button onClick={() => setView('offers')}>Customer Offers</button>
        {token ? (
          <>
            <button onClick={() => setView('dashboard')}>Admin Dashboard</button>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setView('login')}>Admin Login</button>
        )}
      </nav>

      {/* VIEW 1: PUBLIC OFFERS */}
      {view === 'offers' && (
        <div>
          <h2>Available Commission Services</h2>
          {orderMsg && <p style={{ color: 'green' }}>{orderMsg}</p>}
          <div style={{ display: 'grid', gap: '15px' }}>
            {offers.map(o => (
              <div key={o.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h3>{o.title} - ${o.base_price}</h3>
                <p>{o.description}</p>
                <button onClick={() => setSelectedOffer(o)}>Request This Commission</button>
              </div>
            ))}
          </div>

          {selectedOffer && (
            <form onSubmit={handleOrderSubmit} style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px' }}>
              <h3>Ordering: {selectedOffer.title}</h3>
              <input
                type="email"
                placeholder="Your Email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                required
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
              <textarea
                placeholder="Describe what you need..."
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                required
                style={{ display: 'block', marginBottom: '10px', width: '100%', height: '80px' }}
              />
              <button type="submit">Submit Request</button>
            </form>
          )}
        </div>
      )}

      {/* VIEW 2: LOGIN */}
      {view === 'login' && (
        <form onSubmit={handleLogin} style={{ maxWidth: '300px' }}>
          <h2>Admin Login</h2>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <button type="submit">Log In</button>
        </form>
      )}

      {/* VIEW 3: ADMIN DASHBOARD */}
      {view === 'dashboard' && token && (
        <div>
          <h2>Admin Dashboard</h2>

          <h3>{editOfferId ? 'Edit Offer' : 'Create New Offer'}</h3>
          <form onSubmit={handleSaveOffer} style={{ background: '#f0f0f0', padding: '15px', marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Title (e.g. Modern Presentation)"
              value={offerTitle}
              onChange={e => setOfferTitle(e.target.value)}
              required
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <textarea
              placeholder="Service Description"
              value={offerDesc}
              onChange={e => setOfferDesc(e.target.value)}
              required
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <input
              type="number"
              placeholder="Base Price ($)"
              value={offerPrice}
              onChange={e => setOfferPrice(e.target.value)}
              required
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <button type="submit">{editOfferId ? 'Update Offer' : 'Add Offer'}</button>
            {editOfferId && <button type="button" onClick={() => setEditOfferId(null)} style={{ marginLeft: '10px' }}>Cancel</button>}
          </form>

          <h3>Manage Offers</h3>
          <ul>
            {offers.map(o => (
              <li key={o.id} style={{ marginBottom: '10px' }}>
                <b>{o.title}</b> - ${o.base_price}
                <button onClick={() => {
                  setEditOfferId(o.id);
                  setOfferTitle(o.title);
                  setOfferDesc(o.description);
                  setOfferPrice(o.base_price);
                }} style={{ marginLeft: '10px' }}>Edit</button>
              </li>
            ))}
          </ul>

          <h3>Client Commission Requests</h3>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client Email</th>
                <th>Offer</th>
                <th>Requirements</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(ord => (
                <tr key={ord.id}>
                  <td>{ord.created_at}</td>
                  <td>{ord.customer_email}</td>
                  <td>{ord.offer_title} (${ord.base_price})</td>
                  <td>{ord.custom_requirements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}