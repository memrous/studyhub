import React from 'react'
import { Folder, FileText, ExternalLink, Plus } from 'lucide-react'

const RecentMaterials = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient flex flex-col gap-4 relative font-inter">
      <div className="flex items-center gap-2">
        <Folder className="w-5 h-5 text-on-surface" />
        <h2 className="text-headline-md text-on-surface">Recent Materials</h2>
      </div>

      <div className="flex flex-col gap-3">
        
        {/* Material 1 (PDF) */}
        <div className="flex items-center gap-3 p-3 bg-surface rounded-md border border-[#E2E8F0] hover:bg-surface-container transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-red-50 text-red-600 flex items-center justify-center rounded-md shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-label-md text-on-surface font-semibold truncate">Lecture Notes - Week 6</h4>
            <span className="text-label-sm text-[#737686]">2.4 MB • PDF</span>
          </div>
        </div>

        {/* Material 2 (PDF) */}
        <div className="flex items-center gap-3 p-3 bg-surface rounded-md border border-[#E2E8F0] hover:bg-surface-container transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-blue-50 text-blue-600 flex items-center justify-center rounded-md shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-label-md text-on-surface font-semibold truncate">Quantum Mechanics II</h4>
            <span className="text-label-sm text-[#737686]">5.1 MB • PDF</span>
          </div>
        </div>

        {/* Material 3 (External link) */}
        <div className="flex items-center gap-3 p-3 bg-surface rounded-md border border-[#E2E8F0] hover:bg-surface-container transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-md shrink-0">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-label-md text-on-surface font-semibold truncate">Econ Reference Site</h4>
            <span className="text-label-sm text-[#737686]">URL • External</span>
          </div>
        </div>

      </div>

      {/* FAB Button overlapping bottom-right corner */}
      <button className="absolute -bottom-6 -right-2 w-12 h-12 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-full flex items-center justify-center shadow-lg transition-colors focus:outline-none cursor-pointer">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}

export default RecentMaterials
