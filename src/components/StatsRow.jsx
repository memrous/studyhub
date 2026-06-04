import React from 'react'
import { BookOpen, CheckSquare, Clock } from 'lucide-react'

const StatsRow = () => {
  return (
    <div className="grid grid-cols-3 gap-6 font-inter">
      {/* Stat Card 1 */}
      <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient flex items-center gap-4">
        <div className="w-12 h-12 bg-[#eeefff] text-primary-container flex items-center justify-center rounded-md shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-label-sm text-[#737686] uppercase tracking-wider">Active Subjects</span>
          <span className="text-display text-on-surface leading-none mt-1">6</span>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient flex items-center gap-4">
        <div className="w-12 h-12 bg-surface-container text-secondary flex items-center justify-center rounded-md shrink-0">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-label-sm text-[#737686] uppercase tracking-wider">Pending Tasks</span>
          <span className="text-display text-on-surface leading-none mt-1">12</span>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient flex items-center gap-4">
        <div className="w-12 h-12 bg-[#ffede6] text-tertiary flex items-center justify-center rounded-md shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-label-sm text-[#737686] uppercase tracking-wider">Upcoming Exams</span>
          <span className="text-display text-on-surface leading-none mt-1">2</span>
        </div>
      </div>
    </div>
  )
}

export default StatsRow
