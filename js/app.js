// КОНСТАНТЫ
const SUPABASE_URL = 'https://jvkydzhiwjejohbrtkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iAGSy8_mZ7nZClH8nQDgNA_n4IbzRdA';

console.log('🚀 Запуск приложения...');

// Корзина
let cart = [];

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM загружен');
    loadProducts();
    setupCart();
});

// Загрузка товаров
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

// Создание карточки товара
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
    
    const bestsellerHtml = product.bestseller ? 
        '<span class="bestseller" style="background:linear-gradient(135deg,#ff6b35,#f7931e);color:white;padding:4px 12px;border-radius:20px;font-size:12px;display:inline-block;margin-bottom:8px;">🔥 Хит</span><br>' : '';
    
    const inStockHtml = product.inStock ? 
        '<div style="color:#22c55e;margin-top:8px;font-size:14px;">✓ В наличии</div>' : 
        '<div style="color:#ef4444;margin-top:8px;font-size:14px;">✗ Нет в наличии</div>';
    
    const imageHtml = product.image && product.image.includes('unsplash.com') ?
        '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' : '';
    
    const placeholderHtml = '<div style="width:100%;height:200px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;margin-bottom:12px;display:' + (product.image ? 'none' : 'flex') + ';align-items:center;justify-content:center;color:white;font-size:64px;">' + getEmoji(product.category) + '</div>';
    
    card.innerHTML = imageHtml + placeholderHtml +
        bestsellerHtml + 
        '<h3 class="product-name" style="font-size:18px;font-weight:600;margin-bottom:8px;">' + product.name + '</h3>' +
        '<p style="color:#666;font-size:14px;margin-bottom:12px;">' + product.description + '</p>' +
        '<div class="product-price" style="font-size:24px;font-weight:700;color:#fc3f1d;margin-bottom:8px;">' + product.price.toLocaleString('ru-RU') + ' ₽</div>' +
        '<div style="color:#fbbf24;font-size:14px;">⭐ ' + product.rating + ' (' + product.reviews + ' отзывов)</div>' +
        inStockHtml;
    
    return card;
}

// Модальное окно товара
function openProductModal(product) {
    console.log('📦 Открытие:', product.name);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    const specsHtml = product.specs ? 
        Object.keys(product.specs).map(function(key) {
            return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0e0e0;"><span style="color:#888;">' + key + ':</span><span style="font-weight:600;">' + product.specs[key] + '</span></div>';
        }).join('') : '<p>Характеристики не указаны</p>';
    
    const imageHtml = product.image && product.image.includes('unsplash.com') ?
        '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%;border-radius:12px;">' :
        '<div style="width:100%;height:300px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:80px;">' + getEmoji(product.category) + '</div>';
    
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

// Эмодзи по категории
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

// Настройка корзины
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

// Открытие корзины
function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'flex';
        renderCart();
    }
}

// Закрытие корзины
function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Добавление в корзину
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

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });
    updateCartCount();
    renderCart();
}

// Обновление счетчика
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

// Отображение корзины
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
        html += '<div class="cart-item" style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #e0e0e0;">';
        
        if (item.image && item.image.includes('unsplash.com')) {
            html += '<img src="' + item.image + '" alt="' + item.name + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">';
        } else {
            html += '<div style="width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:32px;">📦</div>';
        }
        
        html += '<div style="flex:1;">' +
            '<h4 style="margin:0 0 8px 0;">' + item.name + '</h4>' +
            '<div style="font-weight:600;color:#fc3f1d;margin-bottom:8px;">' + item.price.toLocaleString('ru-RU') + ' ₽ x ' + item.quantity + '</div>' +
            '<button onclick="removeFromCart(' + item.id + ')" style="padding:6px 12px;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;">Удалить</button>' +
        '</div></div>';
    });
    
    cartItems.innerHTML = html;
    
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString('ru-RU');
    }
}

// Оформление заказа
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

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#22c55e;color:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:3000;animation:slideIn 0.3s ease;';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.remove();
    }, 3000);
}

// Анимация
const style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
document.head.appendChild(style);

// Делаем функции глобальными
window.removeFromCart = removeFromCart;