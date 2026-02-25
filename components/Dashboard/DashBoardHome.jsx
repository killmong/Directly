import { AnalyticsCard, AIPersonaCard } from "./AnalyticsCard";
import { VideoUploadForm } from "./VideoUploadForm";
import { QuickVideoList } from "./QuickVideoList";

export const DashboardHome = ({
  videos,
  stats,
  ai,
  uploadHandlers,
  formatNumber,
}) => {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-8 animate-in fade-in">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Creator Dashboard</h2>
        <p className="text-stone-500">Manage your cinematic portfolio.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsCard
          totalViews={stats.totalViews}
          topVideos={stats.topVideos}
          formatNumber={formatNumber}
        />
        <AIPersonaCard
          aiAnalysis={ai.analysis}
          onGenerate={ai.onGenerate}
          isAnalyzing={ai.isAnalyzing}
          hasVideos={videos.length > 0}
        />
      </div>

      <VideoUploadForm {...uploadHandlers} />

      <QuickVideoList
        videos={videos}
        onDelete={uploadHandlers.onDelete}
        formatNumber={formatNumber}
      />
    </div>
  );
};
