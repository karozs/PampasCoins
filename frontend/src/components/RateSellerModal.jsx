import React, { useState } from 'react';
import axios from 'axios';

const RateSellerModal = ({ transaction, onClose, onRate }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:3000/api/reviews', {
                seller_id: transaction.seller_id,
                buyer_id: transaction.buyer_id,
                rating,
                comment
            });
            onRate();
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error al enviar la reseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Calificar Vendedor</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-slate-600 mb-4">¿Qué te pareció tu compra con <span className="font-bold text-slate-900">{transaction.seller_name}</span>?</p>

                        <div className="flex justify-center space-x-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
                                >
                                    <i className={`bi ${rating >= star ? 'bi-star-fill' : 'bi-star'}`}></i>
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                            {rating === 5 ? '¡Excelente!' :
                                rating === 4 ? 'Muy bueno' :
                                    rating === 3 ? 'Regular' :
                                        rating === 2 ? 'Malo' : 'Pésimo'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Comentario (Opcional)</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows="3"
                            placeholder="Escribe tu experiencia..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Omitir
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <i className="bi bi-send-fill mr-2"></i> Enviar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RateSellerModal;
