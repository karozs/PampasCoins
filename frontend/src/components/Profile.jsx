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

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                    {/* Cover Image */}
                    <div className="h-48 bg-slate-200 relative">
                        {profile.cover_image ? (
                            <img
                                src={`http://localhost:3000${profile.cover_image}`}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <i className="bi bi-image text-4xl"></i>
                            </div>
                        )}
                        {isEditMode && isOwnProfile && (
                            <label className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-black/70 transition-colors backdrop-blur-sm">
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

                    <div className="p-8">
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 -mt-20">
                            {/* Profile Photo */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                                    {profile.profile_image ? (
                                        <img
                                            src={`http://localhost:3000${profile.profile_image}`}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <i className="bi bi-person-circle text-6xl"></i>
                                        </div>
                                    )}
                                </div>
                                {isEditMode && isOwnProfile && (
                                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
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
                            <div className="flex-1 text-center md:text-left">
                                {isEditMode ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="text-2xl font-bold text-slate-900 border-b-2 border-primary focus:outline-none w-full"
                                            placeholder="Tu nombre"
                                        />
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            rows="3"
                                            placeholder="Cuéntanos sobre ti..."
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
                                        {profile.bio && (
                                            <p className="text-slate-600 mb-4">{profile.bio}</p>
                                        )}
                                    </>
                                )}

                                {/* Stats */}
                                <div className="flex justify-center md:justify-start gap-6 mt-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{products.length}</p>
                                        <p className="text-xs text-slate-500">Productos</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-secondary">{parseFloat(profile.balance).toFixed(0)} TC</p>
                                        <p className="text-xs text-slate-500">Saldo</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-bronze">{averageRating} ⭐</p>
                                        <p className="text-xs text-slate-500">{reviews.length} Reseñas</p>
                                    </div>
                                </div>

                                {/* Social Media */}
                                {isEditMode ? (
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-instagram text-pink-500"></i>
                                            <input
                                                type="text"
                                                value={editForm.instagram}
                                                onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="@usuario"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-facebook text-blue-600"></i>
                                            <input
                                                type="text"
                                                value={editForm.facebook}
                                                onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="facebook.com/usuario"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-twitter text-sky-500"></i>
                                            <input
                                                type="text"
                                                value={editForm.twitter}
                                                onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="@usuario"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-tiktok text-black"></i>
                                            <input
                                                type="text"
                                                value={editForm.tiktok}
                                                onChange={(e) => setEditForm({ ...editForm, tiktok: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="@usuario"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center md:justify-start gap-3 mt-4">
                                        {profile.instagram && (
                                            <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 text-xl">
                                                <i className="bi bi-instagram"></i>
                                            </a>
                                        )}
                                        {profile.facebook && (
                                            <a href={profile.facebook.startsWith('http') ? profile.facebook : `https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-xl">
                                                <i className="bi bi-facebook"></i>
                                            </a>
                                        )}
                                        {profile.twitter && (
                                            <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 text-xl">
                                                <i className="bi bi-twitter"></i>
                                            </a>
                                        )}
                                        {profile.tiktok && (
                                            <a href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 text-xl">
                                                <i className="bi bi-tiktok"></i>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Edit Button */}
                            {isOwnProfile && (
                                <div className="flex gap-2">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-bold"
                                            >
                                                <i className="bi bi-check-lg mr-2"></i>Guardar
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                                        >
                                            <i className="bi bi-pencil mr-2"></i>Editar Perfil
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Mis Productos</h2>
                    {products.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                            <i className="bi bi-box-seam text-4xl text-slate-300 mb-4 block"></i>
                            <p className="text-slate-500">No has publicado productos aún</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-48 bg-slate-100 relative">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <i className="bi bi-image text-4xl"></i>
                                            </div>
                                        )}
                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold ${product.status === 'sold' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                                            {product.status === 'sold' ? 'Vendido' : 'Disponible'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900">{product.name}</h3>
                                            <span className="font-bold text-secondary">{parseFloat(product.price).toFixed(0)} TC</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-3">Stock: {product.quantity}</p>
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

                {/* Reviews */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Reseñas ({reviews.length})</h2>
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                            <i className="bi bi-star text-4xl text-slate-300 mb-4 block"></i>
                            <p className="text-slate-500">Aún no tienes reseñas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl p-6 border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-slate-900">{review.buyer_name}</p>
                                            <div className="flex text-yellow-400 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-slate-600 text-sm">{review.comment}</p>
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
