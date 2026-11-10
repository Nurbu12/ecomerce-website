import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store } from 'lucide-react';

const Navbar = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${searchKeyword.trim()}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide">
          <Store className="w-6 h-6 text-emerald-400" />
          <span>ShopSphere</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search products, categories..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full bg-slate-800 text-sm text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-400 border border-slate-700"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-r-md transition text-slate-950 font-medium"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative flex items-center gap-1 hover:text-emerald-400 transition">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-1 hover:text-emerald-400 transition">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{userInfo.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded transition font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-1.5 rounded text-sm font-semibold transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;