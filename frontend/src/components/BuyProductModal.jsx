import React, { useState } from 'react';

const BuyProductModal = ({ product, onClose, onBuy, userBalance }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const totalPrice = (parseFloat(product.price) * quantity).toFixed(2);
    const canAfford = parseFloat(userBalance) >= parseFloat(totalPrice);
    const hasStock = product.quantity >= quantity;

    const handleBuy = async () => {
        if (!canAfford || !hasStock) return;
        setLoading(true);
        await onBuy(product, quantity);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Comprar Producto</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <i className="bi bi-image text-2xl"></i>
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{product.name}</h4>
                            <p className="text-sm text-slate-500">{product.description}</p>
                            <p className="text-primary font-bold mt-1">{parseFloat(product.price).toFixed(2)} TC / {product.unit || 'unidad'}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Cantidad a comprar ({product.unit || 'unidades'})
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <i className="bi bi-dash-lg"></i>
                            </button>
                            <input
                                type="number"
                                min="1"
                                max={product.quantity}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(product.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="flex-1 text-center font-bold text-xl py-2 border-b-2 border-slate-200 focus:border-primary outline-none"
                            />
                            <button
                                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            Stock disponible: {product.quantity} {product.unit || 'unidades'}
                        </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Precio unitario</span>
                            <span>{parseFloat(product.price).toFixed(2)} TC</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Cantidad</span>
                            <span>x {quantity}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg text-slate-900">
                            <span>Total</span>
                            <span>{totalPrice} TC</span>
                        </div>
                    </div>

                    {!canAfford && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                            <i className="bi bi-exclamation-circle-fill mr-2"></i>
                            Saldo insuficiente (Tienes {parseFloat(userBalance).toFixed(2)} TC)
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleBuy}
                            disabled={loading || !canAfford || !hasStock}
                            className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <i className="bi bi-bag-check-fill mr-2"></i> Confirmar Compra
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyProductModal;
