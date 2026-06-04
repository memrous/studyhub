import React from 'react'
import { Menu, Bell } from 'lucide-react'

const MobileHeader = ({ onMenuClick }) => {
  return (
    <header className="h-14 px-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 z-40 shadow-sm font-inter">
      <div className="flex items-center gap-3">
        {/* Hamburger menu trigger */}
        <button 
          onClick={onMenuClick} 
          className="p-1 text-on-surface-variant hover:text-on-surface focus:outline-none cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-geist font-bold text-lg text-on-surface tracking-tight">StudyHub</span>
      </div>
      <button className="p-1 text-on-surface-variant hover:text-on-surface relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
      </button>
    </header>
  )
}

export default MobileHeader
