import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (message, variant = "success", durationMs = 3000) => {
      const id = ++idRef.current;
      const toast = { id, message, variant };
      setToasts((prev) => [toast, ...prev]);
      if (durationMs > 0) {
        setTimeout(() => remove(id), durationMs);
      }
      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      success: (msg, ms) => add(msg, "success", ms ?? 3000),
      error: (msg, ms) => add(msg, "error", ms ?? 4000),
      info: (msg, ms) => add(msg, "info", ms ?? 3000),
      remove,
    }),
    [add, remove]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastViewport({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-lg px-4 py-3 text-sm shadow-lg border",
            t.variant === "success" &&
              "bg-green-600/90 text-white border-green-400/40",
            t.variant === "error" &&
              "bg-red-600/90 text-white border-red-400/40",
            t.variant === "info" &&
              "bg-blue-600/90 text-white border-blue-400/40",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">{t.message}</div>
            <button
              onClick={() => onClose(t.id)}
              className="ml-2 text-white/80 hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node,
};

ToastViewport.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.node.isRequired,
      variant: PropTypes.oneOf(["success", "error", "info"]).isRequired,
    })
  ),
  onClose: PropTypes.func.isRequired,
};
