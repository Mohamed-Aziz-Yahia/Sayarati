const products = {
    1: {
        id: 1,
        name: "ALTERNATEUR",
        category: "Moteur",
        sku: "8122360",
        price: "34010.96 DZ",
        rating: "⭐ 3.9",
        sold: "+1021 sold",
        location: "Ouargla",
        compatibility: "RENAULT Twingo | Symbol || Clio || DACIA",
        partNo: "F00D0L0458",
        image: "alternateur-gomecano 1.png"
    },
    2: {
        id: 2,
        name: "ALIES Volkswagen Golf",
        category: "Bonne occasion",
        sku: "2155531",
        price: "55120.32 DZ",
        rating: "⭐ 4.5",
        sold: "+800 sold",
        location: "Algiers",
        compatibility: "Volkswagen Golf MK4 | MK5",
        partNo: "VW21553",
        image: "aile-av-g-berlingo-nm-08 1.png"
    },
    3: {
        id: 3,
        name: "BATTERIE",
        category: "High Performance",
        sku: "11235813",
        price: "87000.00 DZ",
        rating: "⭐ 4.8",
        sold: "+1200 sold",
        location: "Oran",
        compatibility: "All Standard Cars",
        partNo: "BT1234HP",
        image: "amortisseur_volvo_s80_et_v70_ref_30683342,_8624604,_9492564 1.png"
    },
    4: {
        id: 4,
        name: "FILTRE A AIR",
        category: "Long Life Filter",
        sku: "32659874",
        price: "2200.00 DZ",
        rating: "⭐ 4.2",
        sold: "+500 sold",
        location: "Constantine",
        compatibility: "Multiple Models",
        partNo: "FA5678LL",
        image: "arret-de-porte-avant 1.png"
    },
    5: {
        id: 5,
        name: "APPUI COUPELLE",
        category: "Long Life Filter",
        sku: "9515020",
        price: "2200.00 DZ",
        rating: "⭐ 4.9",
        sold: "+500 sold",
        location: "Constantine",
        compatibility: "Multiple Models",
        partNo: "FA5678LL",
        image: "coupelle-d-appui-suspension-avant 1.png"
    },
    6: {
        id: 6,
        name: "ACCOUDOIR CONSOLE",
        category: "Accessories",
        sku: "942210",
        price: "16648.82 DZ",
        rating: "⭐ 5",
        sold: "+500 sold",
        location: "Constantine",
        compatibility: "Multiple Models",
        partNo: "FA5678LL",
        image: "s-l1200 1.png"
    }
};
const authToken = localStorage.getItem('authToken');
const loggedInUser = localStorage.getItem('loggedInUser');
if (!authToken || !loggedInUser) {
    window.location.href = './login.html';
}
// Toggle product details
function toggleDetails(card) {
    const details = card.querySelector('.product-details');
    details.classList.toggle('visible');
    
    // Close other open details
    document.querySelectorAll('.product-card .product-details').forEach(item => {
        if (item !== details && item.classList.contains('visible')) {
            item.classList.remove('visible');
        }
    });
}

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const favoritesSidebar = document.getElementById('favoritesSidebar');
const overlay = document.getElementById('overlay');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const openFavoritesBtn = document.getElementById('openFavorites');
const closeFavoritesBtn = document.getElementById('closeFavorites');

openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

openFavoritesBtn.addEventListener('click', () => {
    favoritesSidebar.classList.add('active');
    overlay.classList.add('active');
});

closeFavoritesBtn.addEventListener('click', () => {
    favoritesSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    favoritesSidebar.classList.remove('active');
    overlay.classList.remove('active');
    ratingModal.classList.remove('active');
    purchaseModal.classList.remove('active');
    addProductModal.classList.remove('active');
});

const ratingModal = document.getElementById('ratingModal');
const purchaseModal = document.getElementById('purchaseModal');
const addProductModal = document.getElementById('addProductModal');
const stars = document.querySelectorAll('.star');
let selectedRating = 0;
let currentProduct = null;

// Open purchase modal when "Buy" is clicked
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('buy-btn')) {
        e.stopPropagation();
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.getAttribute('data-id'));
        currentProduct = products[productId];
        
        // Update purchase modal with product info
        document.getElementById('purchase-product-name').textContent = currentProduct.name;
        document.getElementById('purchase-product-price').textContent = currentProduct.price;
        
        // Get quantity (default to 1)
        const quantity = 1; // You can implement quantity selection
        document.getElementById('purchase-product-quantity').textContent = quantity;
        
        // Calculate total (simple implementation)
        const priceValue = parseFloat(currentProduct.price.replace(/[^0-9.]/g, ''));
        const total = priceValue * quantity;
        document.getElementById('purchase-product-total').textContent = total.toFixed(2) + ' DZ';
        
        // Show purchase modal
        purchaseModal.classList.add('active');
        overlay.classList.add('active');
    }
});

