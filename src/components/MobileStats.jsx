import React from 'react'
import { BookOpen, CheckSquare, Clock } from 'lucide-react'

const MobileStats = () => {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar font-inter">
      {/* Active Subjects Card */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient min-w-[130px] flex-1 flex flex-col items-start justify-between">
        <div className="w-8 h-8 bg-[#eeefff] text-primary-container flex items-center justify-center rounded-sm">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="mt-4">
          <span className="text-display font-semibold text-on-surface leading-none">6</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#737686] block mt-1">Active Subjects</span>
        </div>
      </div>

      {/* Pending Tasks Card */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient min-w-[130px] flex-1 flex flex-col items-start justify-between">
        <div className="w-8 h-8 bg-surface-container text-secondary flex items-center justify-center rounded-sm">
          <CheckSquare className="w-4 h-4" />
        </div>
        <div className="mt-4">
          <span className="text-display font-semibold text-on-surface leading-none">12</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#737686] block mt-1">Pending Tasks</span>
        </div>
      </div>

      {/* Upcoming Exams Card */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient min-w-[130px] flex-1 flex flex-col items-start justify-between">
        <div className="w-8 h-8 bg-[#ffede6] text-[#943700] flex items-center justify-center rounded-sm">
          <Clock className="w-4 h-4" />
        </div>
        <div className="mt-4">
          <span className="text-display font-semibold text-on-surface leading-none">2</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#737686] block mt-1">Upcoming Exams</span>
        </div>
      </div>
    </div>
  )
}

export default MobileStats
