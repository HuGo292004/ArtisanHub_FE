import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

const ArtistCard = ({ artist }) => {
  const {
    artistName,
    shopName,
    profileImage,
    bio,
    location,
    specialty,
    experienceYears,
    achievements = [],
  } = artist;

  return (
    <Card className="overflow-hidden artist-card-hover bg-white border border-artisan-brown-200 h-full flex flex-col">
      {/* Ảnh đại diện */}
      <div className="relative h-64 overflow-hidden">
        {profileImage ? (
          <img
            src={profileImage}
            alt={artistName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-full h-full ${
            profileImage ? "hidden" : "flex"
          } items-center justify-center bg-gradient-to-br from-artisan-brown-200 to-artisan-brown-300`}
        >
          <div className="text-center text-artisan-brown-600">
            <div className="text-sm font-medium">Nghệ nhân</div>
          </div>
        </div>
        {specialty && (
          <div className="absolute top-4 left-4">
            <span className="specialty-badge">{specialty}</span>
          </div>
        )}
      </div>

      {/* Thông tin nghệ nhân */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-artisan-gold-400 mb-1">
            {artistName || "Chưa bổ sung"}
          </h3>
          <p className="text-artisan-brown-600 font-medium">
            {shopName || "Chưa bổ sung"}
          </p>
          <p className="text-artisan-brown-500 text-sm mt-1">
            📍 {location || "Chưa bổ sung"}
          </p>
        </div>

        {/* Mô tả */}
        <p className="text-artisan-brown-700 text-sm mb-4 line-clamp-3">
          {bio || "Chưa bổ sung mô tả"}
        </p>

        {/* Thông tin kinh nghiệm */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-white">
            <span className="font-medium">Kinh nghiệm:</span>
            <span className="ml-2 bg-artisan-gold-500 px-2 py-1 rounded">
              {experienceYears ? `${experienceYears} năm` : "Chưa bổ sung"}
            </span>
          </div>
        </div>

        {/* Thành tích */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-2">
            Thành tích nổi bật:
          </h4>
          {achievements && achievements.length > 0 ? (
            <div className="space-y-1">
              {achievements.slice(0, 2).map((achievement, index) => (
                <div
                  key={index}
                  className="text-xs text-artisan-brown-600 flex items-start"
                >
                  <span className="text-artisan-gold-500 mr-2">🏆</span>
                  <span className="line-clamp-2">
                    {achievement.description}
                  </span>
                </div>
              ))}
              {achievements.length > 2 && (
                <p className="text-xs text-artisan-brown-500 italic">
                  +{achievements.length - 2} thành tích khác
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-artisan-brown-500 italic">
              Chưa bổ sung thành tích
            </p>
          )}
        </div>

        {/* Spacer để đẩy buttons xuống dưới */}
        <div className="flex-grow"></div>

        {/* Nút hành động - luôn ở dưới cùng */}
        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1 bg-artisan-brown-600 hover:bg-artisan-brown-700 text-white"
            size="sm"
          >
            Xem chi tiết
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-artisan-brown-300 text-artisan-brown-700 hover:bg-artisan-brown-50"
            size="sm"
          >
            Liên hệ
          </Button>
        </div>
      </div>
    </Card>
  );
};

ArtistCard.propTypes = {
  artist: PropTypes.shape({
    artistId: PropTypes.number,
    artistName: PropTypes.string.isRequired,
    shopName: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    bio: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    specialty: PropTypes.string,
    experienceYears: PropTypes.number,
    achievements: PropTypes.arrayOf(
      PropTypes.shape({
        achievementId: PropTypes.number,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default ArtistCard;
