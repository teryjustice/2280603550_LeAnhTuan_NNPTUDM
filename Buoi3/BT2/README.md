# 📝 Quản Lý Posts với JSON Server

Ứng dụng quản lý posts với các tính năng:
- ✅ Xóa mềm (Soft Delete) bằng cách thêm `isDeleted: true`
- ✅ Hiển thị posts đã xóa với gạch ngang
- ✅ ID tự tăng (maxId + 1)
- ✅ Thêm, sửa, xóa, khôi phục posts
- ✅ Lọc posts theo trạng thái
- ✅ Thống kê tổng quan

## 🚀 Hướng dẫn chạy

### Bước 1: Cài đặt JSON Server
```bash
npm install json-server
```

### Bước 2: Khởi động JSON Server
```bash
npx json-server db.json
```

Server sẽ chạy tại: `http://localhost:3000`

### Bước 3: Mở ứng dụng
Mở file `index.html` trong trình duyệt hoặc sử dụng Live Server.

### Tắt server
Nhấn `Ctrl + C` trong terminal

## 📋 Các tính năng chính

### 1. Xóa mềm (Soft Delete)
- Khi xóa post, không xóa khỏi database
- Thêm thuộc tính `isDeleted: true` vào post
- Post vẫn tồn tại và có thể khôi phục

### 2. Hiển thị posts đã xóa
- Posts đã xóa được hiển thị với:
  - Gạch ngang (text-decoration: line-through)
  - Màu mờ hơn (opacity: 0.6)
  - Nền màu đỏ nhạt
  - Nhãn "🗑️ Đã xóa"

### 3. ID tự tăng
- Khi tạo post mới, để trống ID
- Hệ thống tự động tìm maxId và tăng lên 1
- Đảm bảo ID luôn unique

### 4. Bộ lọc
- **Tất cả**: Hiển thị tất cả posts
- **Hoạt động**: Chỉ hiển thị posts chưa xóa
- **Đã xóa**: Chỉ hiển thị posts đã xóa

### 5. Thống kê
- Tổng số posts
- Số posts đang hoạt động
- Số posts đã xóa
- Tổng lượt xem

## 🎨 Giao diện
- Thiết kế hiện đại với glassmorphism
- Màu sắc gradient đẹp mắt
- Animations mượt mà
- Responsive trên mọi thiết bị

## 📁 Cấu trúc file
```
BT2/
├── index.html      # Giao diện chính
├── style.css       # Styling
├── app.js          # Logic xử lý
├── db.json         # Database JSON Server
├── README.md       # Hướng dẫn
└── package.json    # Dependencies
```

## 🔧 API Endpoints

- `GET /posts` - Lấy tất cả posts
- `GET /posts/:id` - Lấy post theo ID
- `POST /posts` - Tạo post mới
- `PATCH /posts/:id` - Cập nhật post
- `DELETE /posts/:id` - Xóa cứng (không dùng)

## 👨‍💻 Sinh viên thực hiện
- MSSV: 2280603550
- Họ tên: Lê Anh Tuấn
- Môn: Nhập môn phát triển ứng dụng di động

## 📝 Ghi chú
- Đảm bảo JSON Server đang chạy trước khi sử dụng ứng dụng
- Port mặc định: 3000
- Dữ liệu được lưu trong file `db.json`
