import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = "Đã xảy ra lỗi",
  className = "",
  showRetry = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-artisan-brown-300 mb-6 max-w-md">
          {error || "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau."}
        </p>
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