// Close purchase modal
document.getElementById('cancelPurchase').addEventListener('click', function() {
    purchaseModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Handle purchase form submission
document.getElementById('purchaseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would normally send the data to your server
    // For this example, we'll just show an alert
    alert('Purchase successful! Thank you for your order.');
    
    // Close the modal
    purchaseModal.classList.remove('active');
    overlay.classList.remove('active');
    
    // Reset form
    this.reset();
    
    // Show rating modal after purchase
    setTimeout(() => {
        ratingModal.classList.add('active');
        overlay.classList.add('active');
    }, 500);
});

// Star rating selection
stars.forEach(star => {
    star.addEventListener('click', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        selectedRating = rating;
        
        stars.forEach((s, index) => {
            s.classList.toggle('active', index < rating);
        });
    });
});

// Close modal
document.querySelector('.close-modal').addEventListener('click', function() {
    ratingModal.classList.remove('active');
    overlay.classList.remove('active');
    resetStars();
});

// Submit rating
document.querySelector('.submit-rating').addEventListener('click', function() {
    if (selectedRating > 0) {
        alert(`Thank you for your ${selectedRating}-star rating!`);
        ratingModal.classList.remove('active');
        overlay.classList.remove('active');
        resetStars();
    } else {
        alert('Please select a rating before submitting.');
    }
});

// Reset stars
function resetStars() {
    selectedRating = 0;
    stars.forEach(star => star.classList.remove('active'));
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');

// Check for saved user preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121z"/>
        </svg>
        Light Mode
    `;
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save user preference
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121z"/>
            </svg>
            Light Mode
        `;
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/>
            </svg>
            Dark Mode
        `;
    }
});

// Favorites functionality
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Update favorite buttons based on stored favorites
function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        const productCard = button.closest('.product-card');
        const productId = parseInt(productCard.getAttribute('data-id'));
        
        if (favorites.includes(productId)) {
            button.textContent = 'Remove favorite';
            button.classList.add('favorited');
        } else {
            button.textContent = 'Add to favorite';
            button.classList.remove('favorited');
        }
    });
}

// Render favorites list
function renderFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<div class="no-favorites">No favorites yet. Add some products to your favorites!</div>';
        return;
    }
    
    favoritesList.innerHTML = '';
    
    favorites.forEach(productId => {
        const product = products[productId];
        if (!product) return;
        
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="favorite-item-info">
                <h4>${product.name}</h4>
                <p>${product.price}</p>
            </div>
            <button class="remove-favorite" data-id="${productId}">×</button>
        `;
        
        favoritesList.appendChild(favoriteItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromFavorites(productId);
        });
    });
}

// Add to favorites
function addToFavorites(productId) {
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButtons();
        renderFavorites();
    }
}

// Remove from favorites
function removeFromFavorites(productId) {
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
    renderFavorites();
}

// Toggle favorite status
function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
        removeFromFavorites(productId);
    } else {
        addToFavorites(productId);
    }
}

// Handle favorite button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('favorite-btn')) {
        e.stopPropagation();
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.getAttribute('data-id'));
        toggleFavorite(productId);
    }
});

// Initialize
updateFavoriteButtons();
renderFavorites();

// Quantity buttons functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quantity-btn')) {
        e.stopPropagation();
        // You can implement quantity adjustment here
        alert('Quantity adjustment would be implemented here');
    }
});

// Add Product Modal functionality
const addProductBtn = document.getElementById('addProductBtn');
const cancelAddProductBtn = document.getElementById('cancelAddProduct');

// Open add product modal
addProductBtn.addEventListener('click', () => {
    addProductModal.classList.add('active');
    overlay.classList.add('active');
});

