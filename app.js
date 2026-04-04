// app.js
// DOM Elements
const menuContainer = document.getElementById("menuContainer");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const categoryFiltersContainer = document.getElementById("categoryFilters");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalAmount = document.getElementById("cartTotalAmount");
const cartBadge = document.getElementById("cartBadge");
const cartOpenBtn = document.getElementById("cartOpenBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileDrawer = document.getElementById("mobileDrawer");
const closeMobileNav = document.getElementById("closeMobileNav");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const heroMenuBtn = document.getElementById("heroMenuBtn");
const header = document.getElementById("mainHeader");

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
    if (!str) return "";
    return str.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
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
        cartBadge.style.display = "flex";
        cartBadge.textContent = count;
        const cartText = document.querySelector(".cart-text");
        if (cartText)
            cartText.textContent = `${count} item${count !== 1 ? "s" : ""}`;
    } else {
        cartBadge.style.display = "none";
        const cartText = document.querySelector(".cart-text");
        if (cartText) cartText.textContent = "Cart";
    }
}

function addToCart(item) {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
        cart = cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
        cart = [...cart, { ...item, qty: 1 }];
    }
    updateCartBadge();
    renderCartSidebar();
}

function updateQty(id, delta) {
    cart = cart
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0);
    updateCartBadge();
    renderCartSidebar();
}

function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    updateCartBadge();
    renderCartSidebar();
}

function lockBody(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
}

function setCartOpenState(open) {
    cartOpen = open;

    if (open) {
        cartSidebar.style.display = 'block';
        renderCartSidebar();
        setTimeout(() => {
            cartSidebar.classList.add('active');
        }, 10);
        lockBody(true);
    } else {
        cartSidebar.classList.remove('active');
        setTimeout(() => {
            if (!cartOpen) {
                cartSidebar.style.display = 'none';
            }
        }, 300);
        lockBody(false);
    }
}

function setMobileNavState(open) {
    mobileNavOpen = open;
    mobileDrawer.style.display = open ? "block" : "none";
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
    return ITEMS.filter((item) => {
        const matchCat = activeCategory === "all" || item.cat === activeCategory;
        const matchSearch =
            searchQuery === "" ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });
}

function getGroupedItems() {
    const filtered = getFilteredItems();
    const groups = [];
    for (let cat of CAT_ORDER) {
        const items = filtered.filter((i) => i.cat === cat);
        if (items.length) groups.push({ cat, items });
    }
    return groups;
}

// Render Functions
function renderCategoryFilters() {
    categoryFiltersContainer.innerHTML = CATS.map(
        (c) => `
        <button class="filter-cat-btn ${activeCategory === c.id ? "active" : ""}" data-cat="${c.id}">
            <i class="${c.icon}"></i> ${c.label}
        </button>
    `,
    ).join("");

    document.querySelectorAll(".filter-cat-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            activeCategory = btn.dataset.cat;
            renderCategoryFilters();
            renderMenu();
        });
    });
}

function renderMobileNavLinks() {
    const drawerLinks = document.getElementById("mobileNavLinks");
    drawerLinks.innerHTML = CATS.map(
        (c) => `
        <button class="mobile-cat-btn ${activeCategory === c.id ? "active" : ""}" data-cat="${c.id}">
            <i class="${c.icon}" style="width:22px;"></i> ${c.label}
        </button>
    `,
    ).join("");

    document.querySelectorAll(".mobile-cat-btn").forEach((btn) => {
        btn.addEventListener("click", () => scrollToCategory(btn.dataset.cat));
    });
}

