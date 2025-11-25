import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, getProducts, getUserReviews, updateUserProfile, uploadProfilePhoto, uploadCoverImage } from '../api';
import EditProductModal from './EditProductModal';

const Profile = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const { id } = useParams();
    const isOwnProfile = !id || parseInt(id) === user.id;
    const profileId = id || user.id;

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        instagram: '',
        facebook: '',
        twitter: '',
        tiktok: ''
    });

    useEffect(() => {
        fetchData();
    }, [profileId]);

    const fetchData = async () => {
        try {
            const [profileData, productsData, reviewsData] = await Promise.all([
                getUserProfile(profileId),
                getProducts(),
                getUserReviews(profileId)
            ]);

            setProfile(profileData);
            setProducts(productsData.filter(p => p.seller_id === parseInt(profileId)));
            setReviews(reviewsData);

            // Initialize edit form with current data
            if (isOwnProfile) {
                setEditForm({
                    name: profileData.name || '',
                    bio: profileData.bio || '',
                    instagram: profileData.instagram || '',
                    facebook: profileData.facebook || '',
                    twitter: profileData.twitter || '',
                    tiktok: profileData.tiktok || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPhoto(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            await uploadProfilePhoto(user.id, formData);
            await fetchData(); // Refresh to show new photo
            alert('✅ Foto actualizada correctamente');
        } catch (error) {
            alert('❌ Error al subir la foto: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingCover(true);
        const formData = new FormData();
        formData.append('cover', file);

        try {
            await uploadCoverImage(user.id, formData);
            await fetchData();
            alert('✅ Portada actualizada correctamente');
        } catch (error) {
            alert('❌ Error al subir la portada: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingCover(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await updateUserProfile(user.id, editForm);
            await fetchData();
            setIsEditMode(false);
            alert('✅ Perfil actualizado correctamente');
        } catch (error) {
            alert('❌ Error al actualizar perfil: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        // Reset form to current profile data
        setEditForm({
            name: profile.name || '',
            bio: profile.bio || '',
            instagram: profile.instagram || '',
            facebook: profile.facebook || '',
            twitter: profile.twitter || '',
            tiktok: profile.tiktok || ''
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <i className="bi bi-exclamation-circle text-4xl text-red-500 mb-4 block"></i>
                    <p className="text-slate-500">No se pudo cargar el perfil.</p>
                </div>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-background py-8 animate-fade-in">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                    {/* Cover Image - Increased height */}
                    <div className="h-64 bg-gradient-to-br from-primary via-primary-light to-secondary relative group">
                        {profile.cover_image ? (
                            <img
                                src={`http://localhost:3000${profile.cover_image}`}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30">
                                <i className="bi bi-image text-6xl"></i>
                            </div>
                        )}
                        {isEditMode && isOwnProfile && (
                            <label className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-white/20 transition-all border border-white/20 z-20">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                    className="hidden"
                                    disabled={uploadingCover}
                                />
                                <i className={`bi ${uploadingCover ? 'bi-hourglass-split' : 'bi-camera-fill'} mr-2`}></i>
                                Cambiar Portada
                            </label>
                        )}
                    </div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
                            {/* Profile Photo - Larger and better shadow */}
                            <div className="relative flex-shrink-0">
                                <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-xl ring-4 ring-slate-100">
                                    {profile.profile_image ? (
                                        <img
                                            src={`http://localhost:3000${profile.profile_image}`}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                            <i className="bi bi-person-circle text-7xl"></i>
                                        </div>
                                    )}
                                </div>
                                {isEditMode && isOwnProfile && (
                                    <label className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-xl cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                            disabled={uploadingPhoto}
                                        />
                                        <i className={`bi ${uploadingPhoto ? 'bi-hourglass-split' : 'bi-camera-fill'}`}></i>
                                    </label>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                                {isEditMode ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="text-3xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-full"
                                            placeholder="Tu nombre"
                                        />
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                            rows="2"
                                            placeholder="Cuéntanos sobre ti..."
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{profile.name}</h1>
                                        {profile.bio && (
                                            <p className="text-slate-600 text-lg max-w-2xl">{profile.bio}</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Edit Button */}
                            {isOwnProfile && (
                                <div className="flex gap-2 flex-shrink-0">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all hover:scale-105 font-bold shadow-lg shadow-primary/20"
                                            >
                                                <i className="bi bi-check-lg mr-2"></i>Guardar
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all hover:scale-105 font-medium"
                                        >
                                            <i className="bi bi-pencil mr-2"></i>Editar Perfil
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stats Row - Modern Design */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <i className="bi bi-box-seam text-2xl text-primary"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Productos</p>
                                        <p className="text-3xl font-bold text-slate-900">{products.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                        <i className="bi bi-coin text-2xl text-green-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-700 uppercase tracking-wide">Saldo</p>
                                        <p className="text-3xl font-bold text-green-900">{parseFloat(profile.balance).toFixed(2)} <span className="text-xl">TC</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-6 border border-amber-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                        <i className="bi bi-star-fill text-2xl text-amber-500"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-amber-700 uppercase tracking-wide">Rating</p>
                                        <p className="text-3xl font-bold text-amber-900">{averageRating} <span className="text-xl text-amber-600">({reviews.length})</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        {isEditMode ? (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                                    <i className="bi bi-instagram text-pink-500 text-xl"></i>
                                    <input
                                        type="text"
                                        value={editForm.instagram}
                                        onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-slate-900"
                                        placeholder="@usuario"
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                                    <i className="bi bi-facebook text-blue-600 text-xl"></i>
                                    <input
                                        type="text"
                                        value={editForm.facebook}
                                        onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
                                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-slate-900"
                                        placeholder="facebook.com/usuario"
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                                    <i className="bi bi-twitter text-sky-500 text-xl"></i>
                                    <input
                                        type="text"
                                        value={editForm.twitter}
                                        onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-slate-900"
                                        placeholder="@usuario"
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                                    <i className="bi bi-tiktok text-black text-xl"></i>
                                    <input
                                        type="text"
                                        value={editForm.tiktok}
                                        onChange={(e) => setEditForm({ ...editForm, tiktok: e.target.value })}
                                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-slate-900"
                                        placeholder="@usuario"
                                    />
                                </div>
                            </div>
                        ) : (
                            (profile.instagram || profile.facebook || profile.twitter || profile.tiktok) && (
                                <div className="flex justify-center md:justify-start gap-3 mt-6">
                                    {profile.instagram && (
                                        <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition-colors">
                                            <i className="bi bi-instagram text-lg"></i>
                                        </a>
                                    )}
                                    {profile.facebook && (
                                        <a href={profile.facebook.startsWith('http') ? profile.facebook : `https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors">
                                            <i className="bi bi-facebook text-lg"></i>
                                        </a>
                                    )}
                                    {profile.twitter && (
                                        <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 hover:bg-sky-200 flex items-center justify-center transition-colors">
                                            <i className="bi bi-twitter text-lg"></i>
                                        </a>
                                    )}
                                    {profile.tiktok && (
                                        <a href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors">
                                            <i className="bi bi-tiktok text-lg"></i>
                                        </a>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-bold text-slate-900">Mis Productos</h2>
                    </div>
                    {products.length === 0 ? (
                        <div className="bg-white rounded-xl p-16 text-center border border-slate-100">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-box-seam text-4xl text-slate-300"></i>
                            </div>
                            <p className="text-slate-500 text-lg">No has publicado productos aún</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <div className="h-48 bg-slate-100 relative">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <i className="bi bi-image text-4xl"></i>
                                            </div>
                                        )}
                                        <div className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs font-bold ${product.status === 'sold' ? 'bg-red-500' : 'bg-green-500'} text-white shadow-sm`}>
                                            {product.status === 'sold' ? 'Vendido' : 'Disponible'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                                            <span className="font-bold text-secondary text-lg">{parseFloat(product.price).toFixed(0)} TC</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-3">Stock: {product.quantity} {product.unit || 'unidades'}</p>
                                        {isOwnProfile && (
                                            <button
                                                onClick={() => setEditingProduct(product)}
                                                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                                            >
                                                <i className="bi bi-pencil mr-2"></i>Editar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-slate-900">Reseñas ({reviews.length})</h2>
                    </div>
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-xl p-16 text-center border border-slate-100">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-star text-4xl text-amber-300"></i>
                            </div>
                            <p className="text-slate-500 text-lg">Aún no tienes reseñas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">{review.buyer_name}</p>
                                            <div className="flex text-amber-400 text-lg mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-slate-600">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={fetchData}
                />
            )}
        </div>
    );
};

export default Profile;
