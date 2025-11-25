import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkout } from '../api';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ user, onCheckoutSuccess }) => {
    const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = async () => {
        if (!user) {
            alert('Debes iniciar sesión para comprar');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            const response = await checkout({ buyer_id: user.id, items });

            alert('¡Compra realizada con éxito!');
            clearCart();
            setIsCartOpen(false);
            if (onCheckoutSuccess) onCheckoutSuccess(response.newBalance);
            navigate('/history');
        } catch (error) {
            alert('Error en la compra: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <i className="bi bi-bag-check text-primary"></i>
                        Tu Carrito
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <i className="bi bi-cart-x text-4xl text-slate-300"></i>
                            </div>
                            <p className="text-lg font-medium text-slate-900">Tu carrito está vacío</p>
                            <p className="text-sm mb-6">¡Explora el marketplace y agrega productos!</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-bold"
                            >
                                Ver Productos
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <i className="bi bi-image text-2xl"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                                    <p className="text-secondary font-bold text-sm mb-2">{parseFloat(item.price).toFixed(2)} TC</p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 h-8">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors p-2"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-500">Total a pagar</span>
                            <span className="text-2xl font-bold text-slate-900">{cartTotal.toFixed(2)} TC</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <i className="bi bi-credit-card mr-2"></i> Pagar Ahora
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