function renderProductCard(item) {
    const color = C_COLOR[item.cat];
    const emoji = C_EMOJI[item.cat];
    return `
        <div class="product-card">
            <div class="product-card-image" style="background:linear-gradient(135deg,${color}22 0%,${color}44 100%);">
                <span>${emoji}</span>
                ${item.popular ? '<span class="popular-badge"><i class="fas fa-fire"></i> POPULAR</span>' : ""}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${escapeHtml(item.name)}</h3>
                <p class="product-card-desc">${escapeHtml(item.desc)}</p>
                <div class="product-card-footer">
                    <span class="product-card-price">Rs.&nbsp;${item.price.toLocaleString()}</span>
                    <button class="product-card-add-btn" data-id="${item.id}">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Convert description string to bullet points
function getDescriptionBulletPoints(desc) {
    const parts = desc.split(",").map((part) => part.trim());
    if (parts.length >= 2) {
        return parts;
    }
    if (desc.length < 40) {
        return [desc];
    }
    let bullets = [];
    let temp = desc;
    if (temp.includes(" with ")) {
        bullets = temp.split(" with ");
    } else if (temp.includes(" and ")) {
        bullets = temp.split(" and ");
    } else if (temp.includes(" + ")) {
        bullets = temp.split(" + ");
    } else {
        bullets = [desc];
    }
    return bullets;
}

// Image Viewer Modal
function showImageModal(imageUrl, itemName) {
    let imageModal = document.getElementById("imageViewerModal");

    if (!imageModal) {
        imageModal = document.createElement("div");
        imageModal.id = "imageViewerModal";
        imageModal.className = "image-viewer-modal";
        imageModal.innerHTML = `
            <div class="image-viewer-overlay"></div>
            <div class="image-viewer-container">
                <button class="image-viewer-close"><i class="fas fa-times"></i></button>
                <img src="" alt="" class="image-viewer-img">
                <p class="image-viewer-caption"></p>
            </div>
        `;
        document.body.appendChild(imageModal);

        const style = document.createElement("style");
        style.textContent = `
            .image-viewer-modal {
                position: fixed;
                inset: 0;
                z-index: 1000;
                visibility: hidden;
                transition: visibility 0.3s ease;
            }
            .image-viewer-modal.active {
                visibility: visible;
            }
            .image-viewer-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0);
                backdrop-filter: blur(0px);
                transition: all 0.3s ease;
            }
            .image-viewer-modal.active .image-viewer-overlay {
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(8px);
            }
            .image-viewer-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                opacity: 0;
                transition: all 0.3s ease;
                text-align: center;
            }
            .image-viewer-modal.active .image-viewer-container {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            .image-viewer-img {
                max-width: 80vw;
                max-height: 70vh;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .image-viewer-caption {
                color: #fff;
                margin-top: 20px;
                font-size: 16px;
                font-weight: 500;
            }
            .image-viewer-close {
                position: absolute;
                top: -50px;
                right: -50px;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .image-viewer-close:hover {
                background: #ff6b00;
                transform: rotate(90deg);
            }
            @media (max-width: 640px) {
                .image-viewer-close {
                    top: -60px;
                    right: 0;
                }
                .image-viewer-img {
                    max-width: 90vw;
                    max-height: 60vh;
                }
            }
        `;
        document.head.appendChild(style);
    }

    const img = imageModal.querySelector(".image-viewer-img");
    const caption = imageModal.querySelector(".image-viewer-caption");
    img.src = imageUrl;
    caption.textContent = itemName;

    imageModal.style.display = "block";
    setTimeout(() => {
        imageModal.classList.add("active");
    }, 10);
    lockBody(true);

    const closeBtn = imageModal.querySelector(".image-viewer-close");
    const overlay = imageModal.querySelector(".image-viewer-overlay");

    const closeModal = () => {
        imageModal.classList.remove("active");
        setTimeout(() => {
            imageModal.style.display = "none";
            lockBody(false);
        }, 300);
    };

    closeBtn.onclick = closeModal;
    overlay.onclick = closeModal;
}

// Get recommendations based on category
function getRecommendations(currentItem) {
    const sameCategory = ITEMS.filter(
        (item) => item.cat === currentItem.cat && item.id !== currentItem.id,
    );
    const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
}

// Product Modal Functions
let currentModalItem = null;
let modalQuantity = 1;

function openProductModal(item) {
    currentModalItem = item;
    modalQuantity = 1;

    const modal = document.getElementById("productModal");
    const modalContent = document.getElementById("modalContent");
    const color = C_COLOR[item.cat];
    const emoji = C_EMOJI[item.cat];
    const categoryIcon =
        CATS.find((c) => c.id === item.cat)?.icon || "fas fa-utensils";
    const recommendations = getRecommendations(item);
    const descriptionBullets = getDescriptionBulletPoints(item.desc);
    const imageUrl = `https://via.placeholder.com/400x300/${color.slice(1)}/ffffff?text=${encodeURIComponent(emoji)}`;

    modalContent.innerHTML = `
        <div class="modal-two-column">
            <div class="modal-left">
                <div class="modal-product-image" style="background: linear-gradient(135deg, ${color}22 0%, ${color}44 100%); cursor: pointer;" id="modalProductImage">
                    <span class="modal-product-emoji">${emoji}</span>
                    <div class="image-hint">
                        <i class="fas fa-search-plus"></i> Click to enlarge
                    </div>
                    ${item.popular ? '<span class="modal-popular-badge"><i class="fas fa-fire"></i> POPULAR</span>' : ""}
                </div>
                
                <div class="modal-info-section">
                    <h2 class="modal-product-name">${escapeHtml(item.name)}</h2>
                    <span class="modal-product-category">
                        <i class="${categoryIcon}"></i> ${item.cat.charAt(0).toUpperCase() + item.cat.slice(1)}
                    </span>
                </div>
                
                <div class="modal-description-section">
                    <h4 class="modal-section-title"><i class="fas fa-info-circle"></i> Description</h4>
                    <ul class="modal-bullet-list">
                        ${descriptionBullets.map((bullet) => `<li><i class="fas fa-chevron-right"></i> ${escapeHtml(bullet)}</li>`).join("")}
                    </ul>
                </div>
            </div>
            
            <div class="modal-right">
                ${recommendations.length > 0
            ? `
                <div class="modal-recommendations">
                    <h4 class="modal-section-title"><i class="fas fa-star"></i> You May Also Like</h4>
                    <div class="recommendations-list">
                        ${recommendations
                .map(
                    (rec) => `
                            <div class="recommendation-item" data-id="${rec.id}">
                                <span class="rec-emoji">${C_EMOJI[rec.cat]}</span>
                                <div class="rec-info">
                                    <div class="rec-name">${escapeHtml(rec.name)}</div>
                                    <div class="rec-price">Rs. ${rec.price.toLocaleString()}</div>
                                </div>
                                <button class="rec-add-btn" data-id="${rec.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        `,
                )
                .join("")}
                    </div>
                </div>
                `
            : ""
        }
                <div class="modal-right-inner">
                    <div>                
                        <div class="modal-price-section">
                            <div class="modal-product-price">Rs. ${item.price.toLocaleString()}</div>
                            <div class="modal-price-note">* Inclusive of all taxes</div>
                        </div>
                        
                        <div class="modal-quantity-section">
                            <span class="modal-quantity-label">Quantity:</span>
                            <div class="modal-quantity-controls">
                                <button class="modal-qty-btn" id="modalQtyMinus">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="modal-quantity-value" id="modalQtyValue">1</span>
                                <button class="modal-qty-btn" id="modalQtyPlus">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <button class="modal-add-to-cart-btn" id="modalAddToCartBtn">
                        <i class="fas fa-cart-plus"></i> Add to Cart - Rs. ${item.price.toLocaleString()}
                    </button>
                    
                    <div class="modal-delivery-info">
                        <div class="delivery-item">
                            <i class="fas fa-truck"></i>
                            <span>Free delivery on orders above Rs. 1000</span>
                        </div>
                        <div class="delivery-item">
                            <i class="fas fa-clock"></i>
                            <span>Estimated delivery: 30-45 min</span>
                        </div>
                        <div class="delivery-item">
                            <i class="fas fa-credit-card"></i>
                            <span>Cash on Delivery | Online Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);
    lockBody(true);

    const productImage = document.getElementById("modalProductImage");
    if (productImage) {
        productImage.addEventListener("click", () => {
            showImageModal(imageUrl, item.name);
        });
    }

    const minusBtn = document.getElementById("modalQtyMinus");
    const plusBtn = document.getElementById("modalQtyPlus");
    const qtyValue = document.getElementById("modalQtyValue");
    const addToCartBtn = document.getElementById("modalAddToCartBtn");

    if (minusBtn) {
        minusBtn.addEventListener("click", () => {
            if (modalQuantity > 1) {
                modalQuantity--;
                qtyValue.textContent = modalQuantity;
                addToCartBtn.innerHTML = `<i class="fas fa-cart-plus"></i> Add to Cart - Rs. ${(item.price * modalQuantity).toLocaleString()}`;
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener("click", () => {
            modalQuantity++;
            qtyValue.textContent = modalQuantity;
            addToCartBtn.innerHTML = `<i class="fas fa-cart-plus"></i> Add to Cart - Rs. ${(item.price * modalQuantity).toLocaleString()}`;
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            for (let i = 0; i < modalQuantity; i++) {
                addToCart(item);
            }

            // closeProductModal();

            const originalText = addToCartBtn.innerHTML;
            addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
            addToCartBtn.style.background = "#10b981";
            setTimeout(() => {
                if (document.getElementById("modalAddToCartBtn")) {
                    addToCartBtn.innerHTML = originalText;
                    addToCartBtn.style.background = "";
                }
            }, 1000);
        });
    }

    document.querySelectorAll(".recommendation-item").forEach((recItem) => {
        const recId = parseInt(recItem.dataset.id);
        const recItemData = ITEMS.find((i) => i.id === recId);

        if (recItemData) {
            recItem.addEventListener("click", (e) => {
                if (!e.target.closest(".rec-add-btn")) {
                    closeProductModal();
                    setTimeout(() => {
                        openProductModal(recItemData);
                    }, 300);
                }
            });

            const recAddBtn = recItem.querySelector(".rec-add-btn");
            if (recAddBtn) {
                recAddBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    addToCart(recItemData);
                    recAddBtn.innerHTML = '<i class="fas fa-check"></i>';
                    recAddBtn.style.background = "#10b981";
                    setTimeout(() => {
                        recAddBtn.innerHTML = '<i class="fas fa-plus"></i>';
                        recAddBtn.style.background = "";
                    }, 1000);
                });
            }
        }
    });
}

function closeProductModal() {
    const modal = document.getElementById("productModal");
    if (modal) {
        modal.classList.remove("active");
        setTimeout(() => {
            modal.style.display = "none";
            currentModalItem = null;
            modalQuantity = 1;
        }, 300);
        lockBody(false);
    }
}

function attachProductCardClickListeners() {
    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".product-card-add-btn")) return;

            const addBtn = card.querySelector(".product-card-add-btn");
            if (addBtn) {
                const itemId = parseInt(addBtn.dataset.id);
                const item = ITEMS.find((i) => i.id === itemId);
                if (item) {
                    openProductModal(item);
                }
            }
        });
    });
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
        const clearFiltersBtn = document.getElementById("clearFiltersBtn");
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener("click", () => {
                searchQuery = "";
                activeCategory = "all";
                searchInput.value = "";
                clearSearchBtn.style.display = "none";
                renderCategoryFilters();
                renderMenu();
            });
        }
        return;
    }

    menuContainer.innerHTML = grouped
        .map(({ cat, items }) => {
            const catIcon = CATS.find((c) => c.id === cat)?.icon || "fas fa-utensils";
            return `
        <section id="sec-${cat}" class="menu-section">
            <div class="section-header">
                <div class="section-icon">
                    <i class="${catIcon}"></i>
                </div>
                <div>
                    <h2 class="section-title">${cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                    <span class="section-count">${items.length} item${items.length !== 1 ? "s" : ""}</span>
                </div>
                <div class="section-divider"></div>
            </div>
            <div class="products-grid">
                ${items.map((item) => renderProductCard(item)).join("")}
            </div>
        </section>
    `;
        })
        .join("");

    document.querySelectorAll(".product-card-add-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const item = ITEMS.find((i) => i.id === id);
            if (item) addToCart(item);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            btn.style.background = "#10b981";
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = "#ff6b00";
            }, 1200);
        });
    });

    attachProductCardClickListeners();
}

function renderCartSidebar() {
    if (!cartItemsList) return;

    const cartActions = document.querySelector(".cart-actions");
    const checkoutForm = document.getElementById("checkoutForm");
    const placeOrderBtn = document.getElementById("placeOrderBtn");

    if (cart.length === 0) {
        cartItemsList.innerHTML =
            '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
        cartTotalAmount.textContent = "Rs. 0";

        // Hide checkout form and place order button when cart is empty
        if (checkoutForm) checkoutForm.style.display = "none";
        if (placeOrderBtn) placeOrderBtn.style.display = "none";
        if (cartActions) cartActions.classList.remove("has-items");
        return;
    }

    // Show checkout form and place order button when cart has items
    if (checkoutForm) checkoutForm.style.display = "block";
    if (placeOrderBtn) placeOrderBtn.style.display = "flex";
    if (cartActions) cartActions.classList.add("has-items");

    cartItemsList.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${escapeHtml(item.name)}</h4>
                <p class="cart-item-price">Rs. ${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-actions">
                <button class="cart-qty-btn" data-id="${item.id}" data-delta="-1">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="cart-qty-value">${item.qty}</span>
                <button class="cart-qty-btn" data-id="${item.id}" data-delta="1">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="cart-remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `,
        )
        .join("");

    cartTotalAmount.textContent = `Rs. ${getCartTotal().toLocaleString()}`;

    document.querySelectorAll(".cart-qty-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            const delta = parseInt(btn.dataset.delta);
            updateQty(id, delta);
        });
    });

    document.querySelectorAll(".cart-remove-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            removeItem(id);
        });
    });
}

