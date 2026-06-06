// КОНСТАНТЫ - замените на свои значения!
const SUPABASE_URL='https://jvkydzhziwjejohbrtkw.supabase.co';
const SUPABASE_KEY='sb_publishable_iAGSy8_mZ7nZClH8nQDgNA_n4IbzRdA';
// Проверяем, что ключи заданы
if (SUPABASE_URL.includes('xxxxx') || SUPABASE_KEY.includes('your')) {
    console.error('⚠️ Вставьте свои ключи Supabase в app.js!');
}

console.log('🚀 Запуск приложения...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY.substring(0, 20) + '...');

// Проверяем загрузку DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM загружен');
    loadProducts();
});

// Если DOM уже загружен
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('⚡ DOM уже готов, загружаем сразу');
    setTimeout(loadProducts, 100);
}

async function loadProducts() {
    console.log('📡 Начинаю загрузку товаров...');
    const grid = document.getElementById('productsGrid');
    
    if (!grid) {
        console.error('❌ Элемент productsGrid не найден!');
        return;
    }
    
    grid.innerHTML = '<div class="loading">⏳ Загрузка товаров...</div>';
    
    try {
        const url = SUPABASE_URL + '/rest/v1/products';
        console.log('🔗 URL запроса:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
            }
        });
        
        console.log('📥 Статус ответа:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Ошибка HTTP:', response.status, errorText);
            throw new Error('HTTP ' + response.status + ': ' + errorText);
        }
        
        const products = await response.json();
        console.log('✅ Получено товаров:', products.length);
        console.log('Первый товар:', products[0]);
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<div class="loading">😕 Товары не найдены<br><small>Проверьте таблицу в Supabase</small></div>';
            return;
        }
        
        // Очищаем сетку
        grid.innerHTML = '';
        
        // Создаем карточки
        products.forEach(function(product, index) {
            console.log('Создаю карточку', index + 1, ':', product.name);
            
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cssText = 'cursor:pointer;transition:transform 0.3s;';
            card.onmouseover = function() { this.style.transform = 'translateY(-4px)'; };
            card.onmouseout = function() { this.style.transform = 'translateY(0)'; };
            
            // Клик по карточке
            card.onclick = function() {
                openProductModal(product);
            };
            
            const bestsellerHtml = product.bestseller ? '<span class="bestseller" style="background:linear-gradient(135deg,#ff6b35,#f7931e);color:white;padding:4px 12px;border-radius:20px;font-size:12px;display:inline-block;margin-bottom:8px;">🔥 Хит</span><br>' : '';
            const inStockHtml = product.inStock ? '<div style="color:#22c55e;margin-top:8px;font-size:14px;">✓ В наличии</div>' : '<div style="color:#ef4444;margin-top:8px;font-size:14px;">✗ Нет в наличии</div>';
            
            // Изображение
            const imageHtml = product.image && product.image.includes('unsplash.com')
                ? '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">'
                : '';
            
            const placeholderHtml = '<div style="width:100%;height:200px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:8px;margin-bottom:12px;display:' + (product.image ? 'none' : 'flex') + ';align-items:center;justify-content:center;color:white;font-size:64px;">' + getEmoji(product.category) + '</div>';
            
            card.innerHTML = imageHtml + placeholderHtml +
                bestsellerHtml + 
                '<h3 class="product-name" style="font-size:18px;font-weight:600;margin-bottom:8px;">' + product.name + '</h3>' +
                '<p style="color:#666;font-size:14px;margin-bottom:12px;">' + product.description + '</p>' +
                '<div class="product-price" style="font-size:24px;font-weight:700;color:#fc3f1d;margin-bottom:8px;">' + product.price.toLocaleString('ru-RU') + ' ₽</div>' +
                '<div style="color:#fbbf24;font-size:14px;">⭐ ' + product.rating + ' (' + product.reviews + ' отзывов)</div>' +
                inStockHtml +
                '<button style="margin-top:12px;padding:10px 20px;background:#fc3f1d;color:white;border:none;border-radius:8px;cursor:pointer;width:100%;font-weight:600;font-size:16px;">Подробнее</button>';
            
            grid.appendChild(card);
        });
        
        console.log('✅ Все карточки созданы!');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        console.error('Stack:', error.stack);
        grid.innerHTML = '<div class="loading" style="color:#ef4444;">❌ Ошибка: ' + error.message + '<br><br><small>Проверьте:<br>1. Консоль (F12)<br>2. Ключи Supabase<br>3. Таблицу products</small></div>';
    }
}

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

function openProductModal(product) {
    console.log('📦 Открытие товара:', product.name);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    const specsHtml = product.specs 
        ? Object.keys(product.specs).map(function(key) {
            return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0e0e0;"><span style="color:#888;">' + key + ':</span><span style="font-weight:600;">' + product.specs[key] + '</span></div>';
        }).join('')
        : '<p>Характеристики не указаны</p>';
    
    const imageHtml = product.image && product.image.includes('unsplash.com')
        ? '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%;border-radius:12px;" onerror="this.style.display=\'none\';">'
        : '<div style="width:100%;height:300px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:80px;">' + getEmoji(product.category) + '</div>';
    
    modal.innerHTML = '<div style="background:white;max-width:800px;width:100%;border-radius:16px;overflow:hidden;max-height:90vh;overflow-y:auto;">' +
        '<div style="position:relative;">' +
            '<button onclick="this.closest(\'.modal\').remove()" style="position:absolute;top:16px;right:16px;width:40px;height:40px;background:white;border:none;border-radius:50%;cursor:pointer;font-size:24px;z-index:10;line-height:1;">&times;</button>' +
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
            (product.inStock ? '<button style="width:100%;padding:16px;background:#fc3f1d;color:white;border:none;border-radius:12px;font-size:18px;font-weight:600;cursor:pointer;">Добавить в корзину</button>' : '<button disabled style="width:100%;padding:16px;background:#ccc;color:#666;border:none;border-radius:12px;font-size:18px;cursor:not-allowed;">Нет в наличии</button>') +
        '</div>' +
    '</div>';
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    window.closeModal = function() {
        modal.remove();
    };
}

window.openProductModal = openProductModal;