// КОНСТАНТЫ - замните на свои значения!
const SUPABASE_URL = 'https://jvkydzhiwjejohbrtkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iAGSy8_mZ7nZClH8nQDgNA_n4IbzRdA';
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
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
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
        console.log('Первый товар:', products[0]);
        
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
            
            const bestsellerHtml = product.bestseller ? '<span class="bestseller">🔥 Хит</span>' : '';
            const inStockHtml = product.inStock ? '<div style="color: green; margin-top: 8px;">✓ В наличии</div>' : '';
            
            card.innerHTML = bestsellerHtml + 
                '<h3 class="product-name">' + product.name + '</h3>' +
                '<p>' + product.description + '</p>' +
                '<div class="product-price">' + product.price.toLocaleString('ru-RU') + ' ₽</div>' +
                '<div>⭐ ' + product.rating + ' (' + product.reviews + ' отзывов)</div>' +
                inStockHtml;
            
            grid.appendChild(card);
        });
        
        console.log('✅ Карточки созданы');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        grid.innerHTML = '<div class="loading">❌ Ошибка: ' + error.message + '<br><br>Проверьте:<br>1. Ключи Supabase в app.js<br>2. Консоль (F12)<br>3. Таблицу products в Supabase</div>';
    }
}

// Запускаем когда страница загрузится
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}

