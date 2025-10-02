import { Linkedin, Mail, Award, Users } from "lucide-react";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Giao Vĩnh Hưng",
      position: "CEO & Founder",
      image: "/images/team/ceo.jpg",
      description:
        "Với hơn 15 năm kinh nghiệm trong lĩnh vực nghệ thuật thủ công và phát triển kinh doanh.",
      achievements: [
        "Thạc sĩ Nghệ thuật",
        "15+ năm kinh nghiệm",
        "Nhà sáng lập",
      ],
      social: {
        linkedin: "#",
        email: "minh@artisanhub.vn",
      },
    },
    {
      name: "Biện Khắc Hội",
      position: "COO",
      image: "/images/team/coo.jpg",
      description: "Chuyên gia về vận hành và phát triển cộng đồng nghệ nhân.",
      achievements: [
        "MBA Quản trị",
        "10+ năm kinh nghiệm",
        "Chuyên gia cộng đồng",
      ],
      social: {
        linkedin: "#",
        email: "lan@artisanhub.vn",
      },
    },
    {
      name: "Hoàng Ngọc Tiến",
      position: "CTO",
      image: "/images/team/cto.jpg",
      description:
        "Dẫn dắt đội ngũ công nghệ để tạo ra những trải nghiệm số tuyệt vời.",
      achievements: ["Thạc sĩ CNTT", "12+ năm kinh nghiệm", "Chuyên gia AI/ML"],
      social: {
        linkedin: "#",
        email: "nam@artisanhub.vn",
      },
    },
    {
      name: "Lu Tử Kiệt",
      position: "Head of Marketing",
      image: "/images/team/marketing.jpg",
      description:
        "Chuyên gia marketing với niềm đam mê quảng bá văn hóa Việt Nam.",
      achievements: [
        "Thạc sĩ Marketing",
        "8+ năm kinh nghiệm",
        "Chuyên gia Brand",
      ],
      social: {
        linkedin: "#",
        email: "mai@artisanhub.vn",
      },
    },
  ];

  return (
    <section className="py-20" id="team">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-artisan-gold-100 text-artisan-gold-700 text-sm font-medium mb-4">
            <Users className="w-4 h-4 mr-2" />
            Đội ngũ của chúng tôi
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Gặp gỡ đội ngũ{" "}
            <span className="text-gradient-gold">ArtisanHub</span>
          </h2>
          <p className="text-lg text-artisan-brown-600 max-w-2xl mx-auto">
            Những con người tài năng và đầy nhiệt huyết đang làm việc để mang
            đến những trải nghiệm tốt nhất cho cộng đồng nghệ thuật thủ công
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
              style={{ boxShadow: "none" }}
            >
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-artisan-gold-100 to-artisan-brown-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-artisan-gold-500 rounded-full flex items-center justify-center shadow-md">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-lg text-artisan-brown-900 dark:text-white mb-1 font-display">
                {member.name}
              </h3>
              <p className="text-artisan-gold-600 font-medium mb-3">
                {member.position}
              </p>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300 leading-relaxed mb-4">
                {member.description}
              </p>

              {/* Achievements */}
              <div className="mb-4">
                {member.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center space-x-2 mb-2"
                  >
                    <div className="w-2 h-2 bg-artisan-gold-500 rounded-full"></div>
                    <span className="text-xs text-artisan-brown-600 dark:text-artisan-brown-300">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="flex justify-center space-x-3">
                <a
                  href={member.social.linkedin}
                  className="w-8 h-8 rounded-full bg-artisan-gold-100 flex items-center justify-center text-artisan-gold-600 hover:bg-artisan-gold-200 transition-colors duration-200"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${member.social.email}`}
                  className="w-8 h-8 rounded-full bg-artisan-gold-100 flex items-center justify-center text-artisan-gold-600 hover:bg-artisan-gold-200 transition-colors duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 mb-2">
              50+
            </div>
            <p className="text-artisan-brown-600">Nhân viên</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 mb-2">
              15+
            </div>
            <p className="text-artisan-brown-600">Năm kinh nghiệm</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 mb-2">
              1000+
            </div>
            <p className="text-artisan-brown-600">Nghệ nhân đối tác</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 mb-2">
              63
            </div>
            <p className="text-artisan-brown-600">Tỉnh thành</p>
          </div>
        </div>
      </div>
    </section>
  );
}
