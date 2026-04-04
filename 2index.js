// app.js
// DOM Elements
const menuContainer = document.getElementById('menuContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const categoryFiltersContainer = document.getElementById('categoryFilters');
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const cartBadge = document.getElementById('cartBadge');
const cartOpenBtn = document.getElementById('cartOpenBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeMobileNav = document.getElementById('closeMobileNav');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const heroMenuBtn = document.getElementById('heroMenuBtn');
const header = document.getElementById('mainHeader');

// Global State
let cart = [];
let searchQuery = "";
let activeCategory = "all";
let cartOpen = false;
let mobileNavOpen = false;
let scrolled = false;

const ORNG = "#ff6b00";

// Helper Functions
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function getCartCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
}

function getCartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartBadge() {
    const count = getCartCount();
    if (count > 0) {
        cartBadge.style.display = 'flex';
        cartBadge.textContent = count;
        const cartText = document.querySelector('.cart-text');
        if (cartText) cartText.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    } else {
        cartBadge.style.display = 'none';
        const cartText = document.querySelector('.cart-text');
        if (cartText) cartText.textContent = 'Cart';
    }
}

function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        cart = cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
        cart = [...cart, { ...item, qty: 1 }];
    }
    updateCartBadge();
    renderCartSidebar();
}

function updateQty(id, delta) {
    cart = cart.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0);
    updateCartBadge();
    renderCartSidebar();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartBadge();
    renderCartSidebar();
}

function lockBody(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
}

function setCartOpenState(open) {
    cartOpen = open;
    cartSidebar.style.display = open ? 'block' : 'none';
    lockBody(open);
    if (open) renderCartSidebar();
}

function setMobileNavState(open) {
    mobileNavOpen = open;
    mobileDrawer.style.display = open ? 'block' : 'none';
    lockBody(open);
}

function scrollToCategory(catId) {
    activeCategory = catId;
    renderCategoryFilters();
    renderMenu();
    const el = document.getElementById(`sec-${catId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (mobileNavOpen) setMobileNavState(false);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Filtered Items
function getFilteredItems() {
    return ITEMS.filter(item => {
        const matchCat = activeCategory === "all" || item.cat === activeCategory;
        const matchSearch = searchQuery === "" ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });
}

function getGroupedItems() {
    const filtered = getFilteredItems();
    const groups = [];
    for (let cat of CAT_ORDER) {
        const items = filtered.filter(i => i.cat === cat);
        if (items.length) groups.push({ cat, items });
    }
    return groups;
}

// Render Functions
function renderCategoryFilters() {
    categoryFiltersContainer.innerHTML = CATS.map(c => `
        <button class="filter-cat-btn" data-cat="${c.id}" style="display:inline-flex; align-items:center; gap:5px; padding:7px 16px; border-radius:50px; font-weight:600; font-size:13px; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all .2s; border:2px solid ${activeCategory === c.id ? ORNG : '#e8e8e8'}; background:${activeCategory === c.id ? ORNG : '#fff'}; color:${activeCategory === c.id ? '#fff' : '#555'};">
            ${c.emoji} ${c.label}
        </button>
    `).join('');

    document.querySelectorAll('.filter-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.cat;
            renderCategoryFilters();
            renderMenu();
        });
    });
}

function renderMobileNavLinks() {
    const drawerLinks = document.getElementById('mobileNavLinks');
    drawerLinks.innerHTML = CATS.map(c => `
        <button class="mobile-cat-btn" data-cat="${c.id}" style="display:block; width:100%; text-align:left; padding:13px 22px; background:none; border:none; color:rgba(255,255,255,0.7); font-size:15px; font-weight:500; cursor:pointer; border-left: ${activeCategory === c.id ? `3px solid ${ORNG}` : "3px solid transparent"}; transition:all .2s;">
            ${c.emoji}&nbsp;&nbsp;${c.label}
        </button>
    `).join('');

    document.querySelectorAll('.mobile-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => scrollToCategory(btn.dataset.cat));
    });
}

function renderProductCard(item) {
    const color = C_COLOR[item.cat];
    const emoji = C_EMOJI[item.cat];
    return `
        <div class="product-card">
            <div style="height:148px; background:linear-gradient(135deg,${color}22 0%,${color}44 100%); display:flex; align-items:center; justify-content:center; position:relative; flex-shrink:0;">
                <span style="font-size:58px; line-height:1; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.15));">${emoji}</span>
                ${item.popular ? '<span style="position:absolute; top:10px; left:10px; background:#ff6b00; color:#fff; font-size:10px; font-weight:700; padding:3px 8px; border-radius:20px; letter-spacing:0.5px;">🔥 POPULAR</span>' : ''}
            </div>
            <div style="padding:14px 16px 16px; flex:1; display:flex; flex-direction:column; gap:6px;">
                <h3 style="font-family:\'Poppins\',sans-serif; font-weight:700; font-size:14px; color:#1a1a1a; margin:0; line-height:1.3;">${escapeHtml(item.name)}</h3>
                <p style="color:#999; font-size:12px; margin:0; line-height:1.55; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${escapeHtml(item.desc)}</p>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-top:4px;">
                    <span style="font-family:\'Poppins\',sans-serif; font-weight:800; font-size:17px; color:#ff6b00;">Rs.&nbsp;${item.price.toLocaleString()}</span>
                    <button class="add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-cat="${item.cat}" data-price="${item.price}" data-desc="${item.desc}" data-popular="${item.popular}" style="background:#ff6b00; color:#fff; border:none; border-radius:10px; padding:8px 16px; font-weight:700; font-size:13px; cursor:pointer; transition:all .25s ease; min-width:80px; font-family:\'Inter\',sans-serif;">+ Add</button>
                </div>
            </div>
        </div>
    `;
}

function renderMenu() {
    const grouped = getGroupedItems();

    if (grouped.length === 0) {
        menuContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-emoji">🍽️</div>
                <h3 class="empty-title">Nothing found</h3>
                <p class="empty-text">Try a different keyword</p>
                <button id="clearFiltersBtn" class="clear-filters-btn">Clear Filters</button>
            </div>
        `;
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                searchQuery = "";
                activeCategory = "all";
                searchInput.value = "";
                clearSearchBtn.style.display = 'none';
                renderCategoryFilters();
                renderMenu();
            });
        }
        return;
    }

    menuContainer.innerHTML = grouped.map(({ cat, items }) => `
        <section id="sec-${cat}" class="menu-section">
            <div class="section-header">
                <div class="section-icon" style="background:linear-gradient(135deg,${C_COLOR[cat]}22,${C_COLOR[cat]}55); border:2px solid ${C_COLOR[cat]}44;">
                    ${C_EMOJI[cat]}
                </div>
                <div>
                    <h2 class="section-title">${cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                    <span class="section-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="section-divider"></div>
            </div>
            <div class="products-grid">
                ${items.map(item => renderProductCard(item)).join('')}
            </div>
        </section>
    `).join('');

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const item = ITEMS.find(i => i.id === id);
            if (item) addToCart(item);
            const originalText = btn.innerText;
            btn.innerText = "✓ Added!";
            btn.style.background = "#10b981";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "#ff6b00";
            }, 1200);
        });
    });
}

