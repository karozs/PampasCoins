import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getUserProfile, getUserTransactions, getPopularProducts } from '../api';

const Dashboard = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(user);
    const [recentActivity, setRecentActivity] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [stats, setStats] = useState({
        productsPublished: 0,
        productsSold: 0,
        purchasesMade: 0,
        activeProducts: 0,
        weeklyIncome: 0,
        weeklyExpenses: 0
    });

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);

            const myProducts = data.filter(p => p.seller_id === user.id);
            const soldProducts = myProducts.filter(p => p.status === 'sold');
            const activeProducts = myProducts.filter(p => p.status === 'available');

            setStats(prev => ({
                ...prev,
                productsPublished: myProducts.length,
                activeProducts: activeProducts.length
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const updatedUser = await getUserProfile(user.id);
            setCurrentUser(updatedUser);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const transactions = await getUserTransactions(user.id);

            const activity = transactions.slice(0, 10).map(t => {
                const isVenta = t.seller_id === user.id;
                return {
                    id: t.id,
                    type: isVenta ? 'venta' : 'compra',
                    product: t.product_name,
                    counterpart: isVenta ? t.buyer_name : t.seller_name,
                    amount: isVenta ? parseFloat(t.amount) : -parseFloat(t.amount),
                    date: new Date(t.created_at).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
            });

            setRecentActivity(activity);

            const purchases = transactions.filter(t => t.buyer_id === user.id);
            const sales = transactions.filter(t => t.seller_id === user.id);

            const weeklyIncome = sales.reduce((sum, t) => sum + parseFloat(t.amount), 0);
            const weeklyExpenses = purchases.reduce((sum, t) => sum + parseFloat(t.amount), 0);

            setStats(prev => ({
                ...prev,
                productsSold: sales.length,
                purchasesMade: purchases.length,
                weeklyIncome,
                weeklyExpenses
            }));
        } catch (error) {
            console.error('Error fetching recent activity:', error);
        }
    };

    const fetchPopularProducts = async () => {
        try {
            const data = await getPopularProducts();
            setPopularProducts(data);
        } catch (error) {
            console.error('Error fetching popular products:', error);
        }
    };

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            fetchProducts();
            fetchUserProfile();
            fetchRecentActivity();
            fetchPopularProducts();
        }
    }, [user]);

    const getCurrentDate = () => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date().toLocaleDateString('es-ES', options);
        return date.charAt(0).toUpperCase() + date.slice(1);
    };

    return (
        <div className="min-h-screen bg-background py-8 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Buenos días, {currentUser.name}</h1>
                    <p className="text-slate-500 capitalize">{getCurrentDate()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Balance Card - Andean Gradient */}
                        <div className="bg-andean-gradient rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-slide-up animate-pulse-glow">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <i className="bi bi-coin text-9xl transform rotate-12 translate-x-4 -translate-y-4"></i>
                            </div>
                            <div className="absolute inset-0 animate-shimmer opacity-20"></div>
                            <div className="relative z-10">
                                <p className="text-white/80 font-medium mb-2 flex items-center">
                                    <i className="bi bi-wallet2 mr-2"></i>
                                    Saldo Actual
                                </p>
                                <h2 className="text-6xl font-bold mb-4 animate-float">{parseFloat(currentUser.balance).toFixed(2)} <span className="text-2xl font-normal">TC</span></h2>
                                <div className="flex items-center bg-white/20 backdrop-blur-sm w-fit px-4 py-2 rounded-full text-sm font-medium">
                                    <i className="bi bi-graph-up-arrow mr-2 text-amarillo-sol"></i>
                                    <span>+{stats.weeklyIncome.toFixed(0)} TC esta semana</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row - Colorful Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up-delay-1">
                            <div className="bg-gradient-to-br from-verde-puna to-verde-puna-dark p-6 rounded-xl shadow-lg border-2 border-verde-puna-light/30 flex flex-col items-center text-center hover-lift animate-float text-white">
                                <div className="mb-3 bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                    <i className="bi bi-bag-check text-3xl"></i>
                                </div>
                                <h3 className="text-4xl font-bold mb-1">{stats.productsSold}</h3>
                                <p className="text-xs text-white/80 uppercase tracking-wider font-medium">Productos Vendidos</p>
                            </div>
                            <div className="bg-gradient-to-br from-naranja-inca to-terracota p-6 rounded-xl shadow-lg border-2 border-naranja-inca-light/30 flex flex-col items-center text-center hover-lift animate-float text-white" style={{ animationDelay: '0.5s' }}>
                                <div className="mb-3 bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                    <i className="bi bi-cart text-3xl"></i>
                                </div>
                                <h3 className="text-4xl font-bold mb-1">{stats.purchasesMade}</h3>
                                <p className="text-xs text-white/80 uppercase tracking-wider font-medium">Compras Realizadas</p>
                            </div>
                            <div className="bg-gradient-to-br from-purpura-mistico to-purpura-mistico-dark p-6 rounded-xl shadow-lg border-2 border-purpura-mistico-light/30 flex flex-col items-center text-center hover-lift animate-float text-white" style={{ animationDelay: '1s' }}>
                                <div className="mb-3 bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                    <i className="bi bi-box-seam text-3xl"></i>
                                </div>
                                <h3 className="text-4xl font-bold mb-1">{stats.activeProducts}</h3>
                                <p className="text-xs text-white/80 uppercase tracking-wider font-medium">Productos Activos</p>
                            </div>
                        </div>

                        {/* Actions Row - Vibrant Buttons */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-slide-up-delay-2">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                <i className="bi bi-lightning-charge-fill text-amarillo-sol mr-2"></i>
                                Acciones Rápidas
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link to="/create-product" className="flex items-center justify-center p-4 bg-gradient-to-r from-rojo-andino to-rojo-andino-light text-white rounded-xl hover:scale-[1.05] transition-all font-bold shadow-lg shadow-rojo-andino/30 hover:shadow-xl">
                                    <i className="bi bi-plus-circle-fill mr-2"></i> Publicar Producto
                                </Link>
                                <Link to="/products" className="flex items-center justify-center p-4 bg-gradient-to-r from-azul-lago to-azul-lago-light text-white rounded-xl hover:scale-[1.05] transition-all font-bold shadow-lg shadow-azul-lago/30 hover:shadow-xl">
                                    <i className="bi bi-shop mr-2"></i> Ver Productos
                                </Link>
                                <Link to="/history" className="flex items-center justify-center p-4 bg-gradient-to-r from-amarillo-sol to-naranja-inca text-white rounded-xl hover:scale-[1.05] transition-all font-bold shadow-lg shadow-amarillo-sol/30 hover:shadow-xl">
                                    <i className="bi bi-clock-history mr-2"></i> Historial
                                </Link>
                                <Link to="/profile" className="flex items-center justify-center p-4 bg-gradient-to-r from-purpura-mistico to-purpura-mistico-light text-white rounded-xl hover:scale-[1.05] transition-all font-bold shadow-lg shadow-purpura-mistico/30 hover:shadow-xl">
                                    <i className="bi bi-person-circle mr-2"></i> Mi Perfil
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Row - Popular & Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Popular Products */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4">Productos Populares</h3>
                                <div className="space-y-4">
                                    {popularProducts.length === 0 ? (
                                        <p className="text-slate-500 text-sm">No hay datos de ventas aún.</p>
                                    ) : (
                                        popularProducts.map((product, index) => (
                                            <div key={index} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="flex items-center">
                                                    {product.image_url && (
                                                        <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-slate-800">{product.name}</p>
                                                        <p className="text-xs text-slate-500">{product.sales} ventas</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-secondary">{product.price} TC</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Weekly Summary */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4">Resumen Semanal</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Ingresos esta semana</span>
                                        <span className="font-bold text-secondary">+{stats.weeklyIncome.toFixed(0)} TC</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Gastos esta semana</span>
                                        <span className="font-bold text-red-500">-{stats.weeklyExpenses.toFixed(0)} TC</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="font-bold text-slate-900">Balance neto</span>
                                        <span className={`font-bold ${(stats.weeklyIncome - stats.weeklyExpenses) >= 0 ? 'text-secondary' : 'text-red-500'}`}>
                                            {(stats.weeklyIncome - stats.weeklyExpenses) > 0 ? '+' : ''}
                                            {(stats.weeklyIncome - stats.weeklyExpenses).toFixed(0)} TC
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Activity) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900">Actividad Reciente</h3>
                                <i className="bi bi-activity text-slate-400"></i>
                            </div>
                            <div className="p-4">
                                <div className="space-y-6 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                                    {recentActivity.length === 0 ? (
                                        <p className="text-center text-slate-500 py-4">No hay actividad reciente</p>
                                    ) : (
                                        recentActivity.map((activity) => (
                                            <div key={activity.id} className="relative pl-10">
                                                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-md ${activity.type === 'venta' ? 'bg-gradient-to-br from-verde-puna to-verde-puna-dark' : 'bg-gradient-to-br from-naranja-inca to-terracota'}`}>
                                                    <i className={`bi ${activity.type === 'venta' ? 'bi-graph-up-arrow' : 'bi-cart'} text-white text-xs`}></i>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {activity.type === 'venta' ? `Vendiste "${activity.product}"` : `Compraste "${activity.product}"`}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mb-1">
                                                        {activity.type === 'venta' ? `a ${activity.counterpart}` : `de ${activity.counterpart}`}
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-slate-400">{activity.date}</span>
                                                        <span className={`text-xs font-bold ${activity.type === 'venta' ? 'text-secondary' : 'text-red-500'}`}>
                                                            {activity.type === 'venta' ? '+' : ''}{activity.amount} TC
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
