import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../api';

const CreateProduct = ({ user }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: 1,
        image_url: '',
        category: 'Otros',
        unit: 'unidades'
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

    const handleQuantityChange = (amount) => {
        const newQuantity = Math.max(1, parseInt(formData.quantity || 0) + amount);
        setFormData({ ...formData, quantity: newQuantity });
    };

    return (
        <div className="min-h-screen bg-background py-8 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Breadcrumb & Header */}
                <div className="mb-8">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                        <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                        <i className="bi bi-chevron-right mx-2 text-xs"></i>
                        <span className="text-slate-900 font-medium">Publicar Producto</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Publicar Producto</h1>
                    <p className="text-slate-500">Agregue su producto al marketplace de Tayacoins</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Info Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                        <i className="bi bi-box-seam text-xl"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Información del Producto</h2>
                                        <p className="text-sm text-slate-500">Complete los detalles de su producto</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Nombre del Producto <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Ej: Tomates frescos, Miel artesanal..."
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Quantity & Unit */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Cantidad Disponible <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(-1)}
                                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 rounded-l-xl transition-colors"
                                                    >
                                                        <i className="bi bi-dash-lg"></i>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="1"
                                                        className="w-20 text-center bg-transparent border-none focus:ring-0 font-bold text-slate-900"
                                                        value={formData.quantity}
                                                        onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 0) })}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(1)}
                                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 rounded-r-xl transition-colors"
                                                    >
                                                        <i className="bi bi-plus-lg"></i>
                                                    </button>
                                                </div>
                                                <select
                                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                    value={formData.unit}
                                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                >
                                                    <option value="unidades">Unidades</option>
                                                    <option value="kg">Kg</option>
                                                    <option value="litros">Litros</option>
                                                    <option value="paquetes">Paquetes</option>
                                                    <option value="cajas">Cajas</option>
                                                    <option value="gramos">Gramos</option>
                                                    <option value="libras">Libras</option>
                                                    <option value="oz">Onzas</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Precio por Unidad <span className="text-red-500">*</span>
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
                                            <p className="text-xs text-slate-400 mt-1">Precio en Tayacoins (TC)</p>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Categoría <span className="text-red-500">*</span>
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

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Descripción del Producto <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                            placeholder="Describa su producto: origen, características, estado, etc..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            maxLength={500}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-slate-400">Mínimo 10 caracteres para una buena descripción</span>
                                            <span className="text-xs text-slate-400">{formData.description.length}/500</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Images Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <i className="bi bi-camera text-xl"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Imágenes del Producto</h2>
                                        <p className="text-sm text-slate-500">Opcional - Agregue una imagen referencia</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <i className="bi bi-card-image text-3xl"></i>
                                        </div>
                                        <p className="text-slate-900 font-medium mb-2">URL de la Imagen</p>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 rounded-lg bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {formData.image_url && (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 h-48 bg-slate-50 flex items-center justify-center group">
                                            <img
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="h-full object-contain"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image_url: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all hover:scale-[1.01] shadow-lg shadow-primary/20 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <i className="bi bi-upload mr-2"></i> Publicar Producto
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Guide */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                                <div className="w-10 h-10 rounded-lg bg-amber-700 flex items-center justify-center text-white">
                                    <i className="bi bi-book text-xl"></i>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Guía de Publicación</h2>
                                    <p className="text-sm text-slate-500">Consejos para una publicación exitosa</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <i className="bi bi-check-circle-fill text-green-500 text-xl flex-shrink-0"></i>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm mb-1">Productos Permitidos</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Alimentos frescos, productos artesanales, herramientas, libros, ropa y artículos del hogar en buen estado.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <i className="bi bi-x-circle-fill text-red-500 text-xl flex-shrink-0"></i>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm mb-1">Productos Prohibidos</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Artículos vencidos, dañados, ilegales, medicamentos, armas o productos que requieran licencias especiales.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <i className="bi bi-star-fill text-yellow-400 text-xl flex-shrink-0"></i>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm mb-1">Mejores Prácticas</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Use fotos claras, descripciones detalladas, precios justos y mantenga actualizada la disponibilidad.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <i className="bi bi-people-fill text-secondary text-xl flex-shrink-0"></i>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm mb-1">Comunidad</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Sea honesto, responda rápido a consultas y mantenga una buena reputación en la comunidad.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-4">
                                    <div className="flex gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5"></div>
                                        <h4 className="text-xs font-bold text-slate-700">Recordatorio Importante</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-4">
                                        Una vez publicado, su producto será visible para toda la comunidad. Asegúrese de que toda la información sea correcta antes de publicar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
