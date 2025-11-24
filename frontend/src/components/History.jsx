import React, { useEffect, useState } from 'react';
import { getUserTransactions } from '../api';
import { Link } from 'react-router-dom';

const History = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-primary mb-2 transition-colors">
                            <i className="bi bi-arrow-left mr-2"></i>
                            Volver al Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Historial de Transacciones</h1>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <i className="bi bi-clock-history text-4xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No hay transacciones</h3>
                            <p className="text-slate-500">Aún no has realizado ninguna compra o venta.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {transactions.map((transaction) => {
                                const isSale = transaction.seller_id === user.id;
                                return (
                                    <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center space-x-4 w-full md:w-auto">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isSale ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-500'}`}>
                                                <i className={`bi ${isSale ? 'bi-arrow-down-left' : 'bi-arrow-up-right'} text-xl`}></i>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">
                                                    {isSale ? 'Venta realizada' : 'Compra realizada'}
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    {transaction.type === 'purchase' ? 'Vendedor: ' : 'Comprador: '}
                                                    <Link to={`/profile/${transaction.type === 'purchase' ? transaction.seller_id : transaction.buyer_id}`} className="text-primary hover:underline">
                                                        {transaction.type === 'purchase' ? transaction.seller_name : transaction.buyer_name}
                                                    </Link>
                                                </p>
                                                <p className="text-slate-400 text-xs mt-1">
                                                    {new Date(transaction.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right w-full md:w-auto">
                                            <span className={`text-2xl font-bold ${isSale ? 'text-secondary' : 'text-red-500'}`}>
                                                {isSale ? '+' : '-'}{parseFloat(transaction.amount).toFixed(2)} TC
                                            </span>
                                            <div className="text-xs text-slate-400 mt-1">
                                                ID: #{transaction.id.toString().padStart(6, '0')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
