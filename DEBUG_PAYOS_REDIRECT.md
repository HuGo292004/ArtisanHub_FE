# 🐛 Debug: PayOS vẫn redirect về localhost

## 🔍 Vấn đề

PayOS vẫn redirect về `localhost:5173` thay vì domain production `https://artisan-hub-project.vercel.app`

## 📋 Checklist Debug

### **Bước 1: Kiểm tra Frontend có gửi returnUrl đúng không**

1. Mở website deploy trên Vercel: `https://artisan-hub-project.vercel.app`
2. Mở **Browser DevTools (F12)** → Tab **Console**
3. Click "Thanh toán" và điền form
4. Xem log trong Console:

```
🔗 PayOS Return URL Debug: {
  "VITE_FRONTEND_URL (env)": "https://artisan-hub-project.vercel.app" hoặc undefined
  "window.location.origin": "https://artisan-hub-project.vercel.app"
  "frontendUrl (đang dùng)": "https://artisan-hub-project.vercel.app"
  "returnUrl (gửi cho backend)": "https://artisan-hub-project.vercel.app/"
  ...
}
```

**Nếu `returnUrl` vẫn là `localhost`:**

- ❌ Biến môi trường `VITE_FRONTEND_URL` chưa được set trên Vercel
- ❌ Hoặc chưa redeploy sau khi set biến môi trường

**Cách fix:**

1. Vào Vercel → Settings → Environment Variables
2. Thêm: `VITE_FRONTEND_URL` = `https://artisan-hub-project.vercel.app`
3. **Redeploy** project

---

### **Bước 2: Kiểm tra Backend có nhận returnUrl không**

1. Mở **Browser DevTools (F12)** → Tab **Network**
2. Click "Thanh toán"
3. Tìm request `POST /api/Order/checkout`
4. Click vào request → Tab **Payload** hoặc **Request**
5. Kiểm tra payload có `returnUrl` và `cancelUrl`:

```json
{
  "accountId": 123,
  "cartItemIds": [1, 2, 3],
  "shippingAddress": {...},
  "returnUrl": "https://artisan-hub-project.vercel.app/",  ← Phải có và đúng
  "cancelUrl": "https://artisan-hub-project.vercel.app/"   ← Phải có và đúng
}
```

**Nếu payload có `returnUrl` đúng:**

- ✅ Frontend đã gửi đúng
- ⚠️ Vấn đề có thể ở **Backend**

**Nếu payload vẫn là `localhost`:**

- ❌ Vấn đề ở Frontend (xem lại Bước 1)

---

### **Bước 3: Kiểm tra Backend có sử dụng returnUrl không**

**⚠️ QUAN TRỌNG:** Backend PHẢI sử dụng `returnUrl` và `cancelUrl` từ frontend khi tạo PayOS payment link.

#### **Backend cần làm:**

1. **Nhận `returnUrl` và `cancelUrl` từ request body:**

```csharp
// C# .NET example
public class CheckoutRequest
{
    public int AccountId { get; set; }
    public List<int> CartItemIds { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
    public string ReturnUrl { get; set; }  // ← PHẢI có
    public string CancelUrl { get; set; }   // ← PHẢI có
}
```

2. **Truyền `returnUrl` và `cancelUrl` cho PayOS API:**

```csharp
// Khi tạo PayOS payment link
var paymentData = new
{
    orderCode = orderCode,
    amount = totalAmount,
    description = "Thanh toán đơn hàng",
    returnUrl = request.ReturnUrl,  // ← Dùng từ frontend, KHÔNG hardcode
    cancelUrl = request.CancelUrl, // ← Dùng từ frontend, KHÔNG hardcode
    // ... các field khác
};

var payosResponse = await PayOSClient.CreatePaymentLink(paymentData);
```

#### **Backend KHÔNG được:**

❌ **Hardcode URL:**

```csharp
// SAI - KHÔNG làm thế này
returnUrl = "https://artisan-hub-project.vercel.app/";
```

❌ **Bỏ qua returnUrl từ frontend:**

```csharp
// SAI - KHÔNG làm thế này
var paymentData = new
{
    // ... không có returnUrl và cancelUrl
};
```

---

### **Bước 4: Kiểm tra PayOS Dashboard**

1. Đăng nhập PayOS Dashboard
2. Kiểm tra **Webhook URL** và **Return URL** settings
3. Đảm bảo domain `artisan-hub-project.vercel.app` được whitelist (nếu cần)

---

## 🔧 Cách Fix

### **Fix 1: Frontend chưa set biến môi trường**

1. Vào **Vercel Dashboard** → Project → **Settings** → **Environment Variables**
2. Thêm:
   - Name: `VITE_FRONTEND_URL`
   - Value: `https://artisan-hub-project.vercel.app`
   - Environment: `Production`, `Preview`
3. **Redeploy** project
4. Test lại

### **Fix 2: Backend không dùng returnUrl từ frontend**

**Kiểm tra Backend code:**

1. Backend có nhận `returnUrl` và `cancelUrl` từ request body không?
2. Backend có truyền các URL này cho PayOS API không?
3. Backend có hardcode URL nào không?

**Nếu Backend hardcode URL:**

- Sửa Backend để nhận và sử dụng `returnUrl` từ frontend
- Xóa mọi hardcode URL

### **Fix 3: Test local vs Production**

**Khi test local:**

- URL sẽ là `localhost:5173` (đúng)
- Để test production URL, cần deploy lên Vercel

**Khi deploy production:**

- URL phải là `https://artisan-hub-project.vercel.app`
- Phải set biến môi trường `VITE_FRONTEND_URL` trên Vercel

---

## 📝 Debug Logs

Sau khi thêm debug logs, khi click "Thanh toán" bạn sẽ thấy:

1. **Console Log 1:** `🔗 PayOS Return URL Debug` - Kiểm tra URL frontend đang dùng
2. **Console Log 2:** `📦 Payload gửi cho Backend` - Kiểm tra payload có returnUrl đúng không
3. **Network Tab:** Xem request thực tế gửi cho backend
4. **Console Log 3:** `💳 Payment URL từ Backend` - Kiểm tra paymentUrl nhận được

---

## ✅ Kết quả mong đợi

Sau khi fix, khi thanh toán xong, PayOS sẽ redirect về:

```
https://artisan-hub-project.vercel.app/?code=00&id=...&status=PAID&orderCode=...
```

**KHÔNG phải:**

```
https://localhost:5173/?code=00&id=...&status=PAID&orderCode=...
```

---

## 🆘 Vẫn không fix được?

1. Kiểm tra lại tất cả các bước trên
2. Xem Backend logs để kiểm tra PayOS API response
3. Kiểm tra PayOS Dashboard settings
4. Liên hệ team Backend để đảm bảo Backend đang sử dụng `returnUrl` từ frontend
