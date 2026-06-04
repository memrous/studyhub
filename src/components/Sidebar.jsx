import { LayoutGrid, BookOpen, Calendar, User, GraduationCap, Library } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab, user }) => {
  // Helper to determine item class
  const getItemClass = (tabId) => {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-md text-label-md transition-all cursor-pointer"
    if (activeTab === tabId) {
      return `${base} bg-[#dbe1ff] text-on-primary-fixed-variant font-semibold`
    }
    return `${base} text-on-surface-variant hover:bg-surface-container hover:text-on-surface`
  }

  const getIconColor = (tabId) => {
    return activeTab === tabId ? "text-primary" : "text-on-surface-variant"
  }

  return (
    <aside className="w-[260px] bg-surface border-r border-[#E2E8F0] flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen font-inter">
      <div className="flex flex-col gap-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-container text-white flex items-center justify-center rounded-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-geist font-bold text-xl tracking-tight text-on-surface">StudyHub</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <a onClick={() => setActiveTab('dashboard')} className={getItemClass('dashboard')}>
            <LayoutGrid className={`w-4 h-4 ${getIconColor('dashboard')}`} />
            Dashboard
          </a>
          <a onClick={() => setActiveTab('subjects')} className={getItemClass('subjects')}>
            <BookOpen className={`w-4 h-4 ${getIconColor('subjects')}`} />
            Subjects
          </a>
          <a onClick={() => setActiveTab('calendar')} className={getItemClass('calendar')}>
            <Calendar className={`w-4 h-4 ${getIconColor('calendar')}`} />
            Calendar
          </a>
          <a onClick={() => setActiveTab('resources')} className={getItemClass('resources')}>
            <Library className={`w-4 h-4 ${getIconColor('resources')}`} />
            Resources
          </a>
        </nav>
      </div>

      {/* Profile Section at bottom */}
      <div className="flex flex-col gap-4">
        <div className="border-t border-[#E2E8F0]"></div>
        <a onClick={() => setActiveTab('profile')} className={getItemClass('profile')}>
          <User className={`w-4 h-4 ${getIconColor('profile')}`} />
          Profile
        </a>
        {/* Profile Card */}
        <div className="bg-[#F2F4F6] border border-[#E2E8F0] p-4 rounded-lg flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-label-md text-on-surface font-semibold truncate leading-tight">{user.name}</span>
              <span className="text-label-sm text-on-surface-variant truncate leading-none mt-0.5">{user.program}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-label-sm font-semibold pt-1 border-t border-slate-200">
            <span className="text-slate-500">STAG Account</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm">Connected</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
