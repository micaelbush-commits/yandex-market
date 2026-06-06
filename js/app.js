// КОНСТАНТЫ
const SUPABASE_URL = 'https://jvkydzhziwjejohbrtkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iAGSy8_mZ7nZClH8nQDgNA_n4IbzRdA';


console.log('🚀 Запуск приложения...');

// Корзина
let cart = [];

// ============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM загружен');
    loadProducts();
    setupCart();
});

// ============================================
// ЗАГРУЗКА ТОВАРОВ
// ============================================
async function loadProducts() {
    console.log('📡 Загрузка товаров...');
    const grid = document.getElementById('productsGrid');
    
    if (!grid) {
        console.error('❌ productsGrid не найден');
        return;
    }
    
    grid.innerHTML = '<div class="loading">⏳ Загрузка...</div>';
    
    try {
        const url = SUPABASE_URL + '/rest/v1/products';
        console.log('🔗 URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📥 Статус:', response.status);
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        const products = await response.json();
        console.log('✅ Товаров:', products.length);
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<div class="loading">😕 Товары не найдены</div>';
            return;
        }
        
        grid.innerHTML = '';
        
        products.forEach(function(product) {
            const card = createProductCard(product);
            grid.appendChild(card);
        });
        
        console.log('✅ Готово');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        grid.innerHTML = '<div class="loading">❌ Ошибка: ' + error.message + '</div>';
    }
}

// ============================================
// СОЗДАНИЕ КАРТОЧКИ ТОВАРА
// ============================================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cssText = 'cursor:pointer;transition:transform 0.3s;';
    
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    card.addEventListener('click', function() {
        openProductModal(product);
    });
    
    // Получаем имя файла изображения
    const imageFile = getProductImageFile(product.name);
    const imagePath = 'images/' + imageFile;
    
    const bestsellerHtml = product.bestseller ? 
        '<span class="bestseller" style="background:linear-gradient(135deg,#ff6b35,#f7931e);color:white;padding:4px 12px;border-radius:20px;font-size:12px;display:inline-block;margin-bottom:8px;">🔥 Хит</span><br>' : '';
    
    const inStockHtml = product.inStock ? 
        '<div style="color:#22c55e;margin-top:8px;font-size:14px;">✓ В наличии</div>' : 
        '<div style="color:#ef4444;margin-top:8px;font-size:14px;">✗ Нет в наличии</div>';
    
    // Изображение с fallback на эмодзи
    const imageHtml = '<img src="' + imagePath + '" alt="' + product.name + '" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
        '<div style="width:100%;height:200px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;margin-bottom:12px;display:none;align-items:center;justify-content:center;color:white;font-size:64px;">' + getEmoji(product.category) + '</div>';
    
    card.innerHTML = imageHtml +
        bestsellerHtml + 
        '<h3 class="product-name" style="font-size:18px;font-weight:600;margin-bottom:8px;">' + product.name + '</h3>' +
        '<p style="color:#666;font-size:14px;margin-bottom:12px;">' + product.description + '</p>' +
        '<div class="product-price" style="font-size:24px;font-weight:700;color:#fc3f1d;margin-bottom:8px;">' + product.price.toLocaleString('ru-RU') + ' ₽</div>' +
        '<div style="color:#fbbf24;font-size:14px;">⭐ ' + product.rating + ' (' + product.reviews + ' отзывов)</div>' +
        inStockHtml;
    
    return card;
}

