import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Store, Star, Trash2, Plus, Minus, PackagePlus, Edit, ShieldCheck, Truck, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// 1. Flipkart-Inspired Header Component
const Navbar = ({ cartCount }) => {
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKey.trim()) navigate(`/?keyword=${encodeURIComponent(searchKey.trim())}`);
    else navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const displayName = userInfo?.name && userInfo.name !== 'New User' 
    ? userInfo.name.split(' ')[0] 
    : userInfo?.phone 
    ? `User (${userInfo.phone.slice(-4)})` 
    : 'Sign In';

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-emerald-400 transition">
          <Store className="w-6 h-6 text-emerald-400" />
          <span>ShopSphere</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search products, brands and categories..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-full bg-white text-slate-900 text-sm px-4 py-2 rounded-l-md focus:outline-none"
          />
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-r-md text-slate-950 font-bold transition">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-6 text-sm">
          {userInfo && (userInfo.role === 'admin' || userInfo.role === 'seller') && (
            <Link to="/admin/products" className="hidden lg:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700">
              <PackagePlus className="w-4 h-4 text-emerald-400" />
              <span>Seller Hub</span>
            </Link>
          )}

          {userInfo ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex flex-col text-left hover:text-emerald-400 transition">
                <span className="text-[10px] text-slate-400 uppercase leading-none">Hello,</span>
                <span className="font-semibold text-white text-xs sm:text-sm">{displayName}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-xs bg-rose-600/80 hover:bg-rose-600 text-white px-2.5 py-1 rounded font-medium transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex flex-col text-left hover:text-emerald-400 transition">
              <span className="text-[10px] text-slate-400 uppercase leading-none">Hello, Sign in</span>
              <span className="font-bold text-white text-xs sm:text-sm">Account</span>
            </Link>
          )}

          <Link to="/orders" className="flex items-center gap-1 hover:text-emerald-400 transition">
            <span className="hidden sm:inline font-medium">Orders</span>
          </Link>

          <Link to="/cart" className="relative flex items-center gap-1 hover:text-emerald-400 transition">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