// Place Order Function
function placeOrder() {
    if (cart.length === 0) {
        showToast("Your cart is empty!", "warning");
        return;
    }

    // Get customer details
    const customerName = document.getElementById("customerName")?.value.trim();
    const customerAddress = document
        .getElementById("customerAddress")
        ?.value.trim();
    const specialInstructions = document
        .getElementById("specialInstructions")
        ?.value.trim();

    // Validate required fields
    if (!customerName) {
        showToast("Please enter your name", "warning");
        document.getElementById("customerName")?.focus();
        return;
    }

    if (!customerAddress) {
        showToast("Please enter your delivery address", "warning");
        document.getElementById("customerAddress")?.focus();
        return;
    }

    // Prepare order data
    const orderData = {
        orderId: "ORD-" + Date.now(),
        customer: {
            name: customerName,
            address: customerAddress,
            instructions: specialInstructions || "No special instructions",
        },
        items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            total: item.price * item.qty,
        })),
        subtotal: getCartTotal(),
        deliveryFee: getCartTotal() > 1000 ? 0 : 100,
        total: getCartTotal() + (getCartTotal() > 1000 ? 0 : 100),
        orderDate: new Date().toLocaleString(),
    };

    // Log to console
    console.log("=".repeat(60));
    console.log("🛍️ NEW ORDER PLACED 🛍️");
    console.log("=".repeat(60));
    console.log("📋 ORDER ID:", orderData.orderId);
    console.log("📅 DATE:", orderData.orderDate);
    console.log("-".repeat(60));
    console.log("👤 CUSTOMER DETAILS:");
    console.log("   Name:", orderData.customer.name);
    console.log("   Address:", orderData.customer.address);
    console.log("   Instructions:", orderData.customer.instructions);
    console.log("-".repeat(60));
    console.log("🛒 ORDER ITEMS:");
    orderData.items.forEach((item, index) => {
        console.log(
            `   ${index + 1}. ${item.name} x ${item.quantity} = Rs. ${item.total.toLocaleString()}`,
        );
    });
    console.log("-".repeat(60));
    console.log("💰 ORDER SUMMARY:");
    console.log("   Subtotal: Rs.", orderData.subtotal.toLocaleString());
    console.log("   Delivery Fee: Rs.", orderData.deliveryFee);
    console.log("   TOTAL: Rs.", orderData.total.toLocaleString());
    console.log("=".repeat(60));
    console.log("✅ Order ready for processing!");
    console.log("=".repeat(60));

    // Show success message
    showToast(
        `Order placed successfully! Total: Rs. ${orderData.total.toLocaleString()}`,
        "success",
    );

    // Clear cart and form
    cart = [];
    updateCartBadge();
    renderCartSidebar();

    // Clear form fields
    if (document.getElementById("customerName"))
        document.getElementById("customerName").value = "";
    if (document.getElementById("customerAddress"))
        document.getElementById("customerAddress").value = "";
    if (document.getElementById("specialInstructions"))
        document.getElementById("specialInstructions").value = "";

    // Close cart sidebar after short delay
    setTimeout(() => {
        setCartOpenState(false);
    }, 2000);
}

