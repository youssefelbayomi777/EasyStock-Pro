/**
 * EasyStock Pro - Notification System
 * نظام الإشعارات والتنبيهات
 */

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.storageKey = 'easystock_notifications';
        this.loadNotifications();
        this.initializeNotificationContainer();
        
        // فحص التنبيهات كل دقيقة
        setInterval(() => this.checkAlerts(), 60000);
        
        // فحص فوري عند التهيئة
        setTimeout(() => this.checkAlerts(), 1000);
    }

    // تهيئة حاوية الإشعارات
    initializeNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2 max-w-sm';
            document.body.appendChild(container);
        }
    }

    // تحميل الإشعارات المحفوظة
    loadNotifications() {
        const saved = localStorage.getItem(this.storageKey);
        this.notifications = saved ? JSON.parse(saved) : [];
    }

    // حفظ الإشعارات
    saveNotifications() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    }

    // إضافة إشعار جديد
    addNotification(type, title, message, data = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            type, // 'info', 'success', 'warning', 'error', 'low-stock', 'out-of-stock'
            title,
            message,
            data,
            timestamp: new Date().toISOString(),
            read: false,
            dismissed: false
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        
        // عرض الإشعار المنبثق
        this.showToast(notification);
        
        // تحديث عداد الإشعارات
        this.updateNotificationBadge();
        
        return notification;
    }

    // عرض إشعار منبثق
    showToast(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `notification-toast transform transition-all duration-300 translate-x-full opacity-0 ${this.getToastClasses(notification.type)}`;
        toast.innerHTML = `
            <div class="flex items-start gap-3 p-4 rounded-lg shadow-lg border">
                <div class="flex-shrink-0">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold">${notification.title}</h4>
                    <p class="text-sm mt-1 opacity-90">${notification.message}</p>
                    <div class="text-xs mt-2 opacity-75">
                        ${new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                </div>
                <button onclick="this.closest('.notification-toast').remove()" class="flex-shrink-0 opacity-50 hover:opacity-100">
                    <span class="material-icons text-lg">close</span>
                </button>
            </div>
        `;

        container.appendChild(toast);

        // تأثير الظهور
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 100);

        // إزالة تلقائية بعد 5 ثوان (إلا للتنبيهات المهمة)
        if (!['error', 'low-stock', 'out-of-stock'].includes(notification.type)) {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.classList.add('translate-x-full', 'opacity-0');
                    setTimeout(() => toast.remove(), 300);
                }
            }, 5000);
        }
    }

    // الحصول على فئات CSS للإشعار
    getToastClasses(type) {
        const classes = {
            'info': 'bg-blue-50 text-blue-800 border-blue-200',
            'success': 'bg-green-50 text-green-800 border-green-200',
            'warning': 'bg-yellow-50 text-yellow-800 border-yellow-200',
            'error': 'bg-red-50 text-red-800 border-red-200',
            'low-stock': 'bg-orange-50 text-orange-800 border-orange-200',
            'out-of-stock': 'bg-red-50 text-red-800 border-red-200'
        };
        return classes[type] || classes.info;
    }

    // الحصول على أيقونة الإشعار
    getNotificationIcon(type) {
        const icons = {
            'info': '<span class="material-icons text-blue-600">info</span>',
            'success': '<span class="material-icons text-green-600">check_circle</span>',
            'warning': '<span class="material-icons text-yellow-600">warning</span>',
            'error': '<span class="material-icons text-red-600">error</span>',
            'low-stock': '<span class="material-icons text-orange-600">inventory</span>',
            'out-of-stock': '<span class="material-icons text-red-600">remove_shopping_cart</span>'
        };
        return icons[type] || icons.info;
    }

    // فحص التنبيهات
    checkAlerts() {
        if (!window.dataManager) return;

        const stats = dataManager.getStatistics();
        
        // فحص المنتجات منخفضة المخزون
        stats.lowStockProducts.forEach(product => {
            const existingNotification = this.notifications.find(n => 
                n.type === 'low-stock' && 
                n.data.productId === product.id &&
                !n.dismissed &&
                this.isRecentNotification(n.timestamp, 24) // خلال آخر 24 ساعة
            );

            if (!existingNotification) {
                this.addNotification(
                    'low-stock',
                    'مخزون منخفض',
                    `المنتج "${product.name}" وصل إلى الحد الأدنى (${product.quantity} متبقي)`,
                    { productId: product.id, productSku: product.sku }
                );
            }
        });

        // فحص المنتجات نافدة المخزون
        stats.outOfStockProducts.forEach(product => {
            const existingNotification = this.notifications.find(n => 
                n.type === 'out-of-stock' && 
                n.data.productId === product.id &&
                !n.dismissed &&
                this.isRecentNotification(n.timestamp, 24)
            );

            if (!existingNotification) {
                this.addNotification(
                    'out-of-stock',
                    'نفد المخزون',
                    `المنتج "${product.name}" نفد من المخزون تماماً`,
                    { productId: product.id, productSku: product.sku }
                );
            }
        });
    }

    // التحقق من كون الإشعار حديث
    isRecentNotification(timestamp, hours) {
        const notificationTime = new Date(timestamp);
        const now = new Date();
        const diffHours = (now - notificationTime) / (1000 * 60 * 60);
        return diffHours < hours;
    }

    // تحديث شارة الإشعارات
    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read && !n.dismissed).length;
        
        // البحث عن أزرار الإشعارات في الصفحة
        const notificationButtons = document.querySelectorAll('[aria-label="Notifications"], button:has(.material-icons:contains("notifications"))');
        
        notificationButtons.forEach(button => {
            // إزالة الشارة الحالية
            const existingBadge = button.querySelector('.notification-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // إضافة شارة جديدة إذا كان هناك إشعارات غير مقروءة
            if (unreadCount > 0) {
                const badge = document.createElement('span');
                badge.className = 'notification-badge absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold';
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                button.style.position = 'relative';
                button.appendChild(badge);
            }
        });
    }

    // الحصول على الإشعارات غير المقروءة
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read && !n.dismissed);
    }

    // الحصول على جميع الإشعارات
    getAllNotifications(limit = 50) {
        return this.notifications
            .filter(n => !n.dismissed)
            .slice(0, limit)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // تمييز إشعار كمقروء
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
        }
    }

    // تمييز جميع الإشعارات كمقروءة
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationBadge();
    }

    // إخفاء إشعار
    dismissNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.dismissed = true;
            this.saveNotifications();
            this.updateNotificationBadge();
        }
    }

    // مسح الإشعارات القديمة (أكثر من 30 يوم)
    cleanOldNotifications() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        this.notifications = this.notifications.filter(n => 
            new Date(n.timestamp) > thirtyDaysAgo
        );
        
        this.saveNotifications();
    }

    // عرض قائمة الإشعارات
    showNotificationPanel() {
        const existingPanel = document.getElementById('notification-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'notification-panel';
        panel.className = 'fixed top-16 right-4 w-80 max-h-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden';
        
        const notifications = this.getAllNotifications(10);
        
        panel.innerHTML = `
            <div class="p-4 border-b bg-gray-50">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-800">الإشعارات</h3>
                    <div class="flex gap-2">
                        <button onclick="notificationSystem.markAllAsRead()" class="text-xs text-blue-600 hover:text-blue-800">
                            تمييز الكل كمقروء
                        </button>
                        <button onclick="document.getElementById('notification-panel').remove()" class="text-gray-400 hover:text-gray-600">
                            <span class="material-icons text-lg">close</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="max-h-80 overflow-y-auto">
                ${notifications.length === 0 ? 
                    '<div class="p-4 text-center text-gray-500">لا توجد إشعارات</div>' :
                    notifications.map(n => `
                        <div class="p-3 border-b hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}" onclick="notificationSystem.markAsRead(${n.id})">
                            <div class="flex items-start gap-2">
                                <div class="flex-shrink-0 mt-1">
                                    ${this.getNotificationIcon(n.type)}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-sm font-medium text-gray-800">${n.title}</h4>
                                    <p class="text-xs text-gray-600 mt-1">${n.message}</p>
                                    <div class="text-xs text-gray-400 mt-1">
                                        ${new Date(n.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                ${!n.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>' : ''}
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;

        document.body.appendChild(panel);

        // إغلاق عند النقر خارج القائمة
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target) && !e.target.closest('[aria-label="Notifications"]')) {
                    panel.remove();
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 100);
    }

    // إشعارات النظام المختلفة
    notifyProductAdded(product) {
        this.addNotification(
            'success',
            'تم إضافة منتج جديد',
            `تم إضافة "${product.name}" إلى المخزون بنجاح`,
            { productId: product.id, action: 'product_added' }
        );
    }

    notifyProductUpdated(product) {
        this.addNotification(
            'info',
            'تم تحديث منتج',
            `تم تحديث بيانات "${product.name}"`,
            { productId: product.id, action: 'product_updated' }
        );
    }

    notifyProductDeleted(productName) {
        this.addNotification(
            'warning',
            'تم حذف منتج',
            `تم حذف "${productName}" من المخزون`,
            { action: 'product_deleted' }
        );
    }

    notifyStockMovement(movement, product) {
        const typeText = {
            'inbound': 'استلام',
            'outbound': 'شحن',
            'adjustment': 'تعديل',
            'transfer': 'نقل'
        };

        this.addNotification(
            'info',
            `حركة مخزون - ${typeText[movement.type]}`,
            `${movement.quantity} وحدة من "${product.name}"`,
            { productId: product.id, movementId: movement.id, action: 'stock_movement' }
        );
    }
}

// إنشاء مثيل عام لنظام الإشعارات
window.notificationSystem = new NotificationSystem();

// ربط أزرار الإشعارات تلقائياً
document.addEventListener('DOMContentLoaded', function() {
    // البحث عن أزرار الإشعارات وربطها
    const notificationButtons = document.querySelectorAll('button:has(.material-icons:contains("notifications")), [aria-label="Notifications"]');
    
    notificationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            notificationSystem.showNotificationPanel();
        });
    });
    
    // تحديث الشارات عند تحميل الصفحة
    notificationSystem.updateNotificationBadge();
});

// تصدير للاستخدام في الوحدات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}
