// products.js
// Contact Information
const P1 = "0300-1234567";
const P2 = "0311-7654321";
const WA = "923001234567";

// Categories Data with Font Awesome icons
const CATS = [
    { id: "all", label: "All", icon: "fas fa-bookmark" },
    { id: "deals", label: "Deals", icon: "fas fa-tag" },
    { id: "pizza", label: "Pizza", icon: "fas fa-pizza-slice" },
    { id: "rolls", label: "Rolls", icon: "fas fa-egg" },
    { id: "broast", label: "Broast", icon: "fas fa-drumstick-bite" },
    { id: "burgers", label: "Burgers", icon: "fas fa-hamburger" },
    { id: "bbq", label: "BBQ", icon: "fas fa-fire" },
    { id: "chinese", label: "Chinese", icon: "fas fa-utensils" },
    { id: "karahi", label: "Karahi", icon: "fas fa-mug-hot" },
    { id: "handi", label: "Handi", icon: "fas fa-pot-food" },
    { id: "sandwiches", label: "Sandwiches", icon: "fas fa-bread-slice" },
    { id: "fries", label: "Fries", icon: "fas fa-french-fries" },
];

const C_EMOJI = { deals: "🔥", pizza: "🍕", rolls: "🌯", broast: "🍗", burgers: "🍔", bbq: "🍖", chinese: "🥡", karahi: "🫕", handi: "🍲", sandwiches: "🥪", fries: "🍟" };
const C_COLOR = { deals: "#ff6b00", pizza: "#f59e0b", rolls: "#10b981", broast: "#f97316", burgers: "#ef4444", bbq: "#dc2626", chinese: "#e11d48", karahi: "#d97706", handi: "#eab308", sandwiches: "#84cc16", fries: "#facc15" };
const CAT_ORDER = ["deals", "pizza", "rolls", "broast", "burgers", "bbq", "chinese", "karahi", "handi", "sandwiches", "fries"];

// Product Images Mapping (All working links)
const PRODUCT_IMAGES = {
    // Deals (IDs 1-6)
    1: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    2: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop",
    3: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop",
    4: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    5: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    6: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    
    // Pizza (IDs 7-13)
    7: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    8: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    9: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop",
    10: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    11: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
    12: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=300&fit=crop",
    13: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&h=300&fit=crop",
    
    // Rolls (IDs 14-19)
    14: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    15: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    16: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    17: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    18: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    19: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    
    // Broast (IDs 20-24)
    20: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    21: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=300&fit=crop",
    22: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
    23: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=300&fit=crop",
    24: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    
    // Burgers (IDs 25-30)
    25: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    26: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    27: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    28: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",
    29: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    30: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    
    // BBQ (IDs 31-35)
    31: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    32: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    33: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    34: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop",
    35: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    
    // Chinese (IDs 36-41)
    36: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    37: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    38: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    39: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop",
    40: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop",
    41: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    
    // Karahi (IDs 42-45)
    42: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    43: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    44: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    45: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    
    // Handi (IDs 46-48)
    46: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop",
    47: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop",
    48: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop",
    
    // Sandwiches (IDs 49-52)
    49: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
    50: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
    51: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
    52: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
    
    // Fries (IDs 53-57)
    53: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    54: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&h=300&fit=crop",
    55: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    56: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&h=300&fit=crop",
    57: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
};