function handleScroll() {
    const y = window.scrollY;
    scrolled = y > 60;
    if (scrolled) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
    scrollTopBtn.style.display = y > 450 ? "flex" : "none";
}

// Category scroll arrows functionality with auto-hide
function setupCategoryScroll() {
    const categoryFilters = document.getElementById("categoryFilters");
    const scrollLeftBtn = document.getElementById("categoryScrollLeft");
    const scrollRightBtn = document.getElementById("categoryScrollRight");

    if (!categoryFilters || !scrollLeftBtn || !scrollRightBtn) return;

    const scrollAmount = 200;

    function updateArrowsVisibility() {
        const isScrollable =
            categoryFilters.scrollWidth > categoryFilters.clientWidth;

        if (isScrollable) {
            scrollLeftBtn.style.display = "flex";
            scrollRightBtn.style.display = "flex";

            const maxScrollLeft =
                categoryFilters.scrollWidth - categoryFilters.clientWidth;

            if (categoryFilters.scrollLeft <= 5) {
                scrollLeftBtn.style.opacity = "0.5";
                scrollLeftBtn.style.cursor = "not-allowed";
                scrollLeftBtn.disabled = true;
            } else {
                scrollLeftBtn.style.opacity = "1";
                scrollLeftBtn.style.cursor = "pointer";
                scrollLeftBtn.disabled = false;
            }

            if (categoryFilters.scrollLeft >= maxScrollLeft - 5) {
                scrollRightBtn.style.opacity = "0.5";
                scrollRightBtn.style.cursor = "not-allowed";
                scrollRightBtn.disabled = true;
            } else {
                scrollRightBtn.style.opacity = "1";
                scrollRightBtn.style.cursor = "pointer";
                scrollRightBtn.disabled = false;
            }
        } else {
            scrollLeftBtn.style.display = "none";
            scrollRightBtn.style.display = "none";
        }
    }

    scrollLeftBtn.addEventListener("click", () => {
        if (categoryFilters.scrollLeft > 5) {
            categoryFilters.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    });

    scrollRightBtn.addEventListener("click", () => {
        const maxScroll = categoryFilters.scrollWidth - categoryFilters.clientWidth;
        if (categoryFilters.scrollLeft < maxScroll - 5) {
            categoryFilters.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    });

    categoryFilters.addEventListener("scroll", updateArrowsVisibility);
    window.addEventListener("resize", () =>
        setTimeout(updateArrowsVisibility, 100),
    );

    const observer = new MutationObserver(() =>
        setTimeout(updateArrowsVisibility, 100),
    );
    observer.observe(categoryFilters, { childList: true, subtree: true });

    setTimeout(updateArrowsVisibility, 100);
}

// Event Listeners Setup
function setupEventListeners() {
    window.addEventListener("scroll", handleScroll);

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        clearSearchBtn.style.display = searchQuery ? "block" : "none";
        renderMenu();
    });

    clearSearchBtn.addEventListener("click", () => {
        searchQuery = "";
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        renderMenu();
    });

    cartOpenBtn.addEventListener("click", () => setCartOpenState(true));
    if (closeCartBtn)
        closeCartBtn.addEventListener("click", () => setCartOpenState(false));
    if (cartSidebar)
        cartSidebar.addEventListener("click", (e) => {
            if (
                e.target === cartSidebar ||
                e.target.classList.contains("cart-overlay")
            ) {
                setCartOpenState(false);
            }
        });

    hamburgerBtn.addEventListener("click", () => {
        renderMobileNavLinks();
        setMobileNavState(true);
    });
    if (closeMobileNav)
        closeMobileNav.addEventListener("click", () => setMobileNavState(false));
    if (mobileDrawer)
        mobileDrawer.addEventListener("click", (e) => {
            if (
                e.target === mobileDrawer ||
                e.target.classList.contains("drawer-overlay")
            ) {
                setMobileNavState(false);
            }
        });

    heroMenuBtn.addEventListener("click", () => scrollToCategory("deals"));
    scrollTopBtn.addEventListener("click", scrollToTop);

    document.getElementById("logoLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToTop();
    });

    setupCategoryScroll();

    const productModal = document.getElementById("productModal");
    const closeModalBtn = document.getElementById("closeModalBtn");

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeProductModal);
    }

    if (productModal) {
        productModal.addEventListener("click", (e) => {
            if (
                e.target === productModal ||
                e.target.classList.contains("modal-overlay")
            ) {
                closeProductModal();
            }
        });
    }

    // Place Order Button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }

    // Order Confirmation Modal events
    const orderConfirmModal = document.getElementById('orderConfirmModal');
    const closeOrderConfirmBtn = document.getElementById('closeOrderConfirmBtn');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');

    if (closeOrderConfirmBtn) {
        closeOrderConfirmBtn.addEventListener('click', closeOrderConfirmation);
    }

    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', closeOrderConfirmation);
    }

    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', confirmAndSendOrder);
    }

    if (orderConfirmModal) {
        orderConfirmModal.addEventListener('click', (e) => {
            if (e.target === orderConfirmModal || e.target.classList.contains('order-confirm-overlay')) {
                closeOrderConfirmation();
            }
        });
    }
}

