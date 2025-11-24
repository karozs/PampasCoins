import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api';

const Register = ({ onLogin }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await registerUser(formData);
            onLogin(user);
        } catch (err) {
            setError('Error al registrar. El celular podría estar en uso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Column - Welcome Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary to-secondary-dark text-white items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604594849809-dfedbc827105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] opacity-10 bg-cover bg-center"></div>
                <div className="relative z-10 max-w-lg px-10 text-center">
                    <div className="mb-8 inline-flex p-4 bg-white/10 rounded-full backdrop-blur-sm">
                        <i className="bi bi-person-plus-fill text-6xl text-white"></i>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Únase a Tayacoins</h1>
                    <p className="text-xl text-green-50 mb-10 font-light">
                        Comience a intercambiar productos de forma sostenible y sin dinero. Su comunidad le espera.
                    </p>

                    <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 text-left">
                        <h5 className="text-xl font-bold mb-6 flex items-center">
                            <i className="bi bi-check-circle-fill mr-3 text-white"></i>
                            Beneficios de unirse
                        </h5>
                        <ul className="space-y-4">
                            <li className="flex items-center text-green-50">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
                                    <i className="bi bi-arrow-right text-sm"></i>
                                </div>
                                <span>100 Tayacoins de bienvenida</span>
                            </li>
                            <li className="flex items-center text-green-50">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
                                    <i className="bi bi-shop text-sm"></i>
                                </div>
                                <span>Acceso al marketplace completo</span>
                            </li>
                            <li className="flex items-center text-green-50">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
                                    <i className="bi bi-box-seam text-sm"></i>
                                </div>
                                <span>Publicación ilimitada de productos</span>
                            </li>
                            <li className="flex items-center text-green-50">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
                                    <i className="bi bi-people text-sm"></i>
                                </div>
                                <span>Comunidad activa y confiable</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Column - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bi bi-person-plus text-4xl text-secondary"></i>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Crear Cuenta</h2>
                        <p className="text-slate-500">Complete el formulario para comenzar</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center">
                            <i className="bi bi-exclamation-circle text-red-500 mr-3 text-xl"></i>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="bi bi-person text-slate-400"></i>
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="María González"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Número de teléfono</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="bi bi-phone text-slate-400"></i>
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="+34 612 345 678"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="bi bi-lock text-slate-400"></i>
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary-light transition-colors shadow-lg shadow-secondary/20 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <i className="bi bi-person-plus mr-2"></i> Registrarse
                                </>
                            )}
                        </button>

                        <div className="text-center mt-8">
                            <p className="text-slate-500">
                                ¿Ya tienes cuenta? <Link to="/login" className="text-secondary font-bold hover:underline">Iniciar sesión</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
