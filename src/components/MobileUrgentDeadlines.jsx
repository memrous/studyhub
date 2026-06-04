import React from 'react'
import { AlertCircle, Clock } from 'lucide-react'

const MobileUrgentDeadlines = () => {
  return (
    <section className="flex flex-col gap-3 font-inter">
      <h3 className="text-headline-md text-on-surface">Urgent Deadlines</h3>
      
      <div className="flex flex-col gap-3">
        
        {/* Deadline Item 1 (With Submit Button) */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center rounded-sm shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-label-md text-on-surface font-semibold">Lab Report - CS 202</h4>
              <span className="text-label-sm text-error font-semibold block mt-0.5">Due in 4 hours</span>
            </div>
          </div>
          <button className="bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-sm transition-colors shrink-0 cursor-pointer">
            Submit
          </button>
        </div>

        {/* Deadline Item 2 (No button) */}
        <div className="bg-[#eceef0]/50 border border-[#E2E8F0] p-4 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-container-high text-on-surface-variant flex items-center justify-center rounded-sm shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-label-md text-on-surface font-semibold">Math Problem Set 4</h4>
            <span className="text-label-sm text-[#737686] block mt-0.5">Due Tomorrow, 11:59 PM</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default MobileUrgentDeadlines
