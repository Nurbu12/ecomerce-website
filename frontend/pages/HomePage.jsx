import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Discover Quality Products <span className="text-emerald-400">Without Limits</span>
          </h1>
          <p className="text-slate-300 text-lg">
            Shop the latest electronics, apparel, and gadgets securely with fast shipping and verified reviews.
          </p>
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3 rounded-lg shadow-lg transition"
            >
              Shop Catalog <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <Truck className="w-10 h-10 text-emerald-500" />
          <div>
            <h3 className="font-bold text-slate-800">Fast Delivery</h3>
            <p className="text-sm text-slate-500">Free shipping on all orders over $50</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
          <div>
            <h3 className="font-bold text-slate-800">Secure Payments</h3>
            <p className="text-sm text-slate-500">Protected by Stripe & Razorpay gateways</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <Headphones className="w-10 h-10 text-emerald-500" />
          <div>
            <h3 className="font-bold text-slate-800">24/7 Support</h3>
            <p className="text-sm text-slate-500">Dedicated assistance anytime you need</p>
          </div>
        </div>
      </section>
    </div>
  );
}