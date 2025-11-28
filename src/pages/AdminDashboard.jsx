import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(''); // Main image
    const [images, setImages] = useState([]); // Additional images
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [categories, setCategories] = useState(['Electrónica', 'Cámaras', 'Laptops', 'Accesorios', 'Paneles Solares']);
    const [selectedNotification, setSelectedNotification] = useState(null);

    //
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    // Category Management States
    const [showCategoryManagement, setShowCategoryManagement] = useState(false);
    const [categoryStats, setCategoryStats] = useState({});
    const [newCategoryName, setNewCategoryName] = useState('');
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);

    const openWhatsApp = (phone) => {
        if (!phone) return;
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/52${cleanPhone}`, '_blank');
    };

    const openEmail = (email, type, clientName) => {
        if (!email) return;
        let subject = 'Respuesta a solicitud Conexa';
        if (type === 'instalacion_camaras') subject = `Cotización de Cámaras - ${clientName}`;
        else if (type === 'mantenimiento') subject = `Soporte Técnico - ${clientName}`;
        else if (type === 'service_request') subject = `Instalación de Internet - ${clientName}`;

        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    };

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchNotifications();
    }, []);

    useEffect(() => {
        // Close notifications dropdown when clicking outside
        const handleClickOutside = (event) => {
            // If modal is open, do not close the dropdown
            if (selectedNotification) return;

            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedNotification]);

    useEffect(() => {
        if (showCategoryManagement) {
            fetchCategoryStats();
        }
    }, [showCategoryManagement]);


    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files);

        // Check limit
        const currentTotal = images.length + files.length;
        if (currentTotal > 6) {
            alert('Solo puedes subir un máximo de 6 imágenes por producto.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file); // Changed from 'image' to 'images'
        });

        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post('/upload', formData, config);

            // Backend returns Cloudinary URLs directly, no need to prepend localhost
            setImages(prev => [...prev, ...data]);

            // Set first image as main if none exists
            if (!image && data.length > 0) {
                setImage(data[0]);
            }

            setUploading(false);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error al subir imágenes: ' + (error.response?.data?.message || error.message));
            setUploading(false);
        }
    };

    const removeImage = (imgToRemove) => {
        // Prevent deletion if only one image remains
        if (images.length <= 1) {
            alert('Debe haber al menos una imagen para el producto.');
            return;
        }

        const updatedImages = images.filter(img => img !== imgToRemove);
        setImages(updatedImages);

        // If we removed the main image, set a new one if available
        if (image === imgToRemove) {
            setImage(updatedImages.length > 0 ? updatedImages[0] : '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate at least one image
        if (images.length === 0) {
            alert('Debe subir al menos una imagen para el producto.');
            return;
        }

        const productData = {
            name,
            price: Number(price),
            description,
            image: images.length > 0 ? images[0] : image, // Ensure main image is set
            images,
            brand,
            category,
            countInStock: Number(countInStock),
        };

        try {
            if (isEditing) {
                await api.put(`/products/${editProductId}`, productData);
                alert('Producto actualizado correctamente');
            } else {
                await api.post('/products', productData);
                alert('Producto creado correctamente');
            }

            // Reset form
            setName('');
            setPrice('');
            setDescription('');
            setImage('');
            setImages([]);
            setBrand('');
            setCategory('');
            setCountInStock('');
            setIsEditing(false);
            setEditProductId(null);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setEditProductId(product._id);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setImage(product.image);
        setImages(product.images || [product.image]);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
                alert('Producto eliminado');
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            console.log('📦 Orders fetched:', data.map(o => ({ id: o._id.slice(-6), status: o.status })));
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Orden actualizada a: ${newStatus}`);
            fetchOrders(); // Reload orders
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Error al actualizar orden');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Category Management Functions
    const fetchCategoryStats = async () => {
        try {
            const { data } = await api.get('/categories/stats');
            setCategoryStats(data);
        } catch (error) {
            console.error('Error fetching category stats:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            alert('El nombre de la categoría no puede estar vacío');
            return;
        }

        try {
            await api.post('/categories', { name: newCategoryName.trim() });
            setCategories([...categories, newCategoryName.trim()]);
            setNewCategoryName('');
            alert('Categoría agregada exitosamente');
            fetchCategoryStats();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al agregar categoría');
        }
    };

    const handleDeleteCategory = (categoryName) => {
        const stats = categoryStats[categoryName];

        // If category has no stats, it means there are no products - allow deletion
        if (!stats) {
            setDeletingCategory(categoryName);
            setShowDeleteModal(true);
            return;
        }

        if (stats.productsInStock > 0) {
            alert('No se puede eliminar esta categoría porque tiene productos con stock disponible. Primero debes agotar o eliminar los productos con stock.');
            return;
        }

        setDeletingCategory(categoryName);
        setShowDeleteModal(true);
    };

    const confirmDeleteCategory = async () => {
        try {
            const response = await api.delete(`/categories/${encodeURIComponent(deletingCategory)}`);
            alert(response.data.message);

            // Update categories list
            setCategories(categories.filter(c => c !== deletingCategory));

            // Refresh products and stats
            fetchProducts();
            fetchCategoryStats();

            setShowDeleteModal(false);
            setDeletingCategory(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Error al eliminar categoría');
        }
    };

    const handleEditCategory = (categoryName) => {
        setEditingCategory(categoryName);
        setEditCategoryName(categoryName);
        setShowEditModal(true);
    };

    const confirmEditCategory = async () => {
        if (!editCategoryName.trim()) {
            alert('El nombre de la categoría no puede estar vacío');
            return;
        }

        if (editCategoryName.trim() === editingCategory) {
            alert('El nuevo nombre es igual al anterior');
            return;
        }

        try {
            const response = await api.put(`/categories/${encodeURIComponent(editingCategory)}`, {
                newName: editCategoryName.trim()
            });

            alert(response.data.message + ` (${response.data.updatedProducts} productos actualizados)`);

            // Update categories list
            setCategories(categories.map(c => c === editingCategory ? editCategoryName.trim() : c));

            // Refresh products and stats
            fetchProducts();
            fetchCategoryStats();

            setShowEditModal(false);
            setEditingCategory(null);
            setEditCategoryName('');
        } catch (error) {
            alert(error.response?.data?.message || 'Error al editar categoría');
        }
    };



    const generatePDF = async () => {
        try {
            const doc = new jsPDF();
            // Load images
            const getBase64Image = (url) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        // Increased resolution for better quality
                        canvas.width = 150;
                        canvas.height = 150;
                        const ctx = canvas.getContext('2d');
                        // Draw image maintaining aspect ratio (cover)
                        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                        const x = (canvas.width / 2) - (img.width / 2) * scale;
                        const y = (canvas.height / 2) - (img.height / 2) * scale;
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                        try {
                            resolve(canvas.toDataURL('image/jpeg', 0.8)); // Higher quality
                        } catch (e) {
                            resolve(null);
                        }
                    };
                    img.onerror = () => resolve(null);
                    img.src = url;
                });
            };

            const productsWithImages = await Promise.all(
                products.map(async (product) => {
                    const base64Image = await getBase64Image(product.image);
                    return { ...product, base64Image };
                })
            );

            const tableRows = productsWithImages.map(p => [
                '', // Image placeholder
                p.name, // Full name, no truncation
                p.category,
                '$' + p.price.toLocaleString('es-MX'),
                p.countInStock,
                p.brand || '-'
            ]);

            autoTable(doc, {
                head: [['Img', 'Producto', 'Categoría', 'Precio', 'Stock', 'Marca']],
                body: tableRows,
                startY: yPosition,
                theme: 'grid',
                headStyles: { fillColor: [30, 64, 175], textColor: 255 },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    valign: 'middle',
                    minCellHeight: 15 // Ensure enough height for image
                },
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 60, overflow: 'linebreak' }, // Allow wrapping
                    2: { cellWidth: 30 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 30 }
                },
                didDrawCell: (data) => {
                    if (data.section === 'body' && data.column.index === 0) {
                        const product = productsWithImages[data.row.index];
                        if (product.base64Image) {
                            try {
                                doc.addImage(
                                    product.base64Image,
                                    'JPEG',
                                    data.cell.x + 1,
                                    data.cell.y + 1,
                                    13,
                                    13
                                );
                            } catch (e) {
                                console.error('Error adding image:', e);
                            }
                        }
                    }
                },
                margin: { top: 10 }
            });

            // Footer on last page
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Conexa Store - Página ${i} de ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                );
            }

            doc.save(`Reporte_Inventario_Conexa_${new Date().toISOString().split('T')[0]}.pdf`);
            alert('✅ PDF generado correctamente con estadísticas completas');
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('❌ Error al generar el PDF: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16">
                        <div className="flex items-center">
                            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Admin Panel</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Notifications Bell */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 text-gray-600 hover:text-gray-800 relative focus:outline-none"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                            <h3 className="text-sm font-semibold text-gray-700">Notificaciones</h3>
                                            <button
                                                onClick={fetchNotifications}
                                                className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                Actualizar
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                    No hay notificaciones
                                                </div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification._id}
                                                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                                        onClick={() => setSelectedNotification(notification)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {notification.type === 'service_request' ? 'Solicitud de Servicio' :
                                                                        notification.type === 'order' ? 'Nueva Orden' : 'Notificación'}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(notification.createdAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            {!notification.read && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        markAsRead(notification._id);
                                                                    }}
                                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                                >
                                                                    Marcar leído
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            <p><span className="font-medium">Cliente:</span> {notification.data.nombre}</p>
                                                            <p><span className="font-medium">Tel:</span> {notification.data.telefono}</p>
                                                            {notification.data.tipo && <p><span className="font-medium">Tipo:</span> {notification.data.tipo}</p>}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/tienda" className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm md:text-base">
                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                <span className="hidden sm:inline">Ver Tienda</span>
                            </Link>
                            <span className="text-gray-500 text-sm md:text-base hidden sm:inline">Hola, {user?.name}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-4 md:py-6 px-4 sm:px-6 lg:px-8">
                {/* Stats / Actions */}
                <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-base md:text-lg font-medium text-gray-900">Gestión de Productos</h2>
                        <p className="text-xs md:text-sm text-gray-500">Añade, edita o elimina productos del catálogo.</p>
                    </div>
                    <button
                        onClick={generatePDF}
                        className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors flex items-center justify-center text-sm md:text-base"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="hidden sm:inline">Descargar Reporte PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-4 md:p-6 lg:sticky lg:top-6">
                            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-4">
                                {isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input
                                            type="number"
                                            value={countInStock}
                                            onChange={(e) => setCountInStock(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Marca</label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Imágenes (Máx 6)</label>
                                    <input
                                        type="file"
                                        onChange={uploadFileHandler}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        multiple
                                        disabled={images.length >= 6}
                                    />
                                    {uploading && <p className="text-sm text-blue-500 mt-2">Subiendo...</p>}
                                    {images.length >= 6 && <p className="text-xs text-red-500 mt-1">Has alcanzado el límite de 6 imágenes.</p>}

                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img src={img} alt={`Preview ${index}`} className="h-20 w-full object-cover rounded-md border" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(img)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        {isEditing ? 'Actualizar' : 'Crear Producto'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditProductId(null);
                                                setName('');
                                                setPrice('');
                                                setDescription('');
                                                setImage('');
                                                setImages([]);
                                                setBrand('');
                                                setCategory('');
                                                setCountInStock('');
                                            }}
                                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg overflow-x-auto -mx-4 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200">
                                {/* Mobile: minimum width to enable horizontal scroll */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                                        <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                                                        <img className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover" src={product.image} alt="" />
                                                    </div>
                                                    <div className="ml-2 md:ml-4">
                                                        <div className="text-xs md:text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500">{product.brand}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <div className="text-xs md:text-sm text-gray-900">${product.price}</div>
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.countInStock}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                                                {product.category}
                                            </td>
                                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-2 md:mr-4"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Management Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => setShowCategoryManagement(!showCategoryManagement)}
                    className="mb-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md"
                >
                    📁 {showCategoryManagement ? 'Ocultar' : 'Mostrar'} Gestión de Categorías
                </button>

                {showCategoryManagement && (
                    <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
                        <h2 className="text-2xl  font-bold text-gray-800 border-b pb-3">Gestión de Categorías</h2>

                        {/* Add New Category */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Agregar Nueva Categoría</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nombre de la categoría..."
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    Añadir
                                </button>
                            </div>
                        </div>

                        {/* Existing Categories */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Categorías Existentes</h3>
                            <div className="space-y-2">
                                {categories.map((cat) => {
                                    const stats = categoryStats[cat];
                                    const hasProducts = stats && stats.totalProducts > 0;
                                    const hasStock = stats && stats.productsInStock > 0;

                                    return (
                                        <div key={cat} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{cat}</p>
                                                {hasProducts && (
                                                    <p className="text-sm text-gray-500">
                                                        {stats.totalProducts} producto{stats.totalProducts !== 1 ? 's' : ''}
                                                        {stats.productsInStock > 0 && (
                                                            <span className="text-green-600"> • {stats.productsInStock} en stock</span>
                                                        )}
                                                        {stats.productsOutOfStock > 0 && (
                                                            <span className="text-gray-400"> • {stats.productsOutOfStock} sin stock</span>
                                                        )}
                                                    </p>
                                                )}
                                                {!hasProducts && (
                                                    <p className="text-sm text-gray-400">Sin productos</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {/* Edit Button - Always Active */}
                                                <button
                                                    onClick={() => handleEditCategory(cat)}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm px-3 py-1 rounded-md border border-blue-200 transition-colors font-medium"
                                                >
                                                    ✏️ Editar
                                                </button>

                                                {/* Delete Button - Conditional */}
                                                {hasStock ? (
                                                    <button
                                                        disabled
                                                        className="text-gray-400 cursor-not-allowed text-sm px-3 py-1 rounded-md border border-gray-300"
                                                        title="No se puede eliminar mientras tenga productos con stock"
                                                    >
                                                        🗑️ Bloqueado
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat)}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 text-sm px-3 py-1 rounded-md border border-red-200 transition-colors font-medium"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Category Confirmation Modal */}
            {showDeleteModal && deletingCategory && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Confirmar Eliminación</h3>
                        <p className="text-gray-700 mb-2">
                            ¿Seguro que quieres eliminar la categoría "<strong>{deletingCategory}</strong>"?
                        </p>

                        {categoryStats[deletingCategory]?.productsOutOfStock > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-yellow-800 font-medium mb-2">
                                    Los siguientes productos serán eliminados permanentemente:
                                </p>
                                <ul className="list-disc list-inside text-sm text-yellow-700">
                                    {categoryStats[deletingCategory].products.map((p) => (
                                        <li key={p._id}>{p.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletingCategory(null);
                                }}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteCategory}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                            >
                                Eliminar Categoría
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {showEditModal && editingCategory && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">✏️ Editar Categoría</h3>
                        <p className="text-gray-700 mb-4">
                            Editando: "<strong>{editingCategory}</strong>"
                        </p>

                        {categoryStats[editingCategory] && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800">
                                    ℹ️ <strong>{categoryStats[editingCategory].totalProducts}</strong> producto(s) se actualizarán con el nuevo nombre
                                </p>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nuevo nombre:
                            </label>
                            <input
                                type="text"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                                placeholder="Escribe el nuevo nombre..."
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingCategory(null);
                                    setEditCategoryName('');
                                }}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmEditCategory}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* Orders Management Section */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Gestión de Órdenes</h2>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método Pago</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                        No hay órdenes registradas
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono">#{order._id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">{order.user?.name || 'Sin nombre'}</p>
                                                <p className="text-gray-500">{order.user?.email || 'Sin email'}</p>
                                                <p className="text-gray-500">{order.user?.phone || 'Sin teléfono'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-xs text-gray-600 max-w-xs">
                                                <p>{order.shippingAddress.street} {order.shippingAddress.extNumber}</p>
                                                <p>{order.shippingAddress.colony}, {order.shippingAddress.city}</p>
                                                <p>{order.shippingAddress.state}, CP {order.shippingAddress.zipCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold">${order.totalPrice.toFixed(2)}</span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {order.paymentMethod === 'PayPal' ? (
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">💳 PayPal</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">💵 Efectivo</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {order.status === 'Pendiente' && (
                                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">🟡 Pendiente</span>
                                            )}
                                            {order.status === 'Procesando' && (
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">🔵 Procesando</span>
                                            )}
                                            {order.status === 'En Reparto' && (
                                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">🟣 En Reparto</span>
                                            )}
                                            {order.status === 'Entregado' && (
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">🟢 Entregado</span>
                                            )}
                                            {order.status === 'Cancelada' && (
                                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">🔴 Cancelada</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            {order.status === 'Pendiente' || order.status === 'Procesando' ? (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'En Reparto')}
                                                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-xs"
                                                >
                                                    🚚 Iniciar Reparto
                                                </button>
                                            ) : order.status === 'En Reparto' ? (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'Entregado')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                                                >
                                                    ✅ Marcar Entregado
                                                </button>
                                            ) : order.status === 'Cancelada' ? (
                                                <span className="text-red-500 text-xs font-medium">❌ Cancelada</span>
                                            ) : (
                                                <span className="text-green-600 text-xs font-medium">✅ Completado</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>



            {/* Notification Details Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl transform transition-all scale-100 relative">
                        <button
                            onClick={() => setSelectedNotification(null)}
                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 pr-10">
                            Detalles de la Solicitud
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Cliente</p>
                                    <p className="font-medium text-gray-900">{selectedNotification.data.nombre || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fecha</p>
                                    <p className="font-medium text-gray-900">{new Date(selectedNotification.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Tipo de Servicio</p>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold mt-1">
                                    {selectedNotification.data.tipo || selectedNotification.type}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Teléfono</p>
                                        <p className="font-medium text-gray-900">{selectedNotification.data.telefono || 'N/A'}</p>
                                    </div>
                                    {selectedNotification.data.telefono && (
                                        <button
                                            onClick={() => openWhatsApp(selectedNotification.data.telefono)}
                                            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded-lg text-sm transition-colors font-medium"
                                        >
                                            <FaWhatsapp className="text-lg" />
                                            WhatsApp
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Correo</p>
                                        <p className="font-medium text-gray-900">{selectedNotification.data.correo || 'N/A'}</p>
                                    </div>
                                    {selectedNotification.data.correo && (
                                        <button
                                            onClick={() => openEmail(selectedNotification.data.correo, selectedNotification.data.tipo, selectedNotification.data.nombre)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors font-medium"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Enviar Correo
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Additional Dynamic Data */}
                            <div className="border-t pt-4 mt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Información Adicional</h4>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    {Object.entries(selectedNotification.data).map(([key, value]) => {
                                        if (['nombre', 'telefono', 'correo', 'tipo', 'fecha'].includes(key)) return null;
                                        return (
                                            <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
                                                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                <span className="text-gray-900 font-medium text-right">
                                                    {Array.isArray(value) ? value.join(', ') : value.toString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
