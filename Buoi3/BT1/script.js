// Helper to display results in HTML
function display(id, data, type = 'text') {
    const element = document.getElementById(id);
    if (!element) return;

    if (type === 'json') {
        element.textContent = JSON.stringify(data, null, 2);
    } else if (type === 'list') {
        element.innerHTML = '';
        data.forEach(item => {
            const div = document.createElement('div');
            // Check if item is an object and try to format it nicely
            if (typeof item === 'object' && item !== null) {
                div.textContent = Object.values(item).join(' - ');
            } else {
                div.textContent = item;
            }
            element.appendChild(div);
        });
    } else if (type === 'code') {
        element.textContent = data;
    } else if (type === 'html') {
        element.innerHTML = data;
    } else {
        element.textContent = data;
    }
}

// --- Câu 1: Khai báo constructor function Product ---
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// Display constructor code
display('q1-result', `function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}`, 'code');


// --- Câu 2: Khởi tạo mảng products (6 sp, 2 danh mục) ---
const products = [
    new Product(1, "Laptop Dell XPS", 35000000, 10, "Electronics", true),
    new Product(2, "iPhone 15 Pro", 28000000, 5, "Electronics", true),
    new Product(3, "Tai nghe Sony WH-1000XM5", 8000000, 0, "Accessories", true),
    new Product(4, "Bàn phím cơ Keychron", 3000000, 15, "Accessories", false),
    new Product(5, "Chuột Logitech MX Master 3", 2500000, 20, "Accessories", true),
    new Product(6, "Màn hình LG UltraFine", 15000000, 3, "Electronics", true)
];

// Display products
display('q2-result', products, 'json');


// --- Câu 3: Mảng mới chỉ chứa name và price ---
const nameAndPrice = products.map(p => ({
    name: p.name,
    price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)
}));
display('q3-result', nameAndPrice.map(p => `${p.name}: ${p.price}`), 'list');


// --- Câu 4: Lọc sản phẩm còn hàng (quantity > 0) ---
const inStockProducts = products.filter(p => p.quantity > 0);
display('q4-result', inStockProducts.map(p => `${p.name} (SL: ${p.quantity})`), 'list');


// --- Câu 5: Có ít nhất 1 sản phẩm giá > 30.000.000 không? ---
const hasExpensiveProduct = products.some(p => p.price > 30000000);
display('q5-result', hasExpensiveProduct ? "Có" : "Không");


// --- Câu 6: Kiểm tra tất cả sản phẩm danh mục "Accessories" có đang bán không (isAvailable = true) ---
// Lọc Accessories trước
const accessories = products.filter(p => p.category === "Accessories");
// Kiểm tra tất cả
const allAccessoriesAvailable = accessories.length > 0 && accessories.every(p => p.isAvailable);
display('q6-result', allAccessoriesAvailable ? "Tất cả đang bán" : "Có sản phẩm ngừng bán");


// --- Câu 7: Tổng giá trị kho hàng ---
const totalInventoryValue = products.reduce((total, p) => total + (p.price * p.quantity), 0);
display('q7-result', new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalInventoryValue));


// --- Câu 8: Dùng for...of duyệt mảng, in ra Tên - Danh mục - Trạng thái ---
let q8Output = "";
for (const p of products) {
    const status = p.isAvailable ? "Đang bán" : "Ngừng bán";
    q8Output += `${p.name} - ${p.category} - ${status}\n`;
}
display('q8-result', q8Output);


// --- Câu 9: Dùng for...in để in ra tên thuộc tính và giá trị (demo sản phẩm đầu tiên) ---
let q9Output = "Demo trên sản phẩm đầu tiên:\n--------------------------\n";
const firstProduct = products[0];
for (const key in firstProduct) {
    q9Output += `${key}: ${firstProduct[key]}\n`;
}
display('q9-result', q9Output);


// --- Câu 10: Lấy danh sách tên sản phẩm đang bán (isAvailable) và còn hàng (quantity > 0) ---
const sellingAndInStockNames = products
    .filter(p => p.isAvailable === true && p.quantity > 0)
    .map(p => p.name);

display('q10-result', sellingAndInStockNames.length > 0 ? sellingAndInStockNames.join(', ') : "Không có sản phẩm nào", 'text');