// Products / Menu Items (with image property added)
const ITEMS = [
    // Deals
    { id: 1, cat: "deals", name: "Family Deal 1", desc: "1 Large Pizza + 4 Drinks + Garlic Bread", price: 1499, popular: true, image: PRODUCT_IMAGES[1] },
    { id: 2, cat: "deals", name: "Deal for 2", desc: "2 Zinger Burgers + 2 Fries + 2 Drinks", price: 899, popular: true, image: PRODUCT_IMAGES[2] },
    { id: 3, cat: "deals", name: "Student Deal", desc: "1 Burger + 1 Roll + 1 Fries + 1 Drink", price: 549, image: PRODUCT_IMAGES[3] },
    { id: 4, cat: "deals", name: "Party Pack", desc: "2 Large Pizzas + 8 Pcs Broast + 4 Drinks", price: 2499, popular: true, image: PRODUCT_IMAGES[4] },
    { id: 5, cat: "deals", name: "Broast Deal", desc: "4 Pcs Broast + 2 Fries + 2 Drinks", price: 999, image: PRODUCT_IMAGES[5] },
    { id: 6, cat: "deals", name: "BBQ Night Deal", desc: "Mixed BBQ Platter + 2 Naans + 2 Drinks", price: 1299, image: PRODUCT_IMAGES[6] },
    // Pizza
    { id: 7, cat: "pizza", name: "Margarita Pizza", desc: "Classic tomato sauce, mozzarella, fresh basil", price: 699, image: PRODUCT_IMAGES[7] },
    { id: 8, cat: "pizza", name: "BBQ Chicken Pizza", desc: "Smoky BBQ sauce, grilled chicken, onions, peppers", price: 899, popular: true, image: PRODUCT_IMAGES[8] },
    { id: 9, cat: "pizza", name: "Tikka Pizza", desc: "Spicy tikka chicken, green peppers, onions", price: 849, popular: true, image: PRODUCT_IMAGES[9] },
    { id: 10, cat: "pizza", name: "Pepperoni Pizza", desc: "Classic pepperoni with extra cheese blend", price: 799, image: PRODUCT_IMAGES[10] },
    { id: 11, cat: "pizza", name: "Veggie Supreme", desc: "Mushrooms, capsicum, olives, tomatoes, onions", price: 749, image: PRODUCT_IMAGES[11] },
    { id: 12, cat: "pizza", name: "Hot & Spicy Pizza", desc: "Jalapeños, chicken, hot sauce, extra cheese", price: 849, image: PRODUCT_IMAGES[12] },
    { id: 13, cat: "pizza", name: "Cheese Lovers", desc: "Four cheese blend, oregano, tomato base", price: 799, image: PRODUCT_IMAGES[13] },
    // Rolls
    { id: 14, cat: "rolls", name: "Chicken Roll", desc: "Grilled chicken, veggies, chutney in soft paratha", price: 249, popular: true, image: PRODUCT_IMAGES[14] },
    { id: 15, cat: "rolls", name: "Seekh Kabab Roll", desc: "Juicy seekh kabab, raita, onions, mint chutney", price: 299, image: PRODUCT_IMAGES[15] },
    { id: 16, cat: "rolls", name: "Paratha Roll", desc: "Spiced potato filling in crispy paratha", price: 199, image: PRODUCT_IMAGES[16] },
    { id: 17, cat: "rolls", name: "Shami Roll", desc: "Soft shami kabab, chutney and onions", price: 229, image: PRODUCT_IMAGES[17] },
    { id: 18, cat: "rolls", name: "Club Roll", desc: "Chicken, omelette, veggies in crispy paratha", price: 279, image: PRODUCT_IMAGES[18] },
    { id: 19, cat: "rolls", name: "Beef Roll", desc: "Spiced beef, mint chutney, pickled onions", price: 269, image: PRODUCT_IMAGES[19] },
    // Broast
    { id: 20, cat: "broast", name: "2 Pcs Broast", desc: "Crispy pressure-fried chicken, 2 pieces", price: 299, image: PRODUCT_IMAGES[20] },
    { id: 21, cat: "broast", name: "4 Pcs Broast", desc: "Crispy pressure-fried chicken, 4 pieces", price: 549, popular: true, image: PRODUCT_IMAGES[21] },
    { id: 22, cat: "broast", name: "8 Pcs Broast", desc: "Crispy pressure-fried chicken, 8 pieces", price: 999, image: PRODUCT_IMAGES[22] },
    { id: 23, cat: "broast", name: "Broast Bucket 12", desc: "Family-size bucket, 12 crispy pieces", price: 1399, image: PRODUCT_IMAGES[23] },
    { id: 24, cat: "broast", name: "Hot Crispy Wings", desc: "8 spicy chicken wings, broast style", price: 449, image: PRODUCT_IMAGES[24] },
    // Burgers
    { id: 25, cat: "burgers", name: "Zinger Burger", desc: "Crispy fillet, lettuce, mayo, brioche bun", price: 349, popular: true, image: PRODUCT_IMAGES[25] },
    { id: 26, cat: "burgers", name: "Double Smash", desc: "Two smash patties, special sauce, cheese", price: 499, popular: true, image: PRODUCT_IMAGES[26] },
    { id: 27, cat: "burgers", name: "Chicken Burger", desc: "Grilled breast, fresh veggies, mustard sauce", price: 299, image: PRODUCT_IMAGES[27] },
    { id: 28, cat: "burgers", name: "BBQ Burger", desc: "Beef patty, smoky BBQ, onion rings, cheese", price: 429, image: PRODUCT_IMAGES[28] },
    { id: 29, cat: "burgers", name: "Crispy Burger", desc: "Buttermilk chicken, coleslaw, pickles", price: 329, image: PRODUCT_IMAGES[29] },
    { id: 30, cat: "burgers", name: "Tower Burger", desc: "Double chicken, hash brown, egg, cheese stack", price: 549, image: PRODUCT_IMAGES[30] },
    // BBQ
    { id: 31, cat: "bbq", name: "Seekh Kabab (6 pcs)", desc: "Minced beef seekh kababs, served with naan", price: 499, popular: true, image: PRODUCT_IMAGES[31] },
    { id: 32, cat: "bbq", name: "Chicken Tikka ¼", desc: "Marinated grilled chicken, mint chutney & naan", price: 649, image: PRODUCT_IMAGES[32] },
    { id: 33, cat: "bbq", name: "Mixed BBQ Platter", desc: "Seekh kabab, tikka, boti, 2 naans, raita", price: 1099, popular: true, image: PRODUCT_IMAGES[33] },
    { id: 34, cat: "bbq", name: "Boti Kabab (8 pcs)", desc: "Tender marinated beef boti on skewers", price: 499, image: PRODUCT_IMAGES[34] },
    { id: 35, cat: "bbq", name: "Malai Boti", desc: "Creamy marinated chicken boti, soft & smoky", price: 549, image: PRODUCT_IMAGES[35] },
    // Chinese
    { id: 36, cat: "chinese", name: "Chicken Chowmein", desc: "Stir-fried noodles with chicken and vegetables", price: 399, image: PRODUCT_IMAGES[36] },
    { id: 37, cat: "chinese", name: "Beef Chowmein", desc: "Stir-fried noodles with tender beef strips", price: 449, image: PRODUCT_IMAGES[37] },
    { id: 38, cat: "chinese", name: "Chicken Fried Rice", desc: "Wok-fried rice, chicken, egg, soy sauce", price: 349, image: PRODUCT_IMAGES[38] },
    { id: 39, cat: "chinese", name: "Spring Rolls 6 pcs", desc: "Crispy rolls stuffed with chicken and veggies", price: 299, image: PRODUCT_IMAGES[39] },
    { id: 40, cat: "chinese", name: "Chicken Manchurian", desc: "Crispy chicken in spicy Manchurian gravy", price: 449, popular: true, image: PRODUCT_IMAGES[40] },
    { id: 41, cat: "chinese", name: "Sweet & Sour Chicken", desc: "Battered chicken in tangy sweet sour sauce", price: 429, image: PRODUCT_IMAGES[41] },
    // Karahi
    { id: 42, cat: "karahi", name: "Chicken Karahi", desc: "Desi-style chicken in tomatoes & spices (serves 2)", price: 849, popular: true, image: PRODUCT_IMAGES[42] },
    { id: 43, cat: "karahi", name: "Mutton Karahi", desc: "Slow-cooked mutton karahi (serves 2)", price: 1099, image: PRODUCT_IMAGES[43] },
    { id: 44, cat: "karahi", name: "Beef Karahi", desc: "Rich beef karahi, fresh tomatoes (serves 2)", price: 949, image: PRODUCT_IMAGES[44] },
    { id: 45, cat: "karahi", name: "White Karahi", desc: "Creamy white chicken karahi (serves 2)", price: 899, image: PRODUCT_IMAGES[45] },
    // Handi
    { id: 46, cat: "handi", name: "Chicken Handi", desc: "Slow-cooked chicken in clay pot, rich gravy", price: 799, popular: true, image: PRODUCT_IMAGES[46] },
    { id: 47, cat: "handi", name: "Mutton Handi", desc: "Tender mutton in aromatic handi gravy", price: 999, image: PRODUCT_IMAGES[47] },
    { id: 48, cat: "handi", name: "Afghani Handi", desc: "Creamy Afghani-style chicken handi with naan", price: 849, image: PRODUCT_IMAGES[48] },
    // Sandwiches
    { id: 49, cat: "sandwiches", name: "Club Sandwich", desc: "Triple-decker: chicken, egg, lettuce, tomato", price: 349, image: PRODUCT_IMAGES[49] },
    { id: 50, cat: "sandwiches", name: "Grilled Chicken Sand", desc: "Grilled chicken, pesto, mozzarella", price: 329, image: PRODUCT_IMAGES[50] },
    { id: 51, cat: "sandwiches", name: "Beef Sandwich", desc: "Spiced beef strips, caramelized onions", price: 349, image: PRODUCT_IMAGES[51] },
    { id: 52, cat: "sandwiches", name: "Crispy Chicken Sand", desc: "Buttermilk fried chicken, pickles, sauce", price: 299, image: PRODUCT_IMAGES[52] },
    // Fries
    { id: 53, cat: "fries", name: "Regular Fries", desc: "Golden crispy fries with ketchup", price: 149, image: PRODUCT_IMAGES[53] },
    { id: 54, cat: "fries", name: "Loaded Fries", desc: "Fries with chicken, cheese sauce, jalapeños", price: 279, popular: true, image: PRODUCT_IMAGES[54] },
    { id: 55, cat: "fries", name: "Cheese Fries", desc: "Crispy fries smothered in cheddar cheese sauce", price: 219, image: PRODUCT_IMAGES[55] },
    { id: 56, cat: "fries", name: "Masala Fries", desc: "Desi masala fries with chaat chutney", price: 179, image: PRODUCT_IMAGES[56] },
    { id: 57, cat: "fries", name: "Waffle Fries", desc: "Crispy waffle-cut fries with dipping sauce", price: 199, image: PRODUCT_IMAGES[57] },
];