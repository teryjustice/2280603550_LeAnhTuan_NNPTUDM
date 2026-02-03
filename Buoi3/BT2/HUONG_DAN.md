# 🚀 HƯỚNG DẪN SỬ DỤNG NHANH

## Bước 1: Mở Terminal
Mở terminal trong thư mục `Buoi3/BT2`

## Bước 2: Khởi động JSON Server
```bash
npx json-server db.json
```

Server sẽ chạy tại: http://localhost:3000

## Bước 3: Mở ứng dụng
Mở file `index.html` trong trình duyệt (double-click hoặc dùng Live Server)

## Bước 4: Sử dụng
- ➕ **Thêm post mới**: Điền form và click "Thêm Post"
- ✏️ **Sửa post**: Click nút "Sửa" trên post
- 🗑️ **Xóa mềm**: Click nút "Xóa" (post sẽ có gạch ngang)
- ♻️ **Khôi phục**: Click nút "Khôi phục" trên post đã xóa
- 🔍 **Lọc**: Dùng các nút "Tất cả", "Hoạt động", "Đã xóa"

## Tắt Server
Nhấn `Ctrl + C` trong terminal

---

## ✅ Các yêu cầu đã hoàn thành:

### 1. Xóa mềm (Soft Delete)
✅ Khi xóa post, thêm `isDeleted: true` thay vì xóa khỏi database

### 2. Hiển thị posts đã xóa
✅ Posts đã xóa được hiển thị với:
- Gạch ngang (text-decoration: line-through)
- Màu mờ hơn
- Nền màu đỏ nhạt
- Icon và nhãn "🗑️ Đã xóa"

### 3. ID tự tăng
✅ Khi tạo post mới:
- Để trống ID trong form
- Hệ thống tự động tìm maxId
- Tạo ID mới = maxId + 1

### 4. Push lên GitHub
✅ Code đã được push lên: https://github.com/teryjustice/2280603550_LeAnhTuan_NNPTUDM

---

## 📸 Demo các tính năng:

### Thêm post mới
1. Nhập tiêu đề: "Bài viết mới"
2. Nhập lượt xem: 100
3. Click "Thêm Post"
4. ID sẽ tự động là 3 (vì maxId hiện tại là 2)

### Xóa mềm
1. Click nút "🗑️ Xóa" trên post
2. Post sẽ có gạch ngang
3. Nút "Xóa" đổi thành "♻️ Khôi phục"
4. Trong db.json, post có thêm `"isDeleted": true`

### Lọc posts
1. Click "Đã xóa" → Chỉ hiển thị posts có isDeleted: true
2. Click "Hoạt động" → Chỉ hiển thị posts chưa xóa
3. Click "Tất cả" → Hiển thị tất cả

---

## 🎨 Giao diện
- Thiết kế hiện đại với gradient và glassmorphism
- Animations mượt mà
- Responsive trên mọi thiết bị
- Thống kê real-time

## 📝 Lưu ý
- Đảm bảo JSON Server đang chạy trước khi mở ứng dụng
- Nếu không kết nối được, kiểm tra port 3000 có bị chiếm không
- Dữ liệu được lưu trong file `db.json`
