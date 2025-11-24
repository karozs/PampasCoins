import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await loginUser(formData);
            onLogin(user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Column - Welcome Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center relative overflow-hidden border-r border-slate-100">
                <div className="max-w-xl px-10 text-center">
                    <div className="mb-8 inline-flex p-4 bg-primary rounded-2xl shadow-lg shadow-primary/30">
                        <i className="bi bi-layers-fill text-4xl text-white"></i>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-slate-900 tracking-tight">Bienvenido a Tayacoins</h1>
                    <p className="text-lg text-slate-500 mb-10 font-light">
                        El marketplace digital donde intercambia productos usando créditos virtuales
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left mb-12">
                        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-2 text-primary">
                                <i className="bi bi-arrow-repeat text-xl"></i>
                            </div>
                            <h5 className="font-bold mb-1 text-slate-800 text-sm">Intercambio sin dinero</h5>
                            <p className="text-xs text-slate-500">Use Tayacoins para intercambiar productos sin efectivo</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-2 text-primary">
                                <i className="bi bi-people text-xl"></i>
                            </div>
                            <h5 className="font-bold mb-1 text-slate-800 text-sm">Comunidad local</h5>
                            <p className="text-xs text-slate-500">Conecte con agricultores y comerciantes de su zona</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-2 text-primary">
                                <i className="bi bi-recycle text-xl"></i>
                            </div>
                            <h5 className="font-bold mb-1 text-slate-800 text-sm">Economía circular</h5>
                            <p className="text-xs text-slate-500">Contribuya a un sistema de intercambio sostenible</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-2 text-primary">
                                <i className="bi bi-shield-check text-xl"></i>
                            </div>
                            <h5 className="font-bold mb-1 text-slate-800 text-sm">Transacciones seguras</h5>
                            <p className="text-xs text-slate-500">Sistema confiable para todos sus intercambios</p>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-12 border-t border-slate-100 pt-8">
                        <div>
                            <h3 className="text-2xl font-bold text-primary">1,250+</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Usuarios activos</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-primary">3,400+</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Productos</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-primary">8,900+</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Intercambios</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md border border-slate-100 rounded-2xl p-8 shadow-xl bg-white">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                            <i className="bi bi-coin text-3xl text-white"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Iniciar Sesión</h2>
                        <p className="text-slate-500 text-sm">Acceda a su cuenta de Tayacoins</p>
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-slate-900">Bienvenido a Tayacoin</h3>
                        <p className="text-sm text-slate-500">Inicia sesión para acceder a tu cuenta</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center">
                            <i className="bi bi-exclamation-circle text-red-500 mr-3 text-xl"></i>
                            <p className="text-red-700 font-medium text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Número de teléfono</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="+34 612 345 678"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-in-right mr-2"></i> Iniciar sesión
                                </>
                            )}
                        </button>

                        <div className="text-center mt-6 pt-6 border-t border-slate-100">
                            <p className="text-sm text-slate-500 mb-4">¿No tienes cuenta?</p>
                            <Link to="/register" className="inline-flex items-center text-slate-700 font-bold hover:text-primary transition-colors text-sm">
                                <i className="bi bi-person-plus mr-2"></i> Crear nueva cuenta
                            </Link>

                            <div className="mt-4 text-xs text-slate-400">
                                Demo: +34612345678 / tayacoin123
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