// ============================================
// ПОЛУЧЕНИЕ ИМЕНИ ФАЙЛА ИЗОБРАЖЕНИЯ
// ============================================
function getProductImageFile(productName) {
    const imageMap = {
        'iPhone 17 Pro Max': 'iphone-17.jpg',
        'Samsung Galaxy S26 Ultra': 'samsung-s26.jpg',
        'Xiaomi 17 Ultra': 'xiaomi-17.jpg',
        'Sony WH-1000XM6': 'sony-xm6.jpg',
        'Apple AirPods Pro 3': 'airpods-pro3.jpg',
        'MacBook Air M5': 'macbook-m5.jpg',
        'Dell XPS 14': 'dell-xps14.jpg',
        'Apple Watch Ultra 3': 'apple-watch3.jpg',
        'iPad Pro M5': 'ipad-pro5.jpg',
        'PlayStation 5 Slim': 'ps5-slim.jpg',
        'Nintendo Switch 2': 'switch2.jpg',
        'Яндекс.Станция Миди': 'yandex-station.jpg',
        'JBL GO 4': 'jbl-go4.jpg',
        'Robot Vacuum X10': 'robot-vacuum.jpg',
        'Air Fryer Pro XL': 'air-fryer.jpg',
        'Dyson V15 Detect': 'dyson-v15.jpg',
        'Bose QuietComfort Ultra Gen 2': 'bose-qc.jpg',
        'Samsung Galaxy Watch 8': 'galaxy-watch8.jpg',
        'Samsung Galaxy Tab S11 Ultra': 'galaxy-tab11.jpg',
        'Steam Deck OLED': 'steam-deck.jpg',
        'Lenovo ThinkPad X1 Carbon': 'thinkpad-x1.jpg',
        'Honor Magic 8 Pro': 'honor-magic8.jpg',
        'OnePlus Watch 3': 'oneplus-watch3.jpg',
        'iPad Air M4': 'ipad-air4.jpg',
        'Bosch Serie 8 Washing Machine': 'bosch-washer.jpg'
    };
    
    return imageMap[productName] || 'default.jpg';
}

// ============================================
// ЭМОДЗИ ПО КАТЕГОРИИ
// ============================================
function getEmoji(category) {
    const emojis = {
        'smartphones': '📱',
        'laptops': '💻',
        'headphones': '🎧',
        'speakers': '🔊',
        'tablets': '📟',
        'smartwatches': '⌚',
        'gaming': '🎮',
        'home': '🏠'
    };
    return emojis[category] || '📦';
}

// ============================================
// МОДАЛЬНОЕ ОКНО ТОВАРА
// ============================================
function openProductModal(product) {
    console.log('📦 Открытие:', product.name);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    // Получаем изображение
    const imageFile = getProductImageFile(product.name);
    const imagePath = 'images/' + imageFile;
    
    const specsHtml = product.specs ? 
        Object.keys(product.specs).map(function(key) {
            return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0e0e0;"><span style="color:#888;">' + key + ':</span><span style="font-weight:600;">' + product.specs[key] + '</span></div>';
        }).join('') : '<p>Характеристики не указаны</p>';
    
    const imageHtml = '<img src="' + imagePath + '" alt="' + product.name + '" style="width:100%;border-radius:12px;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
        '<div style="width:100%;height:300px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;display:none;align-items:center;justify-content:center;color:white;font-size:80px;">' + getEmoji(product.category) + '</div>';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background:white;max-width:800px;width:100%;border-radius:16px;overflow:hidden;max-height:90vh;overflow-y:auto;';
    
    modalContent.innerHTML = '<div style="position:relative;">' +
        '<button id="modalClose" style="position:absolute;top:16px;right:16px;width:40px;height:40px;background:white;border:none;border-radius:50%;cursor:pointer;font-size:24px;z-index:10;">&times;</button>' +
        imageHtml +
    '</div>' +
    '<div style="padding:24px;">' +
        (product.bestseller ? '<span class="bestseller" style="background:linear-gradient(135deg,#ff6b35,#f7931e);color:white;padding:4px 12px;border-radius:20px;font-size:12px;">🔥 Хит продаж</span><br><br>' : '') +
        '<h2 style="margin:12px 0 8px 0;font-size:28px;">' + product.name + '</h2>' +
        '<div style="color:#fbbf24;margin-bottom:16px;font-size:16px;">⭐ ' + product.rating + ' (' + product.reviews + ' отзывов)</div>' +
        '<p style="font-size:16px;line-height:1.6;margin-bottom:20px;color:#666;">' + product.description + '</p>' +
        '<div class="product-price" style="font-size:32px;font-weight:700;color:#fc3f1d;margin-bottom:20px;">' + product.price.toLocaleString('ru-RU') + ' ₽</div>' +
        '<h3 style="margin:20px 0 12px 0;">Характеристики</h3>' +
        '<div style="margin-bottom:24px;">' + specsHtml + '</div>' +
        (product.inStock ? '<button id="addToCartBtn" style="width:100%;padding:16px;background:#fc3f1d;color:white;border:none;border-radius:12px;font-size:18px;font-weight:600;cursor:pointer;">🛒 Добавить в корзину</button>' : '<button disabled style="width:100%;padding:16px;background:#ccc;color:#666;border:none;border-radius:12px;font-size:18px;cursor:not-allowed;">Нет в наличии</button>') +
    '</div>';
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Закрытие модального окна
    document.getElementById('modalClose').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Добавление в корзину
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart(product);
            modal.remove();
        });
    }
}

