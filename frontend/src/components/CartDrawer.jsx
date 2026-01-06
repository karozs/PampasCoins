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

            {/* Drawer - Andean Style */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
                {/* Header with Gradient */}
                <div className="p-6 bg-gradient-to-r from-azul-lago to-purpura-mistico text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 animate-shimmer"></div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <i className="bi bi-cart-check-fill"></i>
                                Tu Carrito
                            </h2>
                            <p className="text-white/80 text-sm mt-1">
                                {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <i className="bi bi-x-lg text-xl"></i>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                            <div className="w-24 h-24 bg-gradient-to-br from-azul-lago/10 to-purpura-mistico/10 rounded-full flex items-center justify-center mb-4">
                                <i className="bi bi-cart-x text-5xl text-azul-lago/50"></i>
                            </div>
                            <p className="text-xl font-bold text-slate-900 mb-2">Tu carrito está vacío</p>
                            <p className="text-sm mb-6 text-slate-600">¡Explora el marketplace y agrega productos!</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="px-6 py-3 bg-gradient-to-r from-azul-lago to-purpura-mistico text-white rounded-xl hover:scale-105 transition-all font-bold shadow-lg"
                            >
                                <i className="bi bi-shop mr-2"></i>
                                Ver Productos
                            </button>
                        </div>
                    ) : (
                        cart.map(item => {
                            const itemSubtotal = parseFloat(item.price) * item.quantity;
                            return (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 hover:border-azul-lago/30 transition-all shadow-sm hover:shadow-md">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-200">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <i className="bi bi-image text-3xl"></i>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 line-clamp-2 mb-1">{item.name}</h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-rojo-andino to-naranja-inca">
                                                    {parseFloat(item.price).toFixed(2)} TC
                                                </span>
                                                <span className="text-xs text-slate-400">/ {item.unit || 'unidad'}</span>
                                            </div>

                                            {/* Quantity Controls - Larger and More Intuitive */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 hover:from-rojo-andino hover:to-rojo-andino-light hover:text-white transition-all font-bold shadow-sm hover:shadow-md"
                                                    >
                                                        <i className="bi bi-dash-lg"></i>
                                                    </button>
                                                    <div className="w-16 h-10 flex items-center justify-center bg-gradient-to-br from-azul-lago/10 to-purpura-mistico/10 rounded-xl border-2 border-azul-lago/20">
                                                        <span className="text-lg font-bold text-slate-900">{item.quantity}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-verde-puna to-verde-puna-dark text-white hover:scale-110 transition-all font-bold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <i className="bi bi-plus-lg"></i>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-medium">Subtotal:</span>
                                                <span className="text-base font-bold text-slate-900">{itemSubtotal.toFixed(2)} TC</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t-4 border-azul-lago/20 bg-white">
                        {/* Total Section */}
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl mb-4 border-2 border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600 font-medium">Subtotal</span>
                                <span className="text-lg font-bold text-slate-700">{cartTotal.toFixed(2)} TC</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-300">
                                <span className="text-slate-900 font-bold text-lg">Total a pagar</span>
                                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rojo-andino to-naranja-inca">
                                    {cartTotal.toFixed(2)} TC
                                </span>
                            </div>
                        </div>

                        {/* Checkout Button - Vibrant Gradient */}
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-verde-puna via-azul-lago to-purpura-mistico text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-2xl shadow-azul-lago/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-credit-card-fill text-xl"></i>
                                    Pagar Ahora
                                </>
                            )}
                        </button>

                        {/* Security Badge */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <i className="bi bi-shield-check text-verde-puna"></i>
                            <span>Pago seguro con TayaCoins</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
