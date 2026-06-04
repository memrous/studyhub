import React from 'react'
import { Share2, Orbit, Landmark, TrendingUp, FileText, Star } from 'lucide-react'

const SubjectCard = ({ code, title, nextClass, icon, color, footerType, footerVal }) => {
  // Map icons
  const renderIcon = () => {
    const className = "w-5 h-5"
    switch (icon) {
      case 'share': return <Share2 className={className} />
      case 'orbit': return <Orbit className={className} />
      case 'landmark': return <Landmark className={className} />
      case 'trending-up': return <TrendingUp className={className} />
      default: return <Share2 className={className} />
    }
  }

  // Map color schemes
  const getColors = () => {
    switch (color) {
      case 'blue': return {
        bg: 'bg-[#eeefff]',
        text: 'text-[#004ac6]',
        border: 'border-blue-100'
      }
      case 'orange': return {
        bg: 'bg-[#ffede6]',
        text: 'text-[#bc4800]',
        border: 'border-orange-100'
      }
      case 'purple': return {
        bg: 'bg-[#f3e8ff]',
        text: 'text-purple-700',
        border: 'border-purple-100'
      }
      case 'green': return {
        bg: 'bg-[#e6f4ea]',
        text: 'text-emerald-700',
        border: 'border-emerald-100'
      }
      default: return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200'
      }
    }
  }

  const styles = getColors()

  return (
    <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient hover:shadow-md transition-shadow flex flex-col justify-between h-48 font-inter">
      <div>
        <div className="flex justify-between items-start">
          <div className={`w-10 h-10 ${styles.bg} ${styles.text} flex items-center justify-center rounded-md`}>
            {renderIcon()}
          </div>
          <span className={`text-label-sm font-semibold ${styles.bg} ${styles.text} px-2 py-0.5 rounded-sm`}>
            {code}
          </span>
        </div>
        <h3 className="text-headline-md text-on-surface mt-3">{title}</h3>
        <p className="text-body-md text-[#737686] mt-1">{nextClass}</p>
      </div>

      {/* Footer contents based on footerType */}
      <div className="mt-3">
        {footerType === 'avatars' && (
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-slate-700">A</div>
              <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-slate-800">B</div>
            </div>
            <span className="text-label-sm text-[#737686] font-medium">+{footerVal || '12'}</span>
          </div>
        )}

        {footerType === 'progress' && (
          <div className="w-full">
            <div className={`w-full ${styles.bg} rounded-full h-1.5`}>
              <div className="bg-[#bc4800] h-full rounded-full" style={{ width: `${footerVal || 40}%` }}></div>
            </div>
          </div>
        )}

        {footerType === 'readings' && (
          <div className={`flex items-center gap-1.5 text-label-sm ${styles.text} ${styles.bg}/50 px-2.5 py-1 rounded-sm w-fit`}>
            <FileText className="w-3.5 h-3.5" />
            <span>{footerVal || '8'} Readings Pending</span>
          </div>
        )}

        {footerType === 'grade' && (
          <div className={`flex items-center gap-1 text-label-sm ${styles.text} ${styles.bg} px-2 py-0.5 rounded-sm w-fit font-semibold`}>
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Grade: {footerVal || 'A'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubjectCard
