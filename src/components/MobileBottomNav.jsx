import { NavLink } from 'react-router-dom'
import { LayoutGrid, BookOpen, Calendar, Library } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/subjects',  icon: BookOpen,   label: 'Subjects'  },
  { to: '/calendar',  icon: Calendar,   label: 'Calendar'  },
  { to: '/materials', icon: Library,    label: 'Resources' },
]

const MobileBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E2E8F0] flex justify-around items-center px-2 z-40 shadow-[0_-2px_10px_0_rgba(0,0,0,0.04)] font-inter">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to}>
          {({ isActive }) => (
            <div className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              isActive ? 'text-primary' : 'text-[#737686] hover:text-on-surface'
            }`}>
              <div className={
                isActive
                  ? 'bg-[#dbe1ff] text-[#004ac6] px-4 py-1 rounded-full flex items-center justify-center'
                  : 'px-4 py-1 flex items-center justify-center'
              }>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold tracking-tight">{label}</span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileBottomNav
