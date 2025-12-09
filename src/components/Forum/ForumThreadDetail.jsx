import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Send,
  CornerDownRight,
} from "lucide-react";
import { getThreadById, createPost } from "@/services/forumService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";

const ForumThreadDetail = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New post state
  const [newPostContent, setNewPostContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        setError(null);

        const threadRes = await getThreadById(threadId);

        if (threadRes && threadRes.isSuccess && threadRes.data) {
          setThread(threadRes.data);
          // Posts are included in thread response
          setPosts(threadRes.data.posts || []);
        } else {
          setError("Không tìm thấy bài viết");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(err.message || "Không thể tải dữ liệu bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (threadId) {
      fetchThread();
    }
  }, [threadId]);

  const refreshThread = async () => {
    try {
      const threadRes = await getThreadById(threadId);
      if (threadRes && threadRes.isSuccess && threadRes.data) {
        setThread(threadRes.data);
        setPosts(threadRes.data.posts || []);
      }
    } catch (err) {
      console.error("Lỗi khi refresh:", err);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (!newPostContent.trim()) {
      setSubmitError("Vui lòng nhập nội dung phản hồi");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await createPost({
        forumThreadId: parseInt(threadId),
        content: newPostContent.trim(),
      });

      if (response && response.isSuccess) {
        // Refresh thread to get updated posts
        await refreshThread();
        // Reset form
        setNewPostContent("");
      } else {
        setSubmitError(response?.message || "Không thể gửi phản hồi");
      }
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      setSubmitError(err.message || "Đã xảy ra lỗi khi gửi phản hồi");
    } finally {
      setSubmitting(false);
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
            <LoadingSpinner size="lg" text="Đang tải bài viết..." />
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
              onClick={() => navigate(-1)}
              className="bg-artisan-gold-500 hover:bg-artisan-gold-600"
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-brown-950 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-artisan-brown-300 hover:text-artisan-gold-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại danh sách bài viết</span>
          </button>

          {/* Thread Content */}
          <div className="bg-gradient-to-br from-artisan-brown-800 to-artisan-brown-900 rounded-2xl border border-artisan-brown-700 overflow-hidden mb-8">
            {/* Thread Image */}
            {thread?.imageUrl && (
              <div className="w-full h-64 md:h-80">
                <img
                  src={thread.imageUrl}
                  alt={thread.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Thread Header */}
            <div className="p-6 border-b border-artisan-brown-700">
              <h1 className="text-2xl font-bold text-white mb-4">
                {thread?.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-artisan-brown-400">
                {/* Author info */}
                <div className="flex items-center gap-2">
                  {thread?.author?.avatar ? (
                    <img
                      src={thread.author.avatar}
                      alt={thread.author.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-artisan-gold-500/20 flex items-center justify-center">
                      <span className="text-artisan-gold-400 font-bold">
                        {(thread?.author?.username || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-artisan-gold-400 font-medium">
                    {thread?.author?.username || "Ẩn danh"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(thread?.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Thread Body - First post content */}
            {posts.length > 0 && posts[0] && (
              <div className="p-6">
                <p className="text-artisan-brown-200 whitespace-pre-wrap leading-relaxed text-lg">
                  {posts[0].content}
                </p>
              </div>
            )}
          </div>

          {/* Comments/Replies Section - posts[1] onwards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-artisan-gold-400" />
                <h2 className="text-xl font-semibold text-white">
                  Bình luận ({Math.max(0, posts.length - 1)})
                </h2>
              </div>
              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    const textarea = document.querySelector("textarea");
                    if (textarea) textarea.focus();
                  }}
                  className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Viết bình luận
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Đăng nhập để bình luận
                </Button>
              )}
            </div>

            {/* Comments list - skip first post (it's the thread content) */}
            {posts.length <= 1 ? (
              <div className="text-center py-12 bg-artisan-brown-900/50 rounded-xl border border-artisan-brown-800">
                <div className="text-artisan-gold-400 text-5xl mb-4">💭</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Chưa có bình luận nào
                </h3>
                <p className="text-artisan-brown-400 mb-4">
                  Hãy là người đầu tiên bình luận bài viết này!
                </p>
                {isLoggedIn ? (
                  <Button
                    onClick={() => {
                      const textarea = document.querySelector("textarea");
                      if (textarea) textarea.focus();
                    }}
                    className="bg-artisan-gold-500 hover:bg-artisan-gold-600"
                  >
                    Viết bình luận đầu tiên
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-artisan-gold-500 hover:bg-artisan-gold-600"
                  >
                    Đăng nhập để bình luận
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.slice(1).map((post, index) => (
                  <div
                    key={post.id}
                    className="bg-artisan-brown-900/50 rounded-xl border border-artisan-brown-800 overflow-hidden"
                  >
                    {/* Comment Header */}
                    <div className="flex items-center justify-between p-4 border-b border-artisan-brown-800 bg-artisan-brown-900/30">
                      <div className="flex items-center gap-3">
                        {post.author?.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-artisan-gold-400 to-artisan-gold-600 flex items-center justify-center text-white font-bold">
                            {(post.author?.username || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-artisan-brown-100 font-medium">
                            {post.author?.username || "Ẩn danh"}
                          </div>
                          <div className="text-sm text-artisan-brown-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(post.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-artisan-brown-500">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="p-4">
                      <p className="text-artisan-brown-200 whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Form */}
          {isLoggedIn ? (
            <div className="bg-artisan-brown-900/50 rounded-xl border border-artisan-brown-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CornerDownRight className="w-5 h-5 text-artisan-gold-400" />
                <h3 className="text-lg font-semibold text-white">
                  Viết bình luận
                </h3>
              </div>

              <form onSubmit={handleSubmitPost}>
                {submitError && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                    {submitError}
                  </div>
                )}

                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Nhập bình luận của bạn..."
                  rows={4}
                  className="w-full px-4 py-3 bg-artisan-brown-800 border border-artisan-brown-700 rounded-lg text-white placeholder-artisan-brown-500 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent resize-none mb-4"
                  disabled={submitting}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting || !newPostContent.trim()}
                    className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" text="" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi bình luận
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-artisan-brown-900/50 rounded-xl border border-artisan-brown-800 p-6 text-center">
              <p className="text-artisan-brown-300 mb-4">
                Vui lòng đăng nhập để bình luận
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
      </div>
    </div>
  );
};

export default ForumThreadDetail;
