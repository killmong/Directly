import { Youtube, Sparkles, Loader2, Plus } from "lucide-react";

export const VideoUploadForm = ({
  formData,
  setFormData,
  onEnhance,
  onSave,
  isAdding,
  isEnhancing,
}) => (
  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200">
    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
      <Youtube className="w-6 h-6 text-red-500" /> Upload to Portfolio
    </h3>
    <form onSubmit={onSave} className="space-y-6">
      <input
        type="url"
        placeholder="YouTube URL"
        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold">Title</label>
            <button
              type="button"
              onClick={onEnhance}
              className="text-xs text-orange-600 flex items-center gap-1"
            >
              {isEnhancing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              AI Enhance
            </button>
          </div>
          <input
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option>Cinematic</option>
            <option>Vlog</option>
            <option>Tech/Dev</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={isAdding}
        className="w-full md:w-auto px-8 py-3 bg-stone-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 ml-auto"
      >
        {isAdding ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
        Save Project
      </button>
    </form>
  </div>
);
