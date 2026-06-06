// КОНСТАНТЫ - замените на свои значения!
const SUPABASE_URL='https://jvkydzhziwjejohbrtkw.supabase.co';
const SUPABASE_KEY='sb_publishable_iAGSy8_mZ7nZClH8nQDgNA_n4IbzRdA';
// Проверяем, что ключи заданы
if (SUPABASE_URL.includes('xxxxx') || SUPABASE_KEY.includes('your')) {
    console.error('⚠️ Вставьте свои ключи Supabase в app.js!');
}

console.log('🚀 Запуск приложения...');
console.log('URL:', SUPABASE_URL);

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    
    try {
        console.log('📡 Запрос к Supabase...');
        
        const url = SUPABASE_URL + '/rest/v1/products';
        console.log('URL запроса:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Статус ответа:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка HTTP:', response.status, errorText);
            throw new Error('HTTP error! status: ' + response.status);
        }
        
        const products = await response.json();
        console.log('✅ Получено товаров:', products.length);
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<div class="loading">😕 Товары не найдены<br>Проверьте таблицу в Supabase</div>';
            return;
        }
        
        // Очищаем сетку
        grid.innerHTML = '';
        
        // Создаем карточки
        products.forEach(function(product) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cursor = 'pointer';
            
            // Клик по карточке
            card.addEventListener('click', function() {
                openProductModal(product);
            });
            
            const bestsellerHtml = product.bestseller ? '<span class="bestseller">🔥 Хит</span>' : '';
            const inStockHtml = product.inStock ? '<div style="color: green; margin-top: 8px;">✓ В наличии</div>' : '';
            
            // Заглушка для изображения (если нет в базе)
            const imageHtml = product.image 
                ? '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;">'
                : '<div style="width:100%;height:200px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:48px;">📱</div>';
            
            card.innerHTML = imageHtml +
                bestsellerHtml + 
                '<h3 class="product-name">' + product.name + '</h3>' +
                '<p>' + product.description + '</p>' +
                '<div class="product-price">' + product.price.toLocaleString('ru-RU') + ' ₽</div>' +
                '<div>⭐ ' + product.rating + ' (' + product.reviews + ' отзывов)</div>' +
                inStockHtml +
                '<button style="margin-top:12px;padding:10px 20px;background:#fc3f1d;color:white;border:none;border-radius:8px;cursor:pointer;width:100%;font-weight:600;">Подробнее</button>';
            
            grid.appendChild(card);
        });
        
        console.log('✅ Карточки созданы');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        grid.innerHTML = '<div class="loading">❌ Ошибка: ' + error.message + '</div>';
    }
}

// Модальное окно товара
function openProductModal(product) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    const specsHtml = product.specs 
        ? Object.keys(product.specs).map(function(key) {
            return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0e0e0;"><span style="color:#888;">' + key + ':</span><span style="font-weight:600;">' + product.specs[key] + '</span></div>';
        }).join('')
        : '<p>Характеристики не указаны</p>';
    
    const imageHtml = product.image
        ? '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%;border-radius:12px;">'
        : '<div style="width:100%;height:300px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:80px;">📱</div>';
    
    modal.innerHTML = '<div style="background:white;max-width:800px;width:100%;border-radius:16px;overflow:hidden;max-height:90vh;overflow-y:auto;">' +
        '<div style="position:relative;">' +
            '<button onclick="this.closest(\'.modal\').remove()" style="position:absolute;top:16px;right:16px;width:40px;height:40px;background:white;border:none;border-radius:50%;cursor:pointer;font-size:20px;z-index:10;">&times;</button>' +
            imageHtml +
        '</div>' +
        '<div style="padding:24px;">' +
            (product.bestseller ? '<span class="bestseller">🔥 Хит продаж</span>' : '') +
            '<h2 style="margin:12px 0 8px 0;font-size:28px;">' + product.name + '</h2>' +
            '<div style="color:#888;margin-bottom:16px;">⭐ ' + product.rating + ' (' + product.reviews + ' отзывов)</div>' +
            '<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">' + product.description + '</p>' +
            '<div class="product-price" style="font-size:32px;font-weight:700;color:#fc3f1d;margin-bottom:20px;">' + product.price.toLocaleString('ru-RU') + ' ₽</div>' +
            '<h3 style="margin:20px 0 12px 0;">Характеристики</h3>' +
            '<div style="margin-bottom:24px;">' + specsHtml + '</div>' +
            (product.inStock ? '<button style="width:100%;padding:16px;background:#fc3f1d;color:white;border:none;border-radius:12px;font-size:18px;font-weight:600;cursor:pointer;">Добавить в корзину</button>' : '<button disabled style="width:100%;padding:16px;background:#ccc;color:#666;border:none;border-radius:12px;font-size:18px;cursor:not-allowed;">Нет в наличии</button>') +
        '</div>' +
    '</div>';
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Добавляем в глобальную область видимости
window.openProductModal = openProductModal;