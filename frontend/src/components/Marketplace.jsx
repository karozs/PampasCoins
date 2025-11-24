import React, { useEffect, useState } from 'react';
import { getProducts, buyProduct, getUserProfile } from '../api';
import RateSellerModal from './RateSellerModal';
import { Link } from 'react-router-dom';

const Marketplace = ({ user, updateUser }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(user);
    const [showRateModal, setShowRateModal] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchProducts();
        fetchUserProfile();
    }, []);
    useEffect(() => {
        applyFilters();
    }, [products, searchTerm, minPrice, maxPrice, sortBy, selectedCategory]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            // Show all available products
            const availableProducts = data.filter(p => p.status === 'available');
            setProducts(availableProducts);
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
            if (updateUser) {
                updateUser(updatedUser);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Search by name
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by price range
        if (minPrice !== '') {
            filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
        }
        if (maxPrice !== '') {
            filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
        }

        // Sort
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'price_asc':
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price_desc':
                filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const handleBuy = async (product) => {
        if (parseFloat(currentUser.balance) < parseFloat(product.price)) {
            alert('❌ Saldo insuficiente. Necesitas ' + product.price + ' TC pero solo tienes ' + parseFloat(currentUser.balance).toFixed(0) + ' TC');
            return;
        }

        if (!window.confirm(`¿Confirmas la compra de "${product.name}" por ${product.price} TC?`)) return;

        try {
            const result = await buyProduct({
                product_id: product.id,
                buyer_id: user.id
            });

            // Prepare transaction object for rating modal
            setCurrentTransaction({
                seller_id: product.seller_id,
                buyer_id: user.id,
                seller_name: product.seller_name,
                product_name: product.name
            });

            fetchProducts();
            fetchUserProfile();
            setShowRateModal(true);

        } catch (error) {
            console.error('Purchase error:', error);
            alert('❌ Error al comprar: ' + (error.response?.data?.error || error.message));
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setMinPrice('');
        setMaxPrice('');
        setMaxPrice('');
        setSortBy('recent');
        setSelectedCategory('All');
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Marketplace</h1>
                        <p className="text-slate-500">Explora y compra productos de la comunidad</p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-64"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                        </div>

                        <select
                            className="px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">Todas las categorías</option>
                            <option value="Tubérculos">Tubérculos</option>
                            <option value="Cereales">Cereales</option>
                            <option value="Legumbres">Legumbres</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Verduras">Verduras</option>
                            <option value="Otros">Otros</option>
                        </select>

                        <select
                            className="px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="recent">Más recientes</option>
                            <option value="price_asc">Precio: Menor a Mayor</option>
                            <option value="price_desc">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                        <i className="bi bi-search text-4xl text-slate-300 mb-4 block"></i>
                        <p className="text-slate-500">No se encontraron productos disponibles.</p>
                        <button onClick={clearFilters} className="mt-4 text-primary font-bold hover:underline">
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="h-48 bg-slate-100 relative">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <i className="bi bi-image text-4xl"></i>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold text-primary shadow-sm">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </div>
                                    {product.category && (
                                        <div className="absolute top-2 left-2 bg-secondary/90 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                            {product.category}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                                        <span className="font-bold text-secondary whitespace-nowrap ml-2">{parseFloat(product.price).toFixed(0)} TC</span>
                                    </div>

                                    <p className="text-sm text-slate-500 mb-3 line-clamp-2 flex-1">{product.description}</p>

                                    {/* Stock Badge */}
                                    <div className="mb-3">
                                        {product.quantity === 1 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                                                <i className="bi bi-exclamation-triangle-fill mr-1"></i>
                                                ¡Última unidad!
                                            </span>
                                        ) : product.quantity <= 5 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                <i className="bi bi-box-seam mr-1"></i>
                                                Stock: {product.quantity} unidades
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <i className="bi bi-check-circle-fill mr-1"></i>
                                                Stock: {product.quantity} unidades
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
                                                {product.seller_image ? (
                                                    <img src={product.seller_image} alt={product.seller_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    product.seller_name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <Link to={`/profile/${product.seller_id}`} className="text-xs text-slate-500 hover:text-primary hover:underline">
                                                {product.seller_name}
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => handleBuy(product)}
                                            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                                        >
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rate Seller Modal */}
            {showRateModal && currentTransaction && (
                <RateSellerModal
                    transaction={currentTransaction}
                    onClose={() => setShowRateModal(false)}
                    onRate={() => {
                        // Optional: Refresh data or show success message
                    }}
                />
            )}
        </div>
    );
};

export default Marketplace;
