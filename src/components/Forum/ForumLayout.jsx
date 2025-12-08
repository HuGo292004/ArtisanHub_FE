import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ChevronRight, Clock, Users } from "lucide-react";
import ForumHero from "./ForumHero";
import { getAllForumTopics } from "@/services/forumService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ForumLayout = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllForumTopics();

        if (response && response.isSuccess && response.data) {
          setTopics(
            Array.isArray(response.data) ? response.data : [response.data]
          );
        } else {
          setTopics([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách chủ đề:", err);
        setError(err.message || "Không thể tải danh sách chủ đề");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Màu sắc đa dạng cho các topic cards
  const topicColors = [
    "from-amber-500/20 to-orange-600/20 border-amber-500/30",
    "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
    "from-blue-500/20 to-indigo-600/20 border-blue-500/30",
    "from-rose-500/20 to-pink-600/20 border-rose-500/30",
    "from-violet-500/20 to-purple-600/20 border-violet-500/30",
    "from-cyan-500/20 to-sky-600/20 border-cyan-500/30",
  ];

  const iconColors = [
    "text-amber-400",
    "text-emerald-400",
    "text-blue-400",
    "text-rose-400",
    "text-violet-400",
    "text-cyan-400",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        <ForumHero />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" text="Đang tải danh sách chủ đề..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        <ForumHero />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-artisan-gold-500 text-white px-6 py-2 rounded-lg hover:bg-artisan-gold-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-brown-950">
      <ForumHero />

      {/* Danh sách chủ đề */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-artisan-gold-400 mb-4">
                Các Chủ Đề Diễn Đàn
              </h2>
              <p className="text-artisan-brown-300 text-lg">
                Khám phá và tham gia thảo luận về các lĩnh vực thủ công truyền
                thống
              </p>
            </div>

            {topics.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-artisan-gold-400 text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Chưa có chủ đề nào
                </h3>
                <p className="text-artisan-brown-300">
                  Các chủ đề diễn đàn sẽ sớm được cập nhật
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {topics.map((topic, index) => (
                  <Link
                    key={topic.id}
                    to={`/forum/topic/${topic.id}`}
                    className={`group block p-6 rounded-2xl border bg-gradient-to-br ${
                      topicColors[index % topicColors.length]
                    } hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-artisan-gold-500/10`}
                  >
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 p-4 rounded-xl bg-artisan-brown-800/50 ${
                          iconColors[index % iconColors.length]
                        }`}
                      >
                        <MessageSquare className="w-8 h-8" />
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-artisan-gold-400 transition-colors">
                              {topic.title}
                            </h3>
                            <p className="text-artisan-brown-300 line-clamp-2">
                              {topic.description}
                            </p>
                          </div>
                          <ChevronRight className="flex-shrink-0 w-6 h-6 text-artisan-brown-400 group-hover:text-artisan-gold-400 group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 mt-4 text-sm text-artisan-brown-400">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>Thảo luận</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Cộng đồng</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Hoạt động</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForumLayout;