// Close add product modal
cancelAddProductBtn.addEventListener('click', () => {
    addProductModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Handle form submission
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Generate a new product ID
    const productIds = Object.keys(products).map(Number);
    const newId = productIds.length > 0 ? Math.max(...productIds) + 1 : 7;
    
    // Create new product object
    const newProduct = {
        id: newId,
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        sku: document.getElementById('product-sku').value,
        price: parseFloat(document.getElementById('product-price').value).toFixed(2) + ' DZ',
        rating: '⭐ ' + document.getElementById('product-rating').value,
        sold: document.getElementById('product-sold').value,
        location: document.getElementById('product-location').value,
        compatibility: document.getElementById('product-compatibility').value,
        partNo: document.getElementById('product-partno').value,
        image: document.getElementById('product-image').value
    };
    
    // Add to products object
    products[newId] = newProduct;
    
    // Create new product card
    const productGrid = document.querySelector('.product-grid');
    const newProductCard = document.createElement('div');
    newProductCard.className = 'product-card';
    newProductCard.setAttribute('data-id', newId);
    newProductCard.onclick = function() { toggleDetails(this); };
    
    newProductCard.innerHTML = `
        <img src="${newProduct.image}" alt="${newProduct.name}">
        <h3>${newProduct.name}</h3>
        <p>${newProduct.category}</p>
        <p>SKU: <span>${newProduct.sku}</span></p>
        <p class="price">${newProduct.price}</p>
        <div class="product-details">
            <p><span class="rating">${newProduct.rating}</span> | ${newProduct.sold}</p>
            <p><strong>${newProduct.location}</strong></p>
            <p>${newProduct.compatibility}</p>
            <p>${newProduct.partNo}</p>
            <div class="actions">
                <button class="quantity-btn">+1</button>
                <button class="favorite-btn">Add to favorite</button>
                <button class="buy-btn">Buy</button>
            </div>
        </div>
    `;
    
    // Add to the beginning of the product grid
    productGrid.prepend(newProductCard);
    
    // Update product count
    updateProductCount();
    
    // Reset form and close modal
    this.reset();
    addProductModal.classList.remove('active');
    overlay.classList.remove('active');
    
    // Update favorite buttons
    updateFavoriteButtons();
});

// Function to update product count
function updateProductCount() {
    const productCount = document.querySelectorAll('.product-card').length;
    document.querySelector('.shop-info span').textContent = `Showing 1-${productCount} of ${productCount} products`;
}

// Initialize product count
updateProductCount();
// Search functionality
const searchBox = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const productGrid = document.querySelector('.product-grid');

// Store original products for resetting search
let originalProducts = [...productGrid.children];

// Search when Enter key is pressed in search box
searchBox.addEventListener('keyup', function(e) {
if (e.key === 'Enter') {
searchProducts();
}
});

// Search when search button is clicked
searchBtn.addEventListener('click', searchProducts);

function searchProducts() {
const searchTerm = searchBox.value.toLowerCase().trim();

if (!searchTerm) {
// If search is empty, show all products
productGrid.innerHTML = '';
originalProducts.forEach(product => {
    productGrid.appendChild(product);
});
updateProductCount();
return;
}

// Filter products
const filteredProducts = Object.values(products).filter(product => {
return (
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.sku.toLowerCase().includes(searchTerm) ||
    product.compatibility.toLowerCase().includes(searchTerm) ||
    product.partNo.toLowerCase().includes(searchTerm)
);
});

// Display filtered products
displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
productGrid.innerHTML = '';

if (filteredProducts.length === 0) {
productGrid.innerHTML = '<p class="no-results">No products found matching your search.</p>';
updateProductCount();
return;
}

filteredProducts.forEach(product => {
const productCard = document.createElement('div');
productCard.className = 'product-card';
productCard.setAttribute('data-id', product.id);
productCard.onclick = function() { toggleDetails(this); };

productCard.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.category}</p>
    <p>SKU: <span>${product.sku}</span></p>
    <p class="price">${product.price}</p>
    <div class="product-details">
        <p><span class="rating">${product.rating}</span> | ${product.sold}</p>
        <p><strong>${product.location}</strong></p>
        <p>${product.compatibility}</p>
        <p>${product.partNo}</p>
        <div class="actions">
            <button class="quantity-btn">+1</button>
            <button class="favorite-btn">Add to favorite</button>
            <button class="buy-btn">Buy</button>
        </div>
    </div>
`;

productGrid.appendChild(productCard);
});

// Update favorite buttons for the new filtered products
updateFavoriteButtons();
updateProductCount();
}
overlay.addEventListener('click', () => {
sidebar.classList.remove('active');
favoritesSidebar.classList.remove('active');
overlay.classList.remove('active');
ratingModal.classList.remove('active');
purchaseModal.classList.remove('active');
addProductModal.classList.remove('active');

// Reset search when clicking outside
searchBox.value = '';
productGrid.innerHTML = '';
originalProducts.forEach(product => {
productGrid.appendChild(product);
});
updateProductCount();
});
// Initialize original products array
originalProducts = [...productGrid.children];
// Function to open billing history
function openBillingHistory(url) {
    window.location.href = url;
}