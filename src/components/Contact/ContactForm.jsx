import { useState } from "react";
import { Send, User, Mail, MessageSquare, Phone } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Vui lòng nhập chủ đề";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung tin nhắn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Show success message (you can integrate with your toast system)
      alert(
        "Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất."
      );
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-artisan-gold-200/50">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
          Gửi tin nhắn cho chúng tôi
        </h2>
        <p className="text-white/80 text-lg">
          Chúng tôi sẽ phản hồi trong vòng 24 giờ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Họ và tên *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-artisan-gold-500 focus:border-artisan-gold-500 transition-colors text-white placeholder-white/60 ${
                  errors.name ? "border-red-500" : "border-white/30"
                }`}
                placeholder="Nhập họ và tên của bạn"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-artisan-gold-500 focus:border-artisan-gold-500 transition-colors text-white placeholder-white/60 ${
                  errors.email ? "border-red-500" : "border-white/30"
                }`}
                placeholder="Nhập email của bạn"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone field */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-white"
            >
              Số điện thoại *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-artisan-gold-500 focus:border-artisan-gold-500 transition-colors text-white placeholder-white/60 ${
                  errors.phone ? "border-red-500" : "border-white/30"
                }`}
                placeholder="Nhập số điện thoại"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Subject field */}
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-white"
            >
              Chủ đề *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-artisan-gold-500 focus:border-artisan-gold-500 transition-colors text-white placeholder-white/60 ${
                  errors.subject ? "border-red-500" : "border-white/30"
                }`}
                placeholder="Chủ đề tin nhắn"
              />
            </div>
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>
        </div>

        {/* Message field */}
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-white"
          >
            Nội dung tin nhắn *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-artisan-gold-500 focus:border-artisan-gold-500 transition-colors resize-none text-white placeholder-white/60 ${
              errors.message ? "border-red-500" : "border-white/30"
            }`}
            placeholder="Nhập nội dung tin nhắn của bạn..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isSubmitting
                ? "bg-artisan-brown-400 cursor-not-allowed"
                : "bg-gradient-to-r from-artisan-gold-500 to-artisan-gold-600 hover:from-artisan-gold-600 hover:to-artisan-gold-700 hover:shadow-lg hover:scale-105"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Gửi tin nhắn
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
