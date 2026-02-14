import { Star, StarHalf } from "lucide-react";

export function RatingStars({ rating, count }: { rating: number, count?: number }) {
    // Generate stars array
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
        } else if (i === fullStars && hasHalfStar) {
            stars.push(<StarHalf key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
        } else {
            stars.push(<Star key={i} className="w-4 h-4 text-gray-500" />);
        }
    }

    return (
        <div className="flex items-center gap-1" title={`${rating.toFixed(1)} / 5`}>
            {stars}
            {count !== undefined && (
                <span className="text-xs text-white/50 ml-1">({count})</span>
            )}
        </div>
    );
}