function renderCartSidebar() {
    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div style="text-align:center; padding:40px; color:#999;">Your cart is empty<br>🍔 Add some delicious items!</div>';
        cartTotalAmount.textContent = 'Rs. 0';
        return;
    }

    cartItemsList.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #eee;">
            <div style="flex:2;">
                <h4 style="font-size:14px; font-weight:700;">${escapeHtml(item.name)}</h4>
                <p style="font-size:12px; color:#ff6b00; font-weight:600;">Rs. ${item.price}</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button class="cart-qty-btn" data-id="${item.id}" data-delta="-1" style="width:28px; height:28px; border-radius:8px; border:1px solid #ddd; background:#fff; cursor:pointer;">-</button>
                <span style="font-weight:600; min-width:24px; text-align:center;">${item.qty}</span>
                <button class="cart-qty-btn" data-id="${item.id}" data-delta="1" style="width:28px; height:28px; border-radius:8px; border:1px solid #ddd; background:#fff; cursor:pointer;">+</button>
                <button class="cart-remove-btn" data-id="${item.id}" style="background:none; border:none; color:#e53935; cursor:pointer; font-size:18px;">🗑️</button>
            </div>
        </div>
    `).join('');

    cartTotalAmount.textContent = `Rs. ${getCartTotal().toLocaleString()}`;

    document.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const delta = parseInt(btn.dataset.delta);
            updateQty(id, delta);
        });
    });

    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removeItem(id);
        });
    });
}

function handleScroll() {
    const y = window.scrollY;
    scrolled = y > 60;
    if (scrolled) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    scrollTopBtn.style.display = y > 450 ? 'flex' : 'none';
}

// Event Listeners Setup
function setupEventListeners() {
    window.addEventListener('scroll', handleScroll);

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        renderMenu();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchQuery = "";
        searchInput.value = "";
        clearSearchBtn.style.display = 'none';
        renderMenu();
    });

    cartOpenBtn.addEventListener('click', () => setCartOpenState(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => setCartOpenState(false));
    if (cartSidebar) cartSidebar.addEventListener('click', (e) => {
        if (e.target === cartSidebar || e.target.classList.contains('cart-overlay')) {
            setCartOpenState(false);
        }
    });

    hamburgerBtn.addEventListener('click', () => {
        renderMobileNavLinks();
        setMobileNavState(true);
    });
    if (closeMobileNav) closeMobileNav.addEventListener('click', () => setMobileNavState(false));
    if (mobileDrawer) mobileDrawer.addEventListener('click', (e) => {
        if (e.target === mobileDrawer || e.target.classList.contains('drawer-overlay')) {
            setMobileNavState(false);
        }
    });

    heroMenuBtn.addEventListener('click', () => scrollToCategory('deals'));
    scrollTopBtn.addEventListener('click', scrollToTop);

    document.querySelectorAll('.nav-desk-btn').forEach(btn => {
        btn.addEventListener('click', () => scrollToCategory(btn.dataset.cat));
    });

    document.getElementById('logoLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToTop();
    });
}

// Initialize App
function init() {
    renderCategoryFilters();
    renderMenu();
    updateCartBadge();
    setupEventListeners();
    handleScroll();
}

init();