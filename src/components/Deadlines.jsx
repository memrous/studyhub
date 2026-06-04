import React from 'react'
import { Bell } from 'lucide-react'

const Deadlines = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient flex flex-col gap-4 font-inter">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-on-surface" />
        <h2 className="text-headline-md text-on-surface">Deadlines</h2>
      </div>

      <div className="flex flex-col gap-4">
        
        {/* Deadline 1 */}
        <div className="flex gap-3 items-start relative pl-4">
          {/* Custom vertical line marker */}
          <div className="absolute left-[4px] top-[7px] w-2 h-2 rounded-full bg-error"></div>
          <div className="absolute left-[7px] top-[15px] bottom-[-20px] w-[1px] bg-slate-200"></div>
          <div className="flex-1 flex flex-col gap-1">
            <h4 className="text-label-md text-on-surface font-semibold leading-tight">Lab Report - CS 202</h4>
            <span className="text-label-sm text-[#737686]">Friday, 11:59 PM</span>
            <span className="text-[10px] font-bold tracking-wider bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-sm w-fit mt-1 uppercase">Critical</span>
          </div>
        </div>

        {/* Deadline 2 */}
        <div className="flex gap-3 items-start relative pl-4 mt-2">
          <div className="absolute left-[4px] top-[7px] w-2 h-2 rounded-full bg-[#004ac6]"></div>
          <div className="absolute left-[7px] top-[15px] bottom-[-20px] w-[1px] bg-slate-200"></div>
          <div className="flex-1 flex flex-col gap-1">
            <h4 className="text-label-md text-on-surface font-semibold leading-tight">Midterm Exam - PHY 305</h4>
            <span className="text-label-sm text-[#737686]">Next Monday, 2:00 PM</span>
            <span className="text-[10px] font-bold tracking-wider bg-[#eeefff] text-[#004ac6] px-2 py-0.5 rounded-sm w-fit mt-1 uppercase">Exam</span>
          </div>
        </div>

        {/* Deadline 3 */}
        <div className="flex gap-3 items-start relative pl-4 mt-2">
          <div className="absolute left-[4px] top-[7px] w-2 h-2 rounded-full bg-[#737686]"></div>
          <div className="flex-1 flex flex-col gap-1">
            <h4 className="text-label-md text-on-surface font-semibold leading-tight">Economics Essay Rough Draft</h4>
            <span className="text-label-sm text-[#737686]">Oct 24, 5:00 PM</span>
          </div>
        </div>

      </div>

      <div className="border-t border-[#E2E8F0] my-1"></div>
      
      <button className="w-full bg-white hover:bg-surface border border-[#E2E8F0] py-2.5 rounded text-label-md font-semibold text-on-surface transition-colors flex items-center justify-center gap-2 cursor-pointer">
        Add Task
      </button>
    </div>
  )
}

export default Deadlines
