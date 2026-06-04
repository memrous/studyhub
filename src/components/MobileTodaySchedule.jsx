import React from 'react'

const MobileTodaySchedule = () => {
  return (
    <section className="flex flex-col gap-3 font-inter">
      <div className="flex justify-between items-center">
        <h3 className="text-headline-md text-on-surface">Today's Schedule</h3>
        <span className="text-label-sm text-[#004ac6] font-bold">Wed, Oct 25</span>
      </div>

      <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex flex-col gap-4">
        
        {/* Timeline Item 1 */}
        <div className="flex items-start gap-4 relative pl-3">
          {/* Custom Vertical timeline line */}
          <div className="absolute left-0 top-1.5 w-1 h-14 bg-[#2563eb] rounded-full"></div>
          <span className="text-label-sm font-semibold text-on-surface shrink-0 w-16 pt-0.5">09:00 AM</span>
          <div className="flex-1">
            <h4 className="text-label-md text-on-surface font-bold leading-tight">Linear Algebra</h4>
            <span className="text-label-sm text-[#737686] mt-0.5 block">Room 402B • Prof. Steiner</span>
          </div>
        </div>

        {/* Timeline Item 2 */}
        <div className="flex items-start gap-4 relative pl-3">
          <div className="absolute left-0 top-1.5 w-1 h-14 bg-[#2563eb] rounded-full"></div>
          <span className="text-label-sm font-semibold text-on-surface shrink-0 w-16 pt-0.5">11:30 AM</span>
          <div className="flex-1">
            <h4 className="text-label-md text-on-surface font-bold leading-tight">Digital Logic Lab</h4>
            <span className="text-label-sm text-[#737686] mt-0.5 block">Engineering Lab 1</span>
          </div>
        </div>

        {/* Timeline Item 3 */}
        <div className="flex items-start gap-4 relative pl-3">
          <div className="absolute left-0 top-1.5 w-1 h-10 bg-[#bc4800] rounded-full"></div>
          <span className="text-label-sm font-semibold text-on-surface shrink-0 w-16 pt-0.5">02:30 PM</span>
          <div className="flex-1">
            <h4 className="text-label-md text-on-surface font-bold leading-tight">Data Structures</h4>
            <span className="text-label-sm text-[#737686] mt-0.5 block">Main Hall</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default MobileTodaySchedule
