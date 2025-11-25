import React, { useEffect, useState } from 'react';
import { getUserTransactions } from '../api';
import { Link } from 'react-router-dom';

const History = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getUserTransactions(user.id);
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user.id]);

    // Calculate Summary Stats
    const totalEarned = transactions
        .filter(t => t.seller_id === user.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalSpent = transactions
        .filter(t => t.buyer_id === user.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Filter Transactions
    const filteredTransactions = transactions.filter(t => {
        const isSale = t.seller_id === user.id;
        const typeMatch = filterType === 'all' || (filterType === 'sale' ? isSale : !isSale);
        // For now, assume all are 'completed' as we don't have a status column in DB yet, 
        // but we'll add the logic for future proofing or if we add it later.
        // The reference image shows "Completada" / "Pendiente". 
        // We'll simulate status based on logic or just show completed for now.
        const statusMatch = filterStatus === 'all' || 'completed' === filterStatus;

        const date = new Date(t.transaction_date);
        const fromMatch = !dateFrom || date >= new Date(dateFrom);
        const toMatch = !dateTo || date <= new Date(dateTo + 'T23:59:59');

        return typeMatch && statusMatch && fromMatch && toMatch;
    });

    return (
        <div className="min-h-screen bg-background py-8 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Historial de Transacciones</h1>
                        <p className="text-slate-500">Revisa todas tus compras y ventas en el marketplace</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/dashboard" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center">
                            <i className="bi bi-grid mr-2"></i> Dashboard
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-sm text-slate-500 mb-1">Total Ganado</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">{totalEarned.toFixed(0)} TC</h3>
                                <p className="text-xs text-slate-400">Tayacoins por ventas</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-sm text-slate-500 mb-1">Total Gastado</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">{totalSpent.toFixed(0)} TC</h3>
                                <p className="text-xs text-slate-400">Tayacoins en compras</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                <i className="bi bi-graph-down-arrow"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-sm text-slate-500 mb-1">Transacciones</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">{transactions.length}</h3>
                                <p className="text-xs text-slate-400">Total de operaciones</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                                <i className="bi bi-activity"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-700">Tipo de transacción</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="all">Todas las transacciones</option>
                                <option value="sale">Ventas</option>
                                <option value="purchase">Compras</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-700">Estado</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="completed">Completada</option>
                                <option value="pending">Pendiente</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-700">Fecha desde</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-700">Fecha hasta</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFilterType('all'); setFilterStatus('all'); setDateFrom(''); setDateTo(''); }}
                            className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                        >
                            <i className="bi bi-x-lg mr-1"></i> Limpiar
                        </button>
                        <button className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium shadow-sm">
                            <i className="bi bi-download mr-2"></i> Exportar
                        </button>
                    </div>
                </div>

                <p className="text-sm text-slate-500 mb-4">Mostrando {filteredTransactions.length} de {transactions.length} transacciones</p>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <i className="bi bi-search text-3xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No se encontraron resultados</h3>
                            <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contraparte</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Monto</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTransactions.map((transaction) => {
                                        const isSale = transaction.seller_id === user.id;
                                        return (
                                            <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {new Date(transaction.transaction_date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${isSale ? 'text-green-600' : 'text-red-600'}`}>
                                                        <i className={`bi ${isSale ? 'bi-currency-dollar' : 'bi-cart'}`}></i>
                                                        {isSale ? 'Venta' : 'Compra'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                            {transaction.product_image ? (
                                                                <img src={transaction.product_image} alt={transaction.product_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                    <i className="bi bi-image"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{transaction.product_name}</p>
                                                            <p className="text-xs text-slate-500">Cantidad: {transaction.quantity} {transaction.product_unit || 'unidades'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {isSale ? transaction.buyer_name : transaction.seller_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className={`text-sm font-bold ${isSale ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isSale ? '+' : '-'}{parseFloat(transaction.amount).toFixed(2)} TC
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Completada
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button className="text-slate-400 hover:text-primary transition-colors flex items-center justify-end gap-1 ml-auto">
                                                        <i className="bi bi-chevron-down"></i> Detalles
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
