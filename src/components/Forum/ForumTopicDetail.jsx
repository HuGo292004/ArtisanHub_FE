import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Clock,
  User,
  ChevronRight,
  X,
} from "lucide-react";
import {
  getForumTopicById,
  getThreadsByTopicId,
  createThread,
} from "@/services/forumService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";

const ForumTopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for creating new thread
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch topic details first
        const topicRes = await getForumTopicById(topicId);

        if (topicRes && topicRes.isSuccess && topicRes.data) {
          setTopic(topicRes.data);
        } else {
          setError("Không tìm thấy chủ đề này");
          setLoading(false);
          return;
        }

        // Then fetch threads - handle 404 as empty list
        try {
          const threadsRes = await getThreadsByTopicId(topicId);
          if (threadsRes && threadsRes.isSuccess && threadsRes.data) {
            const threadsData = Array.isArray(threadsRes.data)
              ? threadsRes.data
              : threadsRes.data.items || [];
            setThreads(threadsData);
          } else {
            setThreads([]);
          }
        } catch (threadErr) {
          // Nếu lỗi 404 nghĩa là chưa có threads nào
          console.log("Threads error:", threadErr);
          setThreads([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(err.message || "Không thể tải dữ liệu chủ đề");
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchData();
    }
  }, [topicId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThread({ ...newThread, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewThread({ ...newThread, imageFile: null });
    setImagePreview(null);
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();

    if (!newThread.title.trim() || !newThread.content.trim()) {
      setCreateError("Vui lòng điền đầy đủ tiêu đề và nội dung");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      const response = await createThread({
        forumTopicId: parseInt(topicId),
        title: newThread.title.trim(),
        content: newThread.content.trim(),
        imageFile: newThread.imageFile,
      });

      if (response && response.isSuccess) {
        // Refresh threads list
        try {
          const threadsRes = await getThreadsByTopicId(topicId);
          if (threadsRes && threadsRes.isSuccess && threadsRes.data) {
            const threadsData = Array.isArray(threadsRes.data)
              ? threadsRes.data
              : threadsRes.data.items || [];
            setThreads(threadsData);
          }
        } catch {
          // Nếu lỗi thì thêm thread mới vào list
          if (response.data) {
            setThreads((prev) => [response.data, ...prev]);
          }
        }

        // Reset form and close modal
        setNewThread({ title: "", content: "", imageFile: null });
        setImagePreview(null);
        setShowCreateModal(false);
      } else {
        setCreateError(response?.message || "Không thể tạo bài viết mới");
      }
    } catch (err) {
      console.error("Lỗi khi tạo thread:", err);
      setCreateError(err.message || "Đã xảy ra lỗi khi tạo bài viết");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950 pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" text="Đang tải chủ đề..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-artisan-brown-950 pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <Button
              onClick={() => navigate("/forum")}
              className="bg-artisan-gold-500 hover:bg-artisan-gold-600"
            >
              Quay lại diễn đàn
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-brown-950 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb & Back button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/forum")}
              className="flex items-center gap-2 text-artisan-brown-300 hover:text-artisan-gold-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            <div className="text-artisan-brown-500">/</div>
            <span className="text-artisan-gold-400">
              {topic?.title || "Chủ đề"}
            </span>
          </div>

          {/* Topic Header */}
          <div className="bg-gradient-to-br from-artisan-brown-800 to-artisan-brown-900 rounded-2xl p-8 mb-8 border border-artisan-brown-700">
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-xl bg-artisan-gold-500/20">
                <MessageSquare className="w-10 h-10 text-artisan-gold-400" />
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-white mb-3">
                  {topic?.title}
                </h1>
                <p className="text-artisan-brown-300 text-lg">
                  {topic?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-white">
              Các bài viết ({threads.length})
            </h2>
            {isLoggedIn ? (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tạo bài viết mới
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Đăng nhập để tạo bài viết
              </Button>
            )}
          </div>

          {/* Threads List */}
          {threads.length === 0 ? (
            <div className="text-center py-16 bg-artisan-brown-900/50 rounded-2xl border border-artisan-brown-800">
              <div className="text-artisan-gold-400 text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-artisan-brown-300 mb-6">
                Hãy là người đầu tiên tạo bài viết trong chủ đề này!
              </p>
              {isLoggedIn ? (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-artisan-gold-500 hover:bg-artisan-gold-600"
                >
                  Tạo bài viết đầu tiên
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-artisan-brown-400 text-sm">
                    Vui lòng đăng nhập để tạo bài viết
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-artisan-gold-500 hover:bg-artisan-gold-600"
                  >
                    Đăng nhập
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {threads.map((thread) => (
                <Link
                  key={thread.id}
                  to={`/forum/thread/${thread.id}`}
                  className="group block bg-artisan-brown-900/50 rounded-xl border border-artisan-brown-800 hover:border-artisan-gold-500/50 hover:bg-artisan-brown-900 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex">
                    {/* Thread Image */}
                    {thread.imageUrl && (
                      <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
                        <img
                          src={thread.imageUrl}
                          alt={thread.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Thread Content */}
                    <div className="flex-grow p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow min-w-0">
                          {/* Author info */}
                          {thread.author && (
                            <div className="flex items-center gap-2 mb-3">
                              {thread.author.avatar && (
                                <img
                                  src={thread.author.avatar}
                                  alt={thread.author.username}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <span className="text-sm text-artisan-gold-400">
                                {thread.author.username}
                              </span>
                            </div>
                          )}

                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-artisan-gold-400 transition-colors">
                            {thread.title}
                          </h3>

                          {/* Show first post content if available */}
                          {thread.posts && thread.posts.length > 0 && (
                            <p className="text-artisan-brown-400 line-clamp-2 mb-4">
                              {thread.posts[0].content}
                            </p>
                          )}

                          <div className="flex items-center gap-6 text-sm text-artisan-brown-500">
                            {!thread.author && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>
                                  {thread.createdByName ||
                                    thread.authorName ||
                                    "Ẩn danh"}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatDate(
                                  thread.createdAt || thread.createdDate
                                )}
                              </span>
                            </div>
                            {/* Chỉ hiển thị số bình luận nếu có dữ liệu */}
                            {(thread.posts?.length > 1 ||
                              thread.commentCount ||
                              thread.postCount) && (
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>
                                  {thread.posts?.length > 0
                                    ? Math.max(0, thread.posts.length - 1)
                                    : thread.commentCount ??
                                      thread.postCount ??
                                      0}{" "}
                                  bình luận
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="flex-shrink-0 w-6 h-6 text-artisan-brown-500 group-hover:text-artisan-gold-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-artisan-brown-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-artisan-brown-700 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-artisan-brown-700">
              <h2 className="text-xl font-bold text-white">Tạo bài viết mới</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewThread({ title: "", content: "", imageFile: null });
                  setImagePreview(null);
                  setCreateError(null);
                }}
                className="p-2 text-artisan-brown-400 hover:text-white hover:bg-artisan-brown-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateThread} className="p-6">
              {createError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  {createError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-artisan-brown-200 font-medium mb-2">
                  Tiêu đề bài viết <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newThread.title}
                  onChange={(e) =>
                    setNewThread({ ...newThread, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-3 bg-artisan-brown-800 border border-artisan-brown-700 rounded-lg text-white placeholder-artisan-brown-500 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                  disabled={creating}
                />
              </div>

              <div className="mb-6">
                <label className="block text-artisan-brown-200 font-medium mb-2">
                  Nội dung <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={newThread.content}
                  onChange={(e) =>
                    setNewThread({ ...newThread, content: e.target.value })
                  }
                  placeholder="Nhập nội dung bài viết..."
                  rows={6}
                  className="w-full px-4 py-3 bg-artisan-brown-800 border border-artisan-brown-700 rounded-lg text-white placeholder-artisan-brown-500 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent resize-none"
                  disabled={creating}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-artisan-brown-200 font-medium mb-2">
                  Hình ảnh (tùy chọn)
                </label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-artisan-brown-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-artisan-brown-700 rounded-lg cursor-pointer hover:border-artisan-gold-500 transition-colors bg-artisan-brown-800/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-artisan-brown-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-artisan-brown-400">
                        Nhấn để tải hình ảnh lên
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={creating}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowCreateModal(false);
                    setImagePreview(null);
                    setNewThread({ title: "", content: "", imageFile: null });
                    setCreateError(null);
                  }}
                  disabled={creating}
                  className="text-artisan-brown-300 hover:text-white"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
                >
                  {creating ? (
                    <>
                      <LoadingSpinner size="sm" text="" className="mr-2" />
                      Đang tạo...
                    </>
                  ) : (
                    "Đăng bài viết"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumTopicDetail;