// Shop Hours Configuration
const SHOP_HOURS = {
    open: 12,
    close: 14,
    timezone: "Asia/Karachi",
    message:
        "🕐 We're currently closed! Our shop opens at 12:00 PM. Order now for delivery when we open! 🌙",
};

// Toast Notification System
function showToast(message, type = "warning") {
    let toast = document.getElementById("customToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "customToast";
        toast.className = "custom-toast";
        document.body.appendChild(toast);
    }

    let icon = "";
    if (type === "warning") icon = "⏰";
    if (type === "error") icon = "🔒";
    if (type === "info") icon = "ℹ️";
    if (type === "success") icon = "✅";

    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;

    setTimeout(() => toast.classList.add("show"), 100);

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
        toast.classList.remove("show");
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    });

    setTimeout(() => {
        if (toast && toast.classList.contains("show")) {
            toast.classList.remove("show");
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }
    }, 10000);
}

function isShopOpen() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const openTimeInMinutes = SHOP_HOURS.open * 60;
    let closeTimeInMinutes = SHOP_HOURS.close * 60;

    if (SHOP_HOURS.close <= SHOP_HOURS.open) {
        closeTimeInMinutes += 24 * 60;
    }

    let currentAdjusted = currentTimeInMinutes;
    if (currentHour < SHOP_HOURS.open && SHOP_HOURS.close <= SHOP_HOURS.open) {
        currentAdjusted += 24 * 60;
    }

    return (
        currentAdjusted >= openTimeInMinutes && currentAdjusted < closeTimeInMinutes
    );
}

