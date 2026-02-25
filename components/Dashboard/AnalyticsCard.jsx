import { BarChart3, Sparkles, Wand2, Loader2 } from "lucide-react";

export const AnalyticsCard = ({ totalViews, topVideos, formatNumber }) => (
  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col">
    <div className="flex items-center gap-2 text-stone-500 mb-6">
      <BarChart3 className="w-5 h-5" />
      <h3 className="font-semibold text-stone-900">Performance</h3>
    </div>
    <div className="flex items-end gap-4 mb-8">
      <div className="text-5xl font-bold tracking-tighter">
        {formatNumber(totalViews)}
      </div>
      <div className="text-sm text-stone-500 pb-1 uppercase font-medium">
        Total Views
      </div>
    </div>
    <div className="space-y-4">
      {topVideos.map((v, i) => (
        <div key={v.id} className="relative">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium truncate pr-4">{v.title}</span>
            <span className="text-stone-500">{formatNumber(v.views)}</span>
          </div>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${i === 0 ? "bg-orange-500" : "bg-stone-300"}`}
              style={{
                width: `${(v.views / (topVideos[0]?.views || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AIPersonaCard = ({
  aiAnalysis,
  onGenerate,
  isAnalyzing,
  hasVideos,
}) => (
  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100 relative overflow-hidden">
    <h3 className="text-lg font-semibold text-orange-950 flex items-center gap-2 mb-4">
      <Sparkles className="w-5 h-5 text-orange-600" /> AI Persona
    </h3>
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-sm italic min-h-[100px] mb-6 flex items-center justify-center text-center">
      {aiAnalysis ? `"${aiAnalysis}"` : "Generate a bio based on your style."}
    </div>
    <button
      onClick={onGenerate}
      disabled={isAnalyzing || !hasVideos}
      className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
    >
      {isAnalyzing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wand2 className="w-4 h-4" />
      )}
      Generate Identity
    </button>
  </div>
);
