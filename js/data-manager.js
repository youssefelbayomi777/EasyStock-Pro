/**
 * EasyStock Pro - Data Management System
 * نظام إدارة البيانات المركزي للمخزون
 */

class EasyStockDataManager {
    constructor() {
        this.storageKeys = {
            products: 'easystock_products',
            users: 'easystock_users',
            movements: 'easystock_movements',
            settings: 'easystock_settings',
            session: 'easystock_session'
        };
        
        this.initializeDefaultData();
    }

    // ============ تهيئة البيانات الافتراضية ============
    initializeDefaultData() {
        // إنشاء المستخدمين الافتراضيين
        if (!this.getUsers().length) {
            this.createDefaultUsers();
        }
        
        // إنشاء المنتجات الافتراضية
        if (!this.getProducts().length) {
            this.createDefaultProducts();
        }
        
        // إنشاء الإعدادات الافتراضية
        if (!this.getSettings()) {
            this.createDefaultSettings();
        }
    }

    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                email: 'admin@easystock.com',
                role: 'admin',
                name: 'مدير النظام',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                username: 'user',
                password: 'user123',
                email: 'user@easystock.com',
                role: 'user',
                name: 'مستخدم عادي',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                username: 'manager',
                password: 'manager123',
                email: 'manager@easystock.com',
                role: 'manager',
                name: 'مدير المخزون',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem(this.storageKeys.users, JSON.stringify(defaultUsers));
    }

    createDefaultProducts() {
        const defaultProducts = [
            {
                id: 1,
                name: 'Eco-Friendly Cleaning Spray',
                nameAr: 'رذاذ تنظيف صديق للبيئة',
                sku: 'ECFS-001',
                category: 'Cleaning Supplies',
                categoryAr: 'مستلزمات التنظيف',
                supplier: 'GreenClean Inc.',
                quantity: 500,
                reorderPoint: 100,
                price: 15.99,
                cost: 8.50,
                description: 'Eco-friendly cleaning spray made from natural ingredients',
                descriptionAr: 'رذاذ تنظيف صديق للبيئة مصنوع من مكونات طبيعية',
                status: 'active',
                createdAt: '2024-07-26T10:00:00Z',
                updatedAt: '2024-07-26T10:00:00Z'
            },
            {
                id: 2,
                name: 'Organic Cotton T-shirts',
                nameAr: 'قمصان قطن عضوي',
                sku: 'OCTS-002',
                category: 'Apparel',
                categoryAr: 'الملابس',
                supplier: 'EcoThreads Co.',
                quantity: 300,
                reorderPoint: 50,
                price: 29.99,
                cost: 15.00,
                description: 'Comfortable organic cotton t-shirts in various sizes',
                descriptionAr: 'قمصان قطن عضوي مريحة بأحجام مختلفة',
                status: 'active',
                createdAt: '2024-07-25T14:30:00Z',
                updatedAt: '2024-07-25T14:30:00Z'
            },
            {
                id: 3,
                name: 'Recycled Paper Notebooks',
                nameAr: 'دفاتر ورق معاد التدوير',
                sku: 'RPNB-003',
                category: 'Stationery',
                categoryAr: 'القرطاسية',
                supplier: 'Sustainable Supplies Ltd.',
                quantity: 200,
                reorderPoint: 30,
                price: 12.99,
                cost: 6.00,
                description: 'High-quality notebooks made from recycled paper',
                descriptionAr: 'دفاتر عالية الجودة مصنوعة من الورق المعاد تدويره',
                status: 'active',
                createdAt: '2024-07-24T09:15:00Z',
                updatedAt: '2024-07-24T09:15:00Z'
            },
            {
                id: 4,
                name: 'Bamboo Toothbrushes',
                nameAr: 'فرش أسنان من الخيزران',
                sku: 'BTB-004',
                category: 'Personal Care',
                categoryAr: 'العناية الشخصية',
                supplier: 'Nature\'s Choice',
                quantity: 25,
                reorderPoint: 80,
                price: 8.99,
                cost: 3.50,
                description: 'Eco-friendly bamboo toothbrushes with soft bristles',
                descriptionAr: 'فرش أسنان صديقة للبيئة من الخيزران بشعيرات ناعمة',
                status: 'active',
                createdAt: '2024-07-23T16:45:00Z',
                updatedAt: '2024-07-23T16:45:00Z'
            },
            {
                id: 5,
                name: 'Solar-Powered Phone Chargers',
                nameAr: 'شواحن هواتف تعمل بالطاقة الشمسية',
                sku: 'SPPC-005',
                category: 'Electronics',
                categoryAr: 'الإلكترونيات',
                supplier: 'SunTech Innovations',
                quantity: 0,
                reorderPoint: 20,
                price: 45.99,
                cost: 25.00,
                description: 'Portable solar-powered chargers for mobile devices',
                descriptionAr: 'شواحن محمولة تعمل بالطاقة الشمسية للأجهزة المحمولة',
                status: 'active',
                createdAt: '2024-07-22T11:20:00Z',
                updatedAt: '2024-07-22T11:20:00Z'
            }
        ];
        
        localStorage.setItem(this.storageKeys.products, JSON.stringify(defaultProducts));
        
        // إنشاء حركات افتراضية للمنتجات
        this.createDefaultMovements();
    }

    createDefaultMovements() {
        const movements = [
            {
                id: 1,
                productId: 1,
                type: 'inbound',
                quantity: 500,
                reason: 'Initial Stock',
                reasonAr: 'مخزون أولي',
                date: '2024-07-26T10:00:00Z',
                userId: 1,
                notes: 'Initial inventory setup'
            },
            {
                id: 2,
                productId: 2,
                type: 'inbound',
                quantity: 300,
                reason: 'Purchase Order',
                reasonAr: 'أمر شراء',
                date: '2024-07-25T14:30:00Z',
                userId: 1,
                notes: 'Monthly restock'
            },
            {
                id: 3,
                productId: 1,
                type: 'outbound',
                quantity: 50,
                reason: 'Sale',
                reasonAr: 'بيع',
                date: '2024-07-27T09:15:00Z',
                userId: 2,
                notes: 'Customer order #1001'
            },
            {
                id: 4,
                productId: 4,
                type: 'adjustment',
                quantity: -375,
                reason: 'Damaged Goods',
                reasonAr: 'بضائع تالفة',
                date: '2024-07-28T15:30:00Z',
                userId: 3,
                notes: 'Water damage during storage'
            },
            {
                id: 5,
                productId: 5,
                type: 'outbound',
                quantity: 150,
                reason: 'Sale',
                reasonAr: 'بيع',
                date: '2024-07-29T11:45:00Z',
                userId: 2,
                notes: 'Bulk order to retailer'
            }
        ];
        
        localStorage.setItem(this.storageKeys.movements, JSON.stringify(movements));
    }

    createDefaultSettings() {
        const settings = {
            companyName: 'EasyStock Pro',
            companyNameAr: 'إيزي ستوك برو',
            language: 'en',
            currency: 'USD',
            timezone: 'UTC',
            lowStockThreshold: 10,
            notifications: {
                lowStock: true,
                newMovements: true,
                systemUpdates: true
            },
            theme: 'light',
            dateFormat: 'YYYY-MM-DD',
            numberFormat: 'en-US'
        };
        
        localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings));
    }

    // ============ إدارة المنتجات ============
    getProducts() {
        const products = localStorage.getItem(this.storageKeys.products);
        return products ? JSON.parse(products) : [];
    }

    getProduct(id) {
        const products = this.getProducts();
        return products.find(product => product.id === parseInt(id));
    }

    addProduct(productData) {
        const products = this.getProducts();
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        
        const newProduct = {
            id: newId,
            ...productData,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        localStorage.setItem(this.storageKeys.products, JSON.stringify(products));
        
        // إضافة حركة مخزون أولية
        if (productData.quantity > 0) {
            this.addMovement({
                productId: newId,
                type: 'inbound',
                quantity: productData.quantity,
                reason: 'Initial Stock',
                reasonAr: 'مخزون أولي',
                notes: 'Product added to inventory'
            });
        }
        
        return newProduct;
    }

    updateProduct(id, updateData) {
        const products = this.getProducts();
        const index = products.findIndex(product => product.id === parseInt(id));
        
        if (index !== -1) {
            const oldQuantity = products[index].quantity;
            products[index] = {
                ...products[index],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem(this.storageKeys.products, JSON.stringify(products));
            
            // إضافة حركة إذا تغيرت الكمية
            const newQuantity = products[index].quantity;
            if (oldQuantity !== newQuantity) {
                const quantityDiff = newQuantity - oldQuantity;
                this.addMovement({
                    productId: parseInt(id),
                    type: quantityDiff > 0 ? 'inbound' : 'outbound',
                    quantity: Math.abs(quantityDiff),
                    reason: 'Manual Adjustment',
                    reasonAr: 'تعديل يدوي',
                    notes: 'Product quantity updated'
                });
            }
            
            return products[index];
        }
        
        return null;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const filteredProducts = products.filter(product => product.id !== parseInt(id));
        
        if (filteredProducts.length < products.length) {
            localStorage.setItem(this.storageKeys.products, JSON.stringify(filteredProducts));
            return true;
        }
        
        return false;
    }

    // ============ إدارة حركات المخزون ============
    getMovements() {
        const movements = localStorage.getItem(this.storageKeys.movements);
        return movements ? JSON.parse(movements) : [];
    }

    addMovement(movementData) {
        const movements = this.getMovements();
        const newId = Math.max(...movements.map(m => m.id), 0) + 1;
        const currentUser = this.getCurrentUser();
        
        const newMovement = {
            id: newId,
            ...movementData,
            date: new Date().toISOString(),
            userId: currentUser ? currentUser.id : 1
        };
        
        movements.push(newMovement);
        localStorage.setItem(this.storageKeys.movements, JSON.stringify(movements));
        
        return newMovement;
    }

    // ============ إدارة المستخدمين ============
    getUsers() {
        const users = localStorage.getItem(this.storageKeys.users);
        return users ? JSON.parse(users) : [];
    }

    authenticateUser(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            const session = {
                userId: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem(this.storageKeys.session, JSON.stringify(session));
            return session;
        }
        
        return null;
    }

    getCurrentUser() {
        const session = localStorage.getItem(this.storageKeys.session);
        return session ? JSON.parse(session) : null;
    }

    logout() {
        localStorage.removeItem(this.storageKeys.session);
    }

    // ============ الإعدادات ============
    getSettings() {
        const settings = localStorage.getItem(this.storageKeys.settings);
        return settings ? JSON.parse(settings) : null;
    }

    updateSettings(newSettings) {
        const currentSettings = this.getSettings() || {};
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem(this.storageKeys.settings, JSON.stringify(updatedSettings));
        return updatedSettings;
    }

    // ============ إحصائيات ============
    getStatistics() {
        const products = this.getProducts();
        const movements = this.getMovements();
        
        const totalProducts = products.length;
        const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
        const lowStockProducts = products.filter(product => product.quantity <= product.reorderPoint);
        const outOfStockProducts = products.filter(product => product.quantity === 0);
        
        const recentMovements = movements
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
        
        const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
        
        return {
            totalProducts,
            totalQuantity,
            lowStockCount: lowStockProducts.length,
            outOfStockCount: outOfStockProducts.length,
            recentMovements,
            totalValue,
            lowStockProducts,
            outOfStockProducts
        };
    }

    // ============ البحث والفلترة ============
    searchProducts(query, filters = {}) {
        let products = this.getProducts();
        
        // البحث النصي
        if (query) {
            const searchTerm = query.toLowerCase();
            products = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.nameAr.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm) ||
                product.supplier.toLowerCase().includes(searchTerm)
            );
        }
        
        // فلترة حسب الفئة
        if (filters.category) {
            products = products.filter(product => product.category === filters.category);
        }
        
        // فلترة حسب المورد
        if (filters.supplier) {
            products = products.filter(product => product.supplier === filters.supplier);
        }
        
        // فلترة حسب حالة المخزون
        if (filters.stockStatus) {
            switch (filters.stockStatus) {
                case 'in-stock':
                    products = products.filter(product => product.quantity > product.reorderPoint);
                    break;
                case 'low-stock':
                    products = products.filter(product => product.quantity > 0 && product.quantity <= product.reorderPoint);
                    break;
                case 'out-of-stock':
                    products = products.filter(product => product.quantity === 0);
                    break;
            }
        }
        
        return products;
    }

    // ============ تصدير البيانات ============
    exportData(type = 'all') {
        const data = {};
        
        if (type === 'all' || type === 'products') {
            data.products = this.getProducts();
        }
        
        if (type === 'all' || type === 'movements') {
            data.movements = this.getMovements();
        }
        
        if (type === 'all' || type === 'users') {
            data.users = this.getUsers().map(user => ({
                ...user,
                password: '***' // إخفاء كلمات المرور
            }));
        }
        
        return data;
    }

    // ============ استيراد البيانات ============
    importData(data) {
        try {
            if (data.products) {
                localStorage.setItem(this.storageKeys.products, JSON.stringify(data.products));
            }
            
            if (data.movements) {
                localStorage.setItem(this.storageKeys.movements, JSON.stringify(data.movements));
            }
            
            if (data.users) {
                localStorage.setItem(this.storageKeys.users, JSON.stringify(data.users));
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // ============ تنظيف البيانات ============
    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeDefaultData();
    }
}

// إنشاء مثيل عام لإدارة البيانات
window.dataManager = new EasyStockDataManager();

// تصدير للاستخدام في الوحدات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EasyStockDataManager;
}