function getOpeningTimeString() {
    let openHour = SHOP_HOURS.open;
    let openPeriod = openHour >= 12 ? "PM" : "AM";
    let displayOpenHour = openHour > 12 ? openHour - 12 : openHour;
    if (displayOpenHour === 0) displayOpenHour = 12;

    let closeHour = SHOP_HOURS.close;
    let closePeriod = closeHour >= 12 ? "PM" : "AM";
    let displayCloseHour = closeHour > 12 ? closeHour - 12 : closeHour;
    if (displayCloseHour === 0) displayCloseHour = 12;

    return `${displayOpenHour}:00 ${openPeriod} - ${displayCloseHour}:00 ${closePeriod}`;
}

function initShopStatus() {
    const isOpen = isShopOpen();

    if (!isOpen) {
        const openingTime = getOpeningTimeString();
        const message = `🕐 We're currently closed! Our shop opens at ${openingTime}. You can still browse the menu and place orders for later delivery! 🌙`;
        showToast(message, "warning");
    }
}
// Order Confirmation Modal Functions
let pendingOrderData = null;

function showOrderConfirmation(orderData) {
    pendingOrderData = orderData;
    const modal = document.getElementById('orderConfirmModal');
    const content = document.getElementById('orderConfirmContent');

    // Calculate delivery fee
    const deliveryFee = orderData.subtotal > 1000 ? 0 : 100;
    const totalWithDelivery = orderData.subtotal + deliveryFee;

    // Generate order slip HTML
    content.innerHTML = `
        <div class="order-slip">
            <div class="order-slip-header">
                <h2>🧾 MirchiHut</h2>
                <p>Order Confirmation Slip</p>
                <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p><strong>Date:</strong> ${orderData.orderDate}</p>
            </div>
            
            <div class="order-slip-section">
                <div class="order-slip-section-title">
                    <i class="fas fa-user"></i> Customer Details
                </div>
                <div class="order-info-row">
                    <span class="order-info-label">Name:</span>
                    <span class="order-info-value">${escapeHtml(orderData.customer.name)}</span>
                </div>
                <div class="order-info-row">
                    <span class="order-info-label">Address:</span>
                    <span class="order-info-value">${escapeHtml(orderData.customer.address)}</span>
                </div>
                <div class="order-info-row">
                    <span class="order-info-label">Instructions:</span>
                    <span class="order-info-value">${escapeHtml(orderData.customer.instructions)}</span>
                </div>
            </div>
            
            <div class="order-slip-section">
                <div class="order-slip-section-title">
                    <i class="fas fa-shopping-bag"></i> Order Items
                </div>
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderData.items.map(item => `
                            <tr>
                                <td>${escapeHtml(item.name)}</td>
                                <td class="text-right">${item.quantity}</td>
                                <td class="text-right">Rs. ${item.price.toLocaleString()}</td>
                                <td class="text-right">Rs. ${item.total.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="order-slip-section">
                <div class="order-slip-section-title">
                    <i class="fas fa-receipt"></i> Payment Summary
                </div>
                <div class="order-info-row">
                    <span class="order-info-label">Subtotal:</span>
                    <span class="order-info-value">Rs. ${orderData.subtotal.toLocaleString()}</span>
                </div>
                <div class="order-info-row">
                    <span class="order-info-label">Delivery Fee:</span>
                    <span class="order-info-value">${deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}</span>
                </div>
                <div class="order-total-row">
                    <span>Grand Total:</span>
                    <span class="order-grand-total">Rs. ${totalWithDelivery.toLocaleString()}</span>
                </div>
                <div class="order-info-row" style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                    <span class="order-info-label">Payment Method:</span>
                    <span class="order-info-value">Cash on Delivery</span>
                </div>
            </div>
            
            <div class="order-slip-section" style="text-align: center; background: #fff0e6;">
                <i class="fas fa-clock" style="color: #ff6b00; margin-right: 8px;"></i>
                <span style="font-size: 12px; color: #475569;">Estimated delivery time: 30-45 minutes</span>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    lockBody(true);
}

function closeOrderConfirmation() {
    const modal = document.getElementById('orderConfirmModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            pendingOrderData = null;
        }, 300);
        lockBody(false);
    }
}

