import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api';

const CreateProduct = ({ user }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: 1,
        image_url: '',
        category: 'Otros'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createProduct({ ...formData, seller_id: user.id });
            alert('Producto creado exitosamente');
            navigate('/dashboard');
        } catch (error) {
            alert('Error al crear producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-primary px-8 py-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <i className="bi bi-plus-circle-fill mr-3"></i>
                        Publicar Nuevo Producto
                    </h2>
                    <p className="text-primary-light mt-1 text-sm">
                        Completa los detalles para añadir tu producto al marketplace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Nombre del Producto
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Ej. Tomates Orgánicos"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            required
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            placeholder="Describe tu producto (calidad, cantidad, origen...)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Categoría
                        </label>
                        <select
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Otros">Otros</option>
                            <option value="Tubérculos">Tubérculos</option>
                            <option value="Cereales">Cereales</option>
                            <option value="Legumbres">Legumbres</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Verduras">Verduras</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Precio (TC)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-slate-400 font-bold">TC</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                URL de Imagen (Opcional)
                            </label>
                            <input
                                type="url"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Image Preview */}
                    {formData.image_url && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                            <p className="text-xs text-slate-500 mb-2">Vista previa de la imagen</p>
                            <img
                                src={formData.image_url}
                                alt="Preview"
                                className="max-h-48 mx-auto rounded-lg shadow-sm object-contain"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </div>
                    )}

                    <div className="pt-6 flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg mr-2"></i> Publicar Producto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
