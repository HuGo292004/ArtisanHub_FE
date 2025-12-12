# 🔧 Hướng dẫn Setup PayOS Return URL

## 📍 Return URL được set ở đâu?

### 1. **Frontend - PaymentButton.jsx**

File: `src/components/Payment/PaymentButton.jsx` (dòng 167-170)

```javascript
// Lấy frontend URL
const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

// Tạo returnUrl và cancelUrl
const returnUrl = `${frontendUrl}/`;
const cancelUrl = `${frontendUrl}/`;

// Gửi cho backend
const payload = {
  returnUrl,  // ← Đây là URL PayOS sẽ redirect về
  cancelUrl,  // ← Đây là URL PayOS sẽ redirect về khi hủy
  // ... các field khác
};
```

### 2. **Backend - API /api/Order/checkout**

Backend nhận `returnUrl` và `cancelUrl` từ frontend, sau đó truyền cho PayOS khi tạo payment link.

**Lưu ý:** Backend phải truyền đúng `returnUrl` và `cancelUrl` cho PayOS API.

---

## 🛠️ Cách Setup Return URL

### **Bước 1: Set biến môi trường trên Vercel**

1. Vào **Vercel Dashboard** → Chọn project → **Settings** → **Environment Variables**
2. Thêm biến:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_FRONTEND_URL` | `https://artisan-hub-project.vercel.app` | Production, Preview |

⚠️ **Lưu ý:** 
- Không có trailing slash `/` ở cuối
- Phải là URL chính xác của frontend deploy

### **Bước 2: Redeploy trên Vercel**

Sau khi thêm biến môi trường, cần **Redeploy** để áp dụng:
- Vào **Deployments** → Click **"..."** → **Redeploy**

### **Bước 3: Kiểm tra trong Console**

Khi click "Thanh toán", mở **Browser Console (F12)** và xem log:

```
🔗 PayOS Return URL Setup: {
  "VITE_FRONTEND_URL (env)": "https://artisan-hub-project.vercel.app",
  "window.location.origin": "https://artisan-hub-project.vercel.app",
  "frontendUrl (đang dùng)": "https://artisan-hub-project.vercel.app",
  "returnUrl": "https://artisan-hub-project.vercel.app/",
  "cancelUrl": "https://artisan-hub-project.vercel.app/"
}
```

### **Bước 4: Kiểm tra Backend**

Đảm bảo backend:
- ✅ Nhận được `returnUrl` và `cancelUrl` từ frontend
- ✅ Truyền đúng các URL này cho PayOS API khi tạo payment link
- ✅ Không hardcode URL trong backend

---

## 🔍 Debug Return URL

### **Kiểm tra URL đang được gửi:**

1. Mở **Browser DevTools (F12)** → Tab **Network**
2. Click "Thanh toán"
3. Tìm request `POST /api/Order/checkout`
4. Xem **Payload** → Kiểm tra `returnUrl` và `cancelUrl`

### **Kiểm tra URL PayOS redirect về:**

1. Sau khi thanh toán, xem URL trong browser address bar
2. URL đúng sẽ là: `https://artisan-hub-project.vercel.app/?code=00&status=PAID&orderCode=...`
3. Nếu vẫn là `localhost:5173` → Biến môi trường chưa được set hoặc chưa redeploy

---

## 📝 Checklist Setup

- [ ] Đã set `VITE_FRONTEND_URL` trên Vercel
- [ ] Đã redeploy project trên Vercel
- [ ] Đã kiểm tra console log khi click "Thanh toán"
- [ ] Đã kiểm tra Network tab - payload có `returnUrl` đúng
- [ ] Backend đã nhận và truyền `returnUrl` cho PayOS
- [ ] Test thanh toán và kiểm tra PayOS redirect về đúng URL

---

## 🐛 Troubleshooting

### **Vấn đề: PayOS vẫn redirect về localhost**

**Nguyên nhân:**
- Biến môi trường `VITE_FRONTEND_URL` chưa được set
- Chưa redeploy sau khi set biến môi trường
- Browser cache

**Giải pháp:**
1. Kiểm tra lại biến môi trường trên Vercel
2. Redeploy project
3. Clear browser cache và test lại

### **Vấn đề: Return URL không đúng format**

**Nguyên nhân:**
- URL có trailing slash sai
- URL có protocol sai (http vs https)

**Giải pháp:**
- Đảm bảo `VITE_FRONTEND_URL` = `https://artisan-hub-project.vercel.app` (không có `/` ở cuối)
- Code sẽ tự động thêm `/` khi tạo `returnUrl`

---

## 📞 Liên hệ

Nếu vẫn gặp vấn đề, kiểm tra:
1. Console log trong browser
2. Network tab để xem payload gửi đi
3. Backend logs để xem PayOS API response

