import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-primary text-white shadow-md shadow-primary/20'
            : 'text-slate-500 hover:text-primary hover:bg-slate-50';
    };

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link className="flex items-center space-x-2 group" to="/dashboard">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <i className="bi bi-layers-fill text-white text-sm"></i>
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Tayacoins</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard')}`} to="/dashboard">
                            Dashboard
                        </Link>
                        <Link className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/products')}`} to="/products">
                            Productos
                        </Link>
                        <Link className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/create-product')}`} to="/create-product">
                            Publicar
                        </Link>
                        <Link className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/history')}`} to="/history">
                            Historial
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <i className="bi bi-coin text-bronze mr-2"></i>
                                    <span className="font-bold text-slate-900 text-sm">{parseFloat(user.balance).toFixed(0)} TC</span>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm focus:outline-none hover:bg-primary-light transition-colors overflow-hidden"
                                    >
                                        {user.profile_image ? (
                                            <img src={`http://localhost:3000${user.profile_image}`} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </button>

                                    {/* Dropdown */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 border border-slate-100 transform origin-top-right transition-all">
                                            <div className="px-4 py-3 border-b border-slate-100">
                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.phone}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <i className="bi bi-person-circle mr-2"></i>Mi Perfil
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <i className="bi bi-box-arrow-right mr-2"></i>Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary">Iniciar sesión</Link>
                                <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-light transition-colors shadow-sm">
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-600 focus:outline-none hover:text-primary"
                        >
                            <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 border-t border-slate-100 pt-4">
                        <div className="flex flex-col space-y-2">
                            <Link className={`px-4 py-2 rounded-lg text-sm font-medium ${isActive('/dashboard')}`} to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                Dashboard
                            </Link>
                            <Link className={`px-4 py-2 rounded-lg text-sm font-medium ${isActive('/products')}`} to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                                Productos
                            </Link>
                            <Link className={`px-4 py-2 rounded-lg text-sm font-medium ${isActive('/create-product')}`} to="/create-product" onClick={() => setIsMobileMenuOpen(false)}>
                                Publicar
                            </Link>
                            <Link className={`px-4 py-2 rounded-lg text-sm font-medium ${isActive('/history')}`} to="/history" onClick={() => setIsMobileMenuOpen(false)}>
                                Historial
                            </Link>
                            <hr className="border-slate-100 my-2" />
                            {user ? (
                                <>
                                    <div className="px-4 py-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">Saldo</span>
                                        <span className="font-bold text-primary">{parseFloat(user.balance).toFixed(2)} TC</span>
                                    </div>
                                    <Link className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50" to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        Mi Perfil
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="text-left px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>
                                        Iniciar sesión
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary/5" onClick={() => setIsMobileMenuOpen(false)}>
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
