import React from 'react'
import { FileText, ExternalLink, Download } from 'lucide-react'

const MobileRecentMaterials = () => {
  return (
    <section className="flex flex-col gap-3 font-inter">
      <h3 className="text-headline-md text-on-surface">Recent Materials</h3>
      
      <div className="flex flex-col gap-3">
        
        {/* Material Item 1 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-md shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-label-md text-on-surface font-semibold truncate max-w-[190px]">Lecture_Slides_Week_7.pdf</h4>
              <span className="text-label-sm text-[#737686] block mt-0.5">Quantum Physics • Accessed 2h ago</span>
            </div>
          </div>
          <button className="p-2 border border-[#E2E8F0] hover:bg-surface-container rounded-sm text-[#737686] hover:text-on-surface shrink-0 transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Material Item 2 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffede6] text-tertiary flex items-center justify-center rounded-md shrink-0">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-label-md text-on-surface font-semibold truncate max-w-[190px]">Research_Resources_Repo</h4>
              <span className="text-label-sm text-[#737686] block mt-0.5">CS 301 • Accessed Yesterday</span>
            </div>
          </div>
          <button className="p-2 border border-[#E2E8F0] hover:bg-surface-container rounded-sm text-[#737686] hover:text-on-surface shrink-0 transition-colors cursor-pointer">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  )
}

export default MobileRecentMaterials