function sendOrderToWhatsApp(orderData) {
    // Calculate delivery fee
    const deliveryFee = orderData.subtotal > 1000 ? 0 : 100;
    const totalWithDelivery = orderData.subtotal + deliveryFee;

    // Format WhatsApp message
    let message = `*NEW ORDER FROM MIRCHIHUT*\n\n`;
    message += `*ORDER ID:* ${orderData.orderId}\n`;
    message += `*DATE:* ${orderData.orderDate}\n\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n`;
    message += `*CUSTOMER DETAILS*\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n`;
    message += `*Name:* ${orderData.customer.name}\n`;
    message += `*Address:* ${orderData.customer.address}\n`;
    message += `*Instructions:* ${orderData.customer.instructions}\n\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n`;
    message += `*ORDER ITEMS*\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n`;

    orderData.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantity: ${item.quantity} × Rs. ${item.price.toLocaleString()}\n`;
        message += `   *Total: Rs. ${item.total.toLocaleString()}*\n\n`;
    });

    message += `*━━━━━━━━━━━━━━━━━━━━*\n`;
    message += `*PAYMENT SUMMARY*\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n`;
    message += `Subtotal: Rs. ${orderData.subtotal.toLocaleString()}\n`;
    message += `Delivery Fee: ${deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}\n`;
    message += `*GRAND TOTAL: Rs. ${totalWithDelivery.toLocaleString()}*\n\n`;
    message += `*Payment Method:* Cash on Delivery\n\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n`;
    message += `*Estimated Delivery:* 30-45 minutes\n`;
    message += `*━━━━━━━━━━━━━━━━━━━━*\n\n`;
    message += `*Thank you for ordering from MirchiHut!*`;

    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "923070555587"; // Change this to your WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Update the placeOrder function
function placeOrder() {
    if (cart.length === 0) {
        showToast("Your cart is empty!", "warning");
        return;
    }

    // Get customer details
    const customerName = document.getElementById("customerName")?.value.trim();
    const customerAddress = document.getElementById("customerAddress")?.value.trim();
    const specialInstructions = document.getElementById("specialInstructions")?.value.trim();

    // Validate required fields
    if (!customerName) {
        showToast("Please enter your name", "warning");
        document.getElementById("customerName")?.focus();
        return;
    }

    if (!customerAddress) {
        showToast("Please enter your delivery address", "warning");
        document.getElementById("customerAddress")?.focus();
        return;
    }

    // Prepare order data
    const orderData = {
        orderId: "ORD-" + Date.now(),
        customer: {
            name: customerName,
            address: customerAddress,
            instructions: specialInstructions || "No special instructions",
        },
        items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            total: item.price * item.qty,
        })),
        subtotal: getCartTotal(),
        orderDate: new Date().toLocaleString(),
    };

    // Store order data and show confirmation modal
    pendingOrderData = orderData;
    showOrderConfirmation(orderData);
}

// Confirm and send order
function confirmAndSendOrder() {
    if (pendingOrderData) {
        // Send to WhatsApp
        sendOrderToWhatsApp(pendingOrderData);

        // Log to console
        console.log("=".repeat(60));
        console.log("🛍️ ORDER CONFIRMED & SENT TO WHATSAPP 🛍️");
        console.log("=".repeat(60));
        console.log("📋 ORDER ID:", pendingOrderData.orderId);
        console.log("📅 DATE:", pendingOrderData.orderDate);
        console.log("-".repeat(60));
        console.log("👤 CUSTOMER DETAILS:");
        console.log("   Name:", pendingOrderData.customer.name);
        console.log("   Address:", pendingOrderData.customer.address);
        console.log("   Instructions:", pendingOrderData.customer.instructions);
        console.log("-".repeat(60));
        console.log("🛒 ORDER ITEMS:");
        pendingOrderData.items.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.name} x ${item.quantity} = Rs. ${item.total.toLocaleString()}`);
        });
        console.log("-".repeat(60));
        console.log("💰 ORDER SUMMARY:");
        console.log("   Subtotal: Rs.", pendingOrderData.subtotal.toLocaleString());
        const deliveryFee = pendingOrderData.subtotal > 1000 ? 0 : 100;
        console.log("   Delivery Fee: Rs.", deliveryFee);
        console.log("   TOTAL: Rs.", (pendingOrderData.subtotal + deliveryFee).toLocaleString());
        console.log("=".repeat(60));
        console.log("✅ Order sent to WhatsApp successfully!");
        console.log("=".repeat(60));

        // Show success message
        showToast("Order sent to WhatsApp successfully!", "success");

        // Clear cart and form
        cart = [];
        updateCartBadge();
        renderCartSidebar();

        // Clear form fields
        if (document.getElementById("customerName")) document.getElementById("customerName").value = "";
        if (document.getElementById("customerAddress")) document.getElementById("customerAddress").value = "";
        if (document.getElementById("specialInstructions")) document.getElementById("specialInstructions").value = "";

        // Close confirmation modal and cart sidebar
        closeOrderConfirmation();
        setTimeout(() => {
            setCartOpenState(false);
        }, 1000);
    }
}
// Initialize App
function init() {
    initShopStatus();
    renderCategoryFilters();
    renderMenu();
    updateCartBadge();
    setupEventListeners();
    handleScroll();
}

init();