// 2. Full Flipkart-Style Profile & Account Dashboard
const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));
  const [activeTab, setActiveTab] = useState('personal');
  
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [shipping, setShipping] = useState({
    address: userInfo?.shippingAddress?.address || '',
    city: userInfo?.shippingAddress?.city || '',
    postalCode: userInfo?.shippingAddress?.postalCode || '',
    country: userInfo?.shippingAddress?.country || 'India',
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await API.put('/auth/profile', { name, email, shippingAddress: shipping }, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      alert('Profile details updated successfully!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  if (!userInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">Please log in to manage your account details.</p>
        <Link to="/login" className="bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg">Log In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4 md:col-span-1">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 text-slate-950 font-bold text-xl rounded-full flex items-center justify-center">
              {(userInfo.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-slate-400">Hello,</p>
              <h3 className="font-bold text-slate-900 leading-tight">{userInfo.name || 'Set your name'}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">
            <div className="p-3 bg-slate-50 font-bold text-slate-700 uppercase text-xs border-b">
              ACCOUNT SETTINGS
            </div>
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full text-left px-4 py-3 border-b flex items-center justify-between font-medium transition ${
                activeTab === 'personal' ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-l-emerald-500' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 border-b flex items-center justify-between font-medium transition ${
                activeTab === 'addresses' ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-l-emerald-500' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Manage Addresses
            </button>
            
            <div className="p-3 bg-slate-50 font-bold text-slate-700 uppercase text-xs border-b border-t">
              MY STUFF
            </div>
            <Link to="/orders" className="block px-4 py-3 border-b text-slate-600 hover:bg-slate-50 font-medium">
              My Orders
            </Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-rose-600 font-semibold hover:bg-rose-50 transition">
              Logout
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {activeTab === 'personal' ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 border-b pb-3">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Number (Logged in)</label>
                    <input
                      type="text"
                      value={userInfo.phone || 'N/A'}
                      disabled
                      className="w-full border bg-slate-100 p-2.5 rounded text-sm text-slate-500 cursor-not-allowed font-semibold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 border-b pb-3">Manage Delivery Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Flat / House No. / Street Address</label>
                    <input
                      type="text"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="e.g. 102, Green Valley Apartments"
                      required
                      className="w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      required
                      className="w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Pincode / Postal Code</label>
                    <input
                      type="text"
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      placeholder="e.g. 400001"
                      required
                      className="w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Country</label>
                    <input
                      type="text"
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      required
                      className="w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3 rounded-lg shadow-sm transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// 3. Catalog Page Component
const CatalogPage = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        const productList = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setProducts(productList);
        setLoading(false);
      } catch (err) {
        setErrorMsg('Failed to load products from backend server.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-14 px-6 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Welcome to ShopSphere
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Discover Quality Products at <span className="text-emerald-400">Unbeatable Prices</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl flex flex-col items-center text-center space-y-2 backdrop-blur-sm">
              <Truck className="w-6 h-6 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Free Shipping</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl flex flex-col items-center text-center space-y-2 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Secure Pay</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl flex flex-col items-center text-center space-y-2 backdrop-blur-sm">
              <Headphones className="w-6 h-6 text-emerald-400" />
              <span className="text-xs font-semibold text-white">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Trending Products</h2>
          <span className="text-sm font-medium text-slate-500">
            {products.length > 0 ? `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, products.length)} of ${products.length} items` : 'Showing all items (0)'}
          </span>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm">
            {errorMsg} Make sure your backend server is running (`npm run dev`).
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-500 py-16 text-lg">Loading products from database...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-500 py-16 text-lg">No products found in the database.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition">
                  <div className="h-52 overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img 
                      src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
                      alt={product.name} 
                      className="object-cover h-full w-full hover:scale-105 transition duration-300" 
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{product.rating || 4.5} ({product.numReviews || 10} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-lg font-bold text-slate-900">${product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium px-3 py-1.5 rounded text-sm transition shadow-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 4. Product Management Page
const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', compareAtPrice: '', images: '', category: '', stock: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const fetchData = async () => {
    try {
      const prodRes = await API.get('/products');
      const prodList = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.data || []);
      setProducts(prodList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice),
        stock: Number(formData.stock),
        images: formData.images.split(',').map((img) => img.trim()),
      };
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

      if (editId) {
        await API.put(`/products/${editId}`, payload, config);
        alert('Product updated successfully!');
      } else {
        await API.post('/products', payload, config);
        alert('Product created successfully!');
      }
      setFormData({ name: '', description: '', price: '', compareAtPrice: '', images: '', category: '', stock: '' });
      setEditId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">Product Management Dashboard</h2>
      {error && <div className="bg-rose-50 text-rose-700 p-3 rounded text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-800">{editId ? 'Edit Product' : 'Add New Product'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="border p-2 rounded text-sm" />
          <input type="text" placeholder="Category ID" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="border p-2 rounded text-sm" />
          <input type="number" placeholder="Price ($)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="border p-2 rounded text-sm" />
          <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required className="border p-2 rounded text-sm" />
          <input type="text" placeholder="Image URLs (comma separated)" value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} required className="border p-2 rounded text-sm md:col-span-2" />
        </div>
        <textarea placeholder="Product Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows="3" className="border p-2 rounded text-sm w-full" />
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2 rounded text-sm">
          {editId ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

// 5. Cart and Checkout Page Component
const CartPage = ({ cart, updateQuantity, removeFromCart }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const [shipping, setShipping] = useState({
    address: userInfo?.shippingAddress?.address || '',
    city: userInfo?.shippingAddress?.city || '',
    postalCode: userInfo?.shippingAddress?.postalCode || '',
    country: userInfo?.shippingAddress?.country || 'India',
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert('Please login to complete your order!');
      navigate('/login');
      return;
    }

    try {
      const orderPayload = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          images: item.images,
          price: item.price,
          product: item._id
        })),
        shippingAddress: shipping,
        paymentMethod: 'Cash on Delivery',
        totalPrice: subtotal
      };

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await API.post('/orders', orderPayload, config);

      const updatedUser = { ...userInfo, shippingAddress: shipping };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      alert('Order placed successfully! Your shipping address has been saved.');
      window.location.href = '/orders';
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 text-lg mb-4">Your cart is currently empty.</p>
        <Link to="/" className="bg-emerald-500 text-slate-950 font-semibold px-6 py-2.5 rounded-lg shadow-sm">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Shopping Cart & Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-4">
              <img src={item.images?.[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{item.name}</h3>
                <p className="text-emerald-600 font-bold mt-1">${item.price}</p>
              </div>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-slate-600 hover:text-black"><Minus className="w-4 h-4" /></button>
                <span className="font-semibold px-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-slate-600 hover:text-black"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit space-y-4">
          <h3 className="font-bold text-lg text-slate-900 border-b pb-3">Order Summary</h3>
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-3">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {!isCheckingOut ? (
            <button 
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg shadow-sm transition"
            >
              Proceed to Shipping
            </button>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2">
              <h4 className="font-semibold text-slate-800 text-sm">Shipping Address</h4>
              <input type="text" placeholder="Street Address" required value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full border p-2 rounded text-sm" />
              <input type="text" placeholder="City" required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full border p-2 rounded text-sm" />
              <input type="text" placeholder="Postal Code" required value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} className="w-full border p-2 rounded text-sm" />
              <input type="text" placeholder="Country" required value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} className="w-full border p-2 rounded text-sm" />
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg shadow-sm transition">
                Place Order Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// 6. Login Page Component
const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) { alert('Enter valid number'); return; }
    alert('Mock OTP sent: 1234');
    setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp !== '1234') { alert('Invalid OTP (Use 1234)'); return; }
    try {
      const { data } = await API.post('/auth/phone-login', { phone });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl border shadow-sm space-y-6">
      <h2 className="text-2xl font-bold text-center">Login with Phone</h2>
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input type="tel" placeholder="10-digit mobile number" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full border p-2.5 rounded text-sm" />
          <button type="submit" className="w-full bg-emerald-500 font-bold py-2.5 rounded">Request OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input type="text" placeholder="Enter OTP (1234)" value={otp} onChange={e => setOtp(e.target.value)} required maxLength="4" className="w-full border p-2.5 rounded text-center tracking-widest font-bold" />
          <button type="submit" className="w-full bg-emerald-500 font-bold py-2.5 rounded">Verify & Login</button>
        </form>
      )}
    </div>
  );
};

// 7. Orders Page Component
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        const { data } = await API.get('/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    if (userInfo) fetchOrders();
    else setLoading(false);
  }, []);

  if (!userInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">Please log in to view your order history.</p>
        <Link to="/login" className="bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg">Log In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">My Orders</h2>
      {loading ? (
        <p className="text-slate-500">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border text-center space-y-3">
          <p className="text-slate-600">You have no orders placed yet.</p>
          <Link to="/" className="inline-block bg-emerald-500 text-slate-950 font-bold px-6 py-2 rounded">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between text-xs text-slate-500 border-b pb-2">
                <span>Order ID: {order._id}</span>
                <span className="font-semibold text-emerald-600">Total: ${order.totalPrice}</span>
              </div>
              <div className="space-y-2">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-sm">
                    <img src={item.images?.[0]} alt="" className="w-12 h-12 object-cover rounded bg-slate-100" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} | Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 8. Main App Component
export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    alert('Added to cart!');
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCart((prev) => prev.map((item) => item._id === id ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar cartCount={totalCartCount} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CatalogPage addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/products" element={<ProductManagementPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}