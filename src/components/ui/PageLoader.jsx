import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";

const PageLoader = ({ 
  loading, 
  error, 
  onRetry, 
  children, 
  loadingText = "Đang tải...",
  errorTitle = "Đã xảy ra lỗi",
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`min-h-96 flex items-center justify-center ${className}`}>
        <LoadingSpinner size="lg" text={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorDisplay 
          error={error} 
          onRetry={onRetry}
          title={errorTitle}
        />
      </div>
    );
  }

  return children;
};

export default PageLoader;