// ============================================
// НАСТРОЙКА КОРЗИНЫ
// ============================================
function setupCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

// ============================================
// ОТКРЫТИЕ КОРЗИНЫ
// ============================================
function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'flex';
        renderCart();
    }
}

// ============================================
// ЗАКРЫТИЕ КОРЗИНЫ
// ============================================
function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// ДОБАВЛЕНИЕ В КОРЗИНУ
// ============================================
function addToCart(product) {
    const existingItem = cart.find(function(item) {
        return item.id === product.id;
    });
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification('✅ ' + product.name + ' добавлен в корзину');
}

// ============================================
// УДАЛЕНИЕ ИЗ КОРЗИНЫ
// ============================================
function removeFromCart(productId) {
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });
    updateCartCount();
    renderCart();
}

// ============================================
// ОБНОВЛЕНИЕ СЧЕТЧИКА КОРЗИНЫ
// ============================================
function updateCartCount() {
    const count = cart.reduce(function(total, item) {
        return total + item.quantity;
    }, 0);
    
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ============================================
// ОТОБРАЖЕНИЕ КОРЗИНЫ
// ============================================
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;color:#888;padding:40px;">Корзина пуста</p>';
        if (cartTotal) cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(function(item) {
        total += item.price * item.quantity;
        
        // Получаем изображение
        const imageFile = getProductImageFile(item.name);
        const imagePath = 'images/' + imageFile;
        
        html += '<div class="cart-item" style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #e0e0e0;">';
        html += '<img src="' + imagePath + '" alt="' + item.name + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23667eea%22 width=%2280%22 height=%2280%22/%3E%3Ctext fill=%22white%22 x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22%3E📦%3C/text%3E%3C/svg%3E\';">';
        html += '<div style="flex:1;">';
        html += '<h4 style="margin:0 0 8px 0;">' + item.name + '</h4>';
        html += '<div style="font-weight:600;color:#fc3f1d;margin-bottom:8px;">' + item.price.toLocaleString('ru-RU') + ' ₽ x ' + item.quantity + '</div>';
        html += '<button onclick="removeFromCart(' + item.id + ')" style="padding:6px 12px;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;">Удалить</button>';
        html += '</div></div>';
    });
    
    cartItems.innerHTML = html;
    
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString('ru-RU');
    }
}

// ============================================
// ОФОРМЛЕНИЕ ЗАКАЗА
// ============================================
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);
    
    alert('Заказ оформлен!\n\nТоваров: ' + cart.length + '\nСумма: ' + total.toLocaleString('ru-RU') + ' ₽\n\nСпасибо за покупку! 🎉');
    
    cart = [];
    updateCartCount();
    closeCart();
}

// ============================================
// УВЕДОМЛЕНИЕ
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#22c55e;color:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:3000;animation:slideIn 0.3s ease;';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.remove();
    }, 3000);
}

// ============================================
// АНИМАЦИЯ
// ============================================
const style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
document.head.appendChild(style);

// ============================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ
// ============================================
window.removeFromCart = removeFromCart;