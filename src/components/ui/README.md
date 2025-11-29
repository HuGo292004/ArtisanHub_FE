# Common UI Components

This directory contains reusable UI components for consistent loading, error handling, and user experience across the application.

## Components

### LoadingSpinner
A customizable loading spinner component.

```jsx
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Basic usage
<LoadingSpinner />

// With custom size and text
<LoadingSpinner 
  size="lg" 
  text="Đang tải dữ liệu..." 
  className="my-8"
/>
```

**Props:**
- `size`: "sm" | "default" | "lg" | "xl" (default: "default")
- `text`: string (default: "Đang tải...")
- `className`: string (additional CSS classes)

### ErrorDisplay
A consistent error display component with retry functionality.

```jsx
import ErrorDisplay from "@/components/ui/ErrorDisplay";

// Basic usage
<ErrorDisplay error="Something went wrong" />

// With retry functionality
<ErrorDisplay 
  error="Failed to load data"
  onRetry={() => refetchData()}
  title="Lỗi tải dữ liệu"
  showRetry={true}
/>
```

**Props:**
- `error`: string (error message)
- `onRetry`: function (retry callback)
- `title`: string (error title, default: "Đã xảy ra lỗi")
- `className`: string (additional CSS classes)
- `showRetry`: boolean (show retry button, default: true)

### PageLoader
A comprehensive page loader that handles loading, error, and content states.

```jsx
import PageLoader from "@/components/ui/PageLoader";

<PageLoader
  loading={isLoading}
  error={error}
  onRetry={handleRetry}
  loadingText="Đang tải..."
  errorTitle="Lỗi tải dữ liệu"
  className="min-h-screen"
>
  {/* Your content here */}
  <div>Page content when loaded successfully</div>
</PageLoader>
```

**Props:**
- `loading`: boolean (loading state)
- `error`: string | null (error message)
- `onRetry`: function (retry callback)
- `children`: ReactNode (content to show when loaded)
- `loadingText`: string (loading message)
- `errorTitle`: string (error title)
- `className`: string (additional CSS classes)

## Usage Examples

### In a Profile Component
```jsx
import PageLoader from "@/components/ui/PageLoader";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleRetry = () => {
    fetchUserData();
  };

  return (
    <PageLoader
      loading={loading}
      error={error}
      onRetry={handleRetry}
      loadingText="Đang tải thông tin người dùng..."
      errorTitle="Không thể tải thông tin"
      className="min-h-screen bg-artisan-brown-950"
    >
      <div>
        {/* Profile content */}
        <h1>{user.name}</h1>
        {/* ... */}
      </div>
    </PageLoader>
  );
};
```

### In a Data List Component
```jsx
import PageLoader from "@/components/ui/PageLoader";

const ProductList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  return (
    <PageLoader
      loading={loading}
      error={error}
      onRetry={() => fetchProducts()}
      loadingText="Đang tải danh sách sản phẩm..."
      errorTitle="Không thể tải sản phẩm"
    >
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PageLoader>
  );
};
```

## Benefits

1. **Consistency**: All loading and error states look the same across the app
2. **Reusability**: Write once, use everywhere
3. **Maintainability**: Update styling in one place
4. **User Experience**: Consistent and professional loading/error states
5. **Accessibility**: Proper ARIA labels and semantic HTML
