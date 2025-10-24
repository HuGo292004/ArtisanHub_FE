import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ 
  size = "default", 
  text = "Đang tải...", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-artisan-gold-500 ${sizeClasses[size]}`} />
      {text && (
        <p className={`mt-2 text-artisan-brown-300 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
