# ArtisanHub - Landing Page

![ArtisanHub Logo](https://via.placeholder.com/120x120/f59e0b/ffffff?text=AH)

**ArtisanHub** là một landing page hiện đại cho nền tảng bán đồ thủ công mỹ nghệ Việt Nam, được thiết kế với giao diện phù hợp với xu hướng 2025.

## ✨ Tính năng nổi bật

- 🎨 **Giao diện hiện đại**: Thiết kế theo xu hướng 2025 với màu sắc chủ đạo vàng và nâu
- 🌙 **Dark Mode**: Hỗ trợ chuyển đổi giữa light và dark theme
- 📱 **Responsive**: Tối ưu cho mọi thiết bị từ mobile đến desktop
- ⚡ **Performance**: Sử dụng Vite để build nhanh chóng
- 🎯 **Modern Stack**: React 18 + TailwindCSS v4 + Lucide Icons
- 🧩 **Component-based**: Cấu trúc components rõ ràng, dễ bảo trì

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: React 18.3.1
- **Styling**: TailwindCSS v4.1.13
- **Build Tool**: Vite 6.0.5
- **Icons**: Lucide React
- **Development**: ESLint + Hot Reload

## 📁 Cấu trúc dự án

```
artisan-hub/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # UI components cơ bản
│   │   │   ├── button.jsx
│   │   │   └── card.jsx
│   │   ├── Header.jsx      # Header với navigation
│   │   ├── Hero.jsx        # Hero section
│   │   ├── Features.jsx    # Features section
│   │   ├── Products.jsx    # Products showcase
│   │   ├── Artisans.jsx    # Artisans section
│   │   ├── Testimonials.jsx # Customer reviews
│   │   └── Footer.jsx      # Footer
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.jsx # Dark mode context
│   ├── lib/               # Utilities
│   │   └── utils.js       # Helper functions
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles + TailwindCSS
├── public/               # Static assets
├── package.json         # Dependencies
├── vite.config.js      # Vite configuration
└── README.md           # Documentation
```

## 🚀 Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd artisan-hub
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc:

```bash
# API Backend URL
VITE_API_BASE_URL=http://localhost:5000/api

# Frontend URL (cho PayOS returnUrl)
# Development: để trống (sẽ tự động dùng window.location.origin)
# Production: set URL deploy của bạn
VITE_FRONTEND_URL=https://artisan-hub-project.vercel.app
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173) để xem kết quả.

### 5. Build cho production

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```

## 🌐 Deploy lên Vercel

### Cấu hình biến môi trường trên Vercel:

1. Vào **Settings** → **Environment Variables**
2. Thêm các biến sau:

| Name                | Value                                    | Environment         |
| ------------------- | ---------------------------------------- | ------------------- |
| `VITE_API_BASE_URL` | `https://your-backend-api.com/api`       | Production, Preview |
| `VITE_FRONTEND_URL` | `https://artisan-hub-project.vercel.app` | Production, Preview |

**Lưu ý quan trọng:**

- `VITE_FRONTEND_URL` phải là URL chính xác của frontend deploy (không có trailing slash `/`)
- URL này được dùng để PayOS redirect về sau khi thanh toán
- Đảm bảo domain đã được whitelist trong PayOS Dashboard (nếu cần)

## 🎨 Màu sắc chủ đạo

### Artisan Gold (Vàng)

- `artisan-gold-50`: #fffbeb
- `artisan-gold-500`: #f59e0b (Primary)
- `artisan-gold-600`: #d97706
- `artisan-gold-900`: #78350f

### Artisan Brown (Nâu)

- `artisan-brown-50`: #fdf8f6
- `artisan-brown-500`: #bfa094
- `artisan-brown-800`: #846358
- `artisan-brown-950`: #292017

## 📱 Sections của Landing Page

1. **Header**: Navigation với logo, menu, dark mode toggle, và call-to-action
2. **Hero**: Section chính với headline, description, và hero image
3. **Features**: Các tính năng nổi bật của ArtisanHub (6 features)
4. **Products**: Showcase sản phẩm thủ công nổi bật (6 sản phẩm)
5. **Artisans**: Giới thiệu các nghệ nhân đối tác (4 nghệ nhân)
6. **Testimonials**: Đánh giá từ khách hàng (4 testimonials)
7. **Footer**: Thông tin liên hệ, links, và newsletter signup

## 🎯 Tính năng Dark Mode

Dark mode được implement thông qua:

- `ThemeContext` để quản lý state
- TailwindCSS `dark:` variants
- Local storage để lưu preferences
- Smooth transition giữa các theme

## 📦 Components chính

### UI Components

- `Button`: Component button với nhiều variants
- `Card`: Component card với header, content, footer

### Layout Components

- `Header`: Navigation bar với responsive menu
- `Hero`: Hero section với animations
- `Features`: Grid layout cho features
- `Products`: Product cards với hover effects
- `Artisans`: Artisan profiles
- `Testimonials`: Customer review cards
- `Footer`: Comprehensive footer với links và contact

## 🎭 Animations và Effects

- **Hover Effects**: Scale, shadow, color transitions
- **Float Animation**: Floating elements trong hero section
- **Glow Effect**: Glowing buttons
- **Fade In**: Smooth fade in animations
- **Card Hover**: 3D hover effects cho cards

## 🔧 Customization

### Thay đổi màu sắc

Chỉnh sửa trong `src/index.css`:

```css
@theme {
  --color-artisan-gold-500: #your-color;
  --color-artisan-brown-500: #your-color;
}
```

### Thêm components mới

1. Tạo file trong `src/components/`
2. Import vào `App.jsx`
3. Sử dụng TailwindCSS classes có sẵn

### Thay đổi content

- **Products**: Chỉnh sửa array `products` trong `Products.jsx`
- **Artisans**: Chỉnh sửa array `artisans` trong `Artisans.jsx`
- **Testimonials**: Chỉnh sửa array `testimonials` trong `Testimonials.jsx`

## 💳 Cấu hình PayOS Payment

### Flow thanh toán:

1. User click "Thanh toán" → Frontend gửi `returnUrl` và `cancelUrl` cho Backend
2. Backend tạo payment link PayOS với `returnUrl` = `https://artisan-hub-project.vercel.app/`
3. User thanh toán xong → PayOS redirect về `https://artisan-hub-project.vercel.app/?code=00&status=PAID&orderCode=...`
4. `PaymentCallback` component (render ở HomePage) tự động xử lý query params

### Lưu ý quan trọng:

- ✅ **Frontend URL**: Phải set `VITE_FRONTEND_URL` trên Vercel = `https://artisan-hub-project.vercel.app`
- ✅ **Backend**: Phải nhận `returnUrl` và `cancelUrl` từ frontend và truyền cho PayOS
- ✅ **PayOS Dashboard**: Đảm bảo domain `artisan-hub-project.vercel.app` được whitelist (nếu cần)
- ✅ **Callback URL**: PayOS sẽ redirect về root URL `/` với query params, không phải `/payment/success`

### Kiểm tra khi deploy:

1. Đảm bảo biến môi trường `VITE_FRONTEND_URL` đã được set trên Vercel
2. Test thanh toán và kiểm tra PayOS có redirect về đúng URL không
3. Kiểm tra `PaymentCallback` component có xử lý được query params không

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🤝 Contributing

Contributions, issues và feature requests đều được chào đón!

## 📞 Liên hệ

- **Email**: hello@artisanhub.vn
- **Website**: https://artisanhub.vn
- **Phone**: +84 24 3826 1234

---

Được tạo với ❤️ tại Việt Nam bởi ArtisanHub Team
