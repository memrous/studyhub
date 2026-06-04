import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Timetable = () => {
  return (
    <section className="flex flex-col gap-4 font-inter">
      <div className="flex justify-between items-center">
        <h2 className="text-headline-md text-on-surface">Weekly Timetable</h2>
        {/* Nav Controls */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 border border-[#E2E8F0] rounded-sm hover:bg-surface-container transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 border border-[#E2E8F0] rounded-sm hover:bg-surface-container transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timetable Grid (4 Columns for days) */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-ambient grid grid-cols-4 gap-4">
        
        {/* Monday */}
        <div className="flex flex-col gap-3">
          <span className="text-label-sm text-[#737686] uppercase tracking-wider text-center block">Mon</span>
          <div className="bg-surface-container-low rounded-md h-12 border border-[#E2E8F0]/40"></div>
          <div className="bg-surface-container-low rounded-md h-12 border border-[#E2E8F0]/40"></div>
        </div>

        {/* Tuesday (Active Day) */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <span className="text-label-sm bg-[#004ac6] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold text-center">Tue</span>
          </div>
          {/* DS Class */}
          <div className="bg-[#eeefff] border-l-4 border-[#2563eb] px-3 py-2.5 rounded-r-md flex flex-col justify-center min-h-[48px]">
            <span className="text-label-sm text-[#00174b] font-bold">DS 10:00</span>
          </div>
          {/* PH Class */}
          <div className="bg-[#ffdbcd] border-l-4 border-[#bc4800] px-3 py-2.5 rounded-r-md flex flex-col justify-center min-h-[48px]">
            <span className="text-label-sm text-[#360f00] font-bold">PH 14:00</span>
          </div>
        </div>

        {/* Wednesday */}
        <div className="flex flex-col gap-3">
          <span className="text-label-sm text-[#737686] uppercase tracking-wider text-center block">Wed</span>
          {/* HIS Class */}
          <div className="bg-[#eceef0]/60 border-l-4 border-[#737686] px-3 py-2.5 rounded-r-md flex flex-col justify-center min-h-[48px]">
            <span className="text-label-sm text-on-surface-variant font-bold">HIS 09:00</span>
          </div>
          <div className="bg-surface-container-low rounded-md h-12 border border-[#E2E8F0]/40"></div>
        </div>

        {/* Thursday */}
        <div className="flex flex-col gap-3">
          <span className="text-label-sm text-[#737686] uppercase tracking-wider text-center block">Thu</span>
          <div className="bg-surface-container-low rounded-md h-12 border border-[#E2E8F0]/40"></div>
          <div className="bg-surface-container-low rounded-md h-12 border border-[#E2E8F0]/40"></div>
        </div>

      </div>
    </section>
  )
}

export default Timetable
