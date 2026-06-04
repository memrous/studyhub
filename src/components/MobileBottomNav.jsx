import { LayoutGrid, BookOpen, Calendar, Library } from 'lucide-react'

const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const getTabClass = (tabId) => {
    return `flex flex-col items-center gap-1 transition-colors cursor-pointer ${
      activeTab === tabId ? 'text-primary' : 'text-[#737686] hover:text-on-surface'
    }`
  }

  const getIconContainerClass = (tabId) => {
    return activeTab === tabId 
      ? 'bg-[#dbe1ff] text-[#004ac6] px-4 py-1 rounded-full flex items-center justify-center'
      : 'px-4 py-1 flex items-center justify-center'
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E2E8F0] flex justify-around items-center px-2 z-40 shadow-[0_-2px_10px_0_rgba(0,0,0,0.04)] font-inter">
      
      {/* Tab 1: Dashboard */}
      <a onClick={() => setActiveTab('dashboard')} className={getTabClass('dashboard')}>
        <div className={getIconContainerClass('dashboard')}>
          <LayoutGrid className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Dashboard</span>
      </a>

      {/* Tab 2: Subjects */}
      <a onClick={() => setActiveTab('subjects')} className={getTabClass('subjects')}>
        <div className={getIconContainerClass('subjects')}>
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Subjects</span>
      </a>

      {/* Tab 3: Calendar */}
      <a onClick={() => setActiveTab('calendar')} className={getTabClass('calendar')}>
        <div className={getIconContainerClass('calendar')}>
          <Calendar className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Calendar</span>
      </a>

      {/* Tab 4: Resources */}
      <a onClick={() => setActiveTab('resources')} className={getTabClass('resources')}>
        <div className={getIconContainerClass('resources')}>
          <Library className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Resources</span>
      </a>

    </nav>
  )
}

export default MobileBottomNav
