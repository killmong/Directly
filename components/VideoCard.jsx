import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
export const VideoCard = ({ video, onDelete, formatNumber }) => (
  <div className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center gap-4">
    <Image
      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
      alt="thumb"
      className="w-24 h-16 rounded-lg object-cover"
      width={96}
      height={64}
    />
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-sm truncate">{video.title}</h4>
      <div className="flex gap-3 text-xs text-stone-500 mt-1">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" /> {formatNumber(video.views)}
        </span>
        <span className="text-orange-500 font-medium">{video.category}</span>
      </div>
    </div>
    <button
      onClick={() => onDelete(video.id)}
      className="p-2 text-stone-400 hover:text-red-500 rounded-lg"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);
