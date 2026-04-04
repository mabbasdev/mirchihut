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

// Products / Menu Items
const ITEMS = [
    // Deals
    { id: 1, cat: "deals", name: "Family Deal 1", desc: "1 Large Pizza + 4 Drinks + Garlic Bread", price: 1499, popular: true },
    { id: 2, cat: "deals", name: "Deal for 2", desc: "2 Zinger Burgers + 2 Fries + 2 Drinks", price: 899, popular: true },
    { id: 3, cat: "deals", name: "Student Deal", desc: "1 Burger + 1 Roll + 1 Fries + 1 Drink", price: 549 },
    { id: 4, cat: "deals", name: "Party Pack", desc: "2 Large Pizzas + 8 Pcs Broast + 4 Drinks", price: 2499, popular: true },
    { id: 5, cat: "deals", name: "Broast Deal", desc: "4 Pcs Broast + 2 Fries + 2 Drinks", price: 999 },
    { id: 6, cat: "deals", name: "BBQ Night Deal", desc: "Mixed BBQ Platter + 2 Naans + 2 Drinks", price: 1299 },
    // Pizza
    { id: 7, cat: "pizza", name: "Margarita Pizza", desc: "Classic tomato sauce, mozzarella, fresh basil", price: 699 },
    { id: 8, cat: "pizza", name: "BBQ Chicken Pizza", desc: "Smoky BBQ sauce, grilled chicken, onions, peppers", price: 899, popular: true },
    { id: 9, cat: "pizza", name: "Tikka Pizza", desc: "Spicy tikka chicken, green peppers, onions", price: 849, popular: true },
    { id: 10, cat: "pizza", name: "Pepperoni Pizza", desc: "Classic pepperoni with extra cheese blend", price: 799 },
    { id: 11, cat: "pizza", name: "Veggie Supreme", desc: "Mushrooms, capsicum, olives, tomatoes, onions", price: 749 },
    { id: 12, cat: "pizza", name: "Hot & Spicy Pizza", desc: "Jalapeños, chicken, hot sauce, extra cheese", price: 849 },
    { id: 13, cat: "pizza", name: "Cheese Lovers", desc: "Four cheese blend, oregano, tomato base", price: 799 },
    // Rolls
    { id: 14, cat: "rolls", name: "Chicken Roll", desc: "Grilled chicken, veggies, chutney in soft paratha", price: 249, popular: true },
    { id: 15, cat: "rolls", name: "Seekh Kabab Roll", desc: "Juicy seekh kabab, raita, onions, mint chutney", price: 299 },
    { id: 16, cat: "rolls", name: "Paratha Roll", desc: "Spiced potato filling in crispy paratha", price: 199 },
    { id: 17, cat: "rolls", name: "Shami Roll", desc: "Soft shami kabab, chutney and onions", price: 229 },
    { id: 18, cat: "rolls", name: "Club Roll", desc: "Chicken, omelette, veggies in crispy paratha", price: 279 },
    { id: 19, cat: "rolls", name: "Beef Roll", desc: "Spiced beef, mint chutney, pickled onions", price: 269 },
    // Broast
    { id: 20, cat: "broast", name: "2 Pcs Broast", desc: "Crispy pressure-fried chicken, 2 pieces", price: 299 },
    { id: 21, cat: "broast", name: "4 Pcs Broast", desc: "Crispy pressure-fried chicken, 4 pieces", price: 549, popular: true },
    { id: 22, cat: "broast", name: "8 Pcs Broast", desc: "Crispy pressure-fried chicken, 8 pieces", price: 999 },
    { id: 23, cat: "broast", name: "Broast Bucket 12", desc: "Family-size bucket, 12 crispy pieces", price: 1399 },
    { id: 24, cat: "broast", name: "Hot Crispy Wings", desc: "8 spicy chicken wings, broast style", price: 449 },
    // Burgers
    { id: 25, cat: "burgers", name: "Zinger Burger", desc: "Crispy fillet, lettuce, mayo, brioche bun", price: 349, popular: true },
    { id: 26, cat: "burgers", name: "Double Smash", desc: "Two smash patties, special sauce, cheese", price: 499, popular: true },
    { id: 27, cat: "burgers", name: "Chicken Burger", desc: "Grilled breast, fresh veggies, mustard sauce", price: 299 },
    { id: 28, cat: "burgers", name: "BBQ Burger", desc: "Beef patty, smoky BBQ, onion rings, cheese", price: 429 },
    { id: 29, cat: "burgers", name: "Crispy Burger", desc: "Buttermilk chicken, coleslaw, pickles", price: 329 },
    { id: 30, cat: "burgers", name: "Tower Burger", desc: "Double chicken, hash brown, egg, cheese stack", price: 549 },
    // BBQ
    { id: 31, cat: "bbq", name: "Seekh Kabab (6 pcs)", desc: "Minced beef seekh kababs, served with naan", price: 499, popular: true },
    { id: 32, cat: "bbq", name: "Chicken Tikka ¼", desc: "Marinated grilled chicken, mint chutney & naan", price: 649 },
    { id: 33, cat: "bbq", name: "Mixed BBQ Platter", desc: "Seekh kabab, tikka, boti, 2 naans, raita", price: 1099, popular: true },
    { id: 34, cat: "bbq", name: "Boti Kabab (8 pcs)", desc: "Tender marinated beef boti on skewers", price: 499 },
    { id: 35, cat: "bbq", name: "Malai Boti", desc: "Creamy marinated chicken boti, soft & smoky", price: 549 },
    // Chinese
    { id: 36, cat: "chinese", name: "Chicken Chowmein", desc: "Stir-fried noodles with chicken and vegetables", price: 399 },
    { id: 37, cat: "chinese", name: "Beef Chowmein", desc: "Stir-fried noodles with tender beef strips", price: 449 },
    { id: 38, cat: "chinese", name: "Chicken Fried Rice", desc: "Wok-fried rice, chicken, egg, soy sauce", price: 349 },
    { id: 39, cat: "chinese", name: "Spring Rolls 6 pcs", desc: "Crispy rolls stuffed with chicken and veggies", price: 299 },
    { id: 40, cat: "chinese", name: "Chicken Manchurian", desc: "Crispy chicken in spicy Manchurian gravy", price: 449, popular: true },
    { id: 41, cat: "chinese", name: "Sweet & Sour Chicken", desc: "Battered chicken in tangy sweet sour sauce", price: 429 },
    // Karahi
    { id: 42, cat: "karahi", name: "Chicken Karahi", desc: "Desi-style chicken in tomatoes & spices (serves 2)", price: 849, popular: true },
    { id: 43, cat: "karahi", name: "Mutton Karahi", desc: "Slow-cooked mutton karahi (serves 2)", price: 1099 },
    { id: 44, cat: "karahi", name: "Beef Karahi", desc: "Rich beef karahi, fresh tomatoes (serves 2)", price: 949 },
    { id: 45, cat: "karahi", name: "White Karahi", desc: "Creamy white chicken karahi (serves 2)", price: 899 },
    // Handi
    { id: 46, cat: "handi", name: "Chicken Handi", desc: "Slow-cooked chicken in clay pot, rich gravy", price: 799, popular: true },
    { id: 47, cat: "handi", name: "Mutton Handi", desc: "Tender mutton in aromatic handi gravy", price: 999 },
    { id: 48, cat: "handi", name: "Afghani Handi", desc: "Creamy Afghani-style chicken handi with naan", price: 849 },
    // Sandwiches
    { id: 49, cat: "sandwiches", name: "Club Sandwich", desc: "Triple-decker: chicken, egg, lettuce, tomato", price: 349 },
    { id: 50, cat: "sandwiches", name: "Grilled Chicken Sand", desc: "Grilled chicken, pesto, mozzarella", price: 329 },
    { id: 51, cat: "sandwiches", name: "Beef Sandwich", desc: "Spiced beef strips, caramelized onions", price: 349 },
    { id: 52, cat: "sandwiches", name: "Crispy Chicken Sand", desc: "Buttermilk fried chicken, pickles, sauce", price: 299 },
    // Fries
    { id: 53, cat: "fries", name: "Regular Fries", desc: "Golden crispy fries with ketchup", price: 149 },
    { id: 54, cat: "fries", name: "Loaded Fries", desc: "Fries with chicken, cheese sauce, jalapeños", price: 279, popular: true },
    { id: 55, cat: "fries", name: "Cheese Fries", desc: "Crispy fries smothered in cheddar cheese sauce", price: 219 },
    { id: 56, cat: "fries", name: "Masala Fries", desc: "Desi masala fries with chaat chutney", price: 179 },
    { id: 57, cat: "fries", name: "Waffle Fries", desc: "Crispy waffle-cut fries with dipping sauce", price: 199 },
];