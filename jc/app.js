// ВАШИ КЛЮЧИ SUPABASE (вставьте свои!)
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // Вставьте Project URL
const SUPABASE_KEY = 'your-anon-key'; // Вставьте anon public ключ

// Загружаем товары
async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        const products = await response.json();
        
        grid.innerHTML = '';
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                ${product.bestseller ? '<span class="bestseller">🔥 Хит</span>' : ''}
                <h3 class="product-name">${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <div>⭐ ${product.rating} (${product.reviews} отзывов)</div>
                ${product.inStock ? '<div style="color: green; margin-top: 8px;">✓ В наличии</div>' : ''}
            `;
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
        grid.innerHTML = '<div class="loading">Ошибка загрузки 😕</div>';
    }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', loadProducts);