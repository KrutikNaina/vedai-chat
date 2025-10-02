// src/components/Payment.jsx
import { useState, useEffect } from "react";
import { X, CheckCircle2, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Payment = ({ user, token, plan, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!plan) return;

    setLoading(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.message);

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "VedAI Premium",
        description: `${plan.name} Subscription`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              "http://localhost:5000/api/payment/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              alert("🎉 Payment successful! Welcome to VedAI Premium!");
              onSuccess();
            } else {
              alert("❌ Payment verification failed. Contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("❌ Payment verification failed. Contact support.");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#f97316" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-4xl bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white hover:text-orange-200 transition-colors"
            >
              <X size={28} />
            </button>
            <h2 className="text-4xl font-bold mb-2">🚀 Upgrade to VedAI Premium</h2>
            <p className="text-orange-100 text-lg">Unlock unlimited spiritual guidance and AI wisdom</p>
          </div>

          {/* Plan Details */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                {error}
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{plan.name} Plan</h3>
              <p className="text-gray-600 text-lg mb-2">
                Price: <span className="text-orange-600 font-bold">₹{plan.price}</span> per {plan.duration}
              </p>
              <ul className="space-y-2 mt-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle2 className="text-green-500 mr-2" size={18} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-center text-sm text-gray-600 mt-4">
                <Shield size={16} className="mr-2" /> Secure payment • Cancel anytime
              </div>
            </div>

            {/* Payment Button */}
            <div className="text-center">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="relative px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Zap className="inline mr-2" size={20} />
                    Upgrade Now - ₹{plan.price}
                  </>
                )}
              </button>
              <p className="mt-4 text-sm text-gray-600">🔒 Your payment is secured with Razorpay</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Payment;
