import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, BookOpen } from 'lucide-react'

// Desktop Components
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsRow from './components/StatsRow'
import SubjectCard from './components/SubjectCard'
import Timetable from './components/Timetable'
import Deadlines from './components/Deadlines'
import RecentMaterials from './components/RecentMaterials'

// Mobile Components
import MobileHeader from './components/MobileHeader'
import MobileStats from './components/MobileStats'
import MobileUrgentDeadlines from './components/MobileUrgentDeadlines'
import MobileTodaySchedule from './components/MobileTodaySchedule'
import MobileRecentMaterials from './components/MobileRecentMaterials'
import MobileBottomNav from './components/MobileBottomNav'
import MobileSidebarDrawer from './components/MobileSidebarDrawer'

import CalendarView from './components/CalendarView'
import SubjectsView from './components/SubjectsView'
import ResourcesView from './components/ResourcesView'
import SubjectDetailView from './components/SubjectDetailView'
import Profile from './components/Profile'

import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_EVENTS,
  INITIAL_RESOURCES,
  getRelativeDate
} from './data/mockData'

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard'
    return window.localStorage.getItem('studyhub-activeTab') || 'dashboard'
  })
  
  // Unified client-side database states
  const [user] = useState(INITIAL_USER)
  const [subjects, setSubjects] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_SUBJECTS
    try {
      const saved = window.localStorage.getItem('studyhub-subjects')
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS
    } catch {
      return INITIAL_SUBJECTS
    }
  })
  const [events, setEvents] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_EVENTS
    try {
      const saved = window.localStorage.getItem('studyhub-events')
      return saved ? JSON.parse(saved) : INITIAL_EVENTS
    } catch {
      return INITIAL_EVENTS
    }
  })
  const [resources, setResources] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_RESOURCES
    try {
      const saved = window.localStorage.getItem('studyhub-resources')
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES
    } catch {
      return INITIAL_RESOURCES
    }
  })

  const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
    if (typeof window === 'undefined') return null
    const id = window.localStorage.getItem('studyhub-selectedSubjectId')
    return id ? Number(id) : null
  })

  // Synchronize localStorage
  useEffect(() => {
    window.localStorage.setItem('studyhub-activeTab', activeTab)
  }, [activeTab])

  useEffect(() => {
    window.localStorage.setItem('studyhub-subjects', JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    window.localStorage.setItem('studyhub-events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    window.localStorage.setItem('studyhub-resources', JSON.stringify(resources))
  }, [resources])

  useEffect(() => {
    if (selectedSubjectId !== null) {
      window.localStorage.setItem('studyhub-selectedSubjectId', String(selectedSubjectId))
    } else {
      window.localStorage.removeItem('studyhub-selectedSubjectId')
    }
  }, [selectedSubjectId])


  // Resolve current active subject object
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || null
  const [calendarOpenEventId, setCalendarOpenEventId] = useState(null)

  // CRUD actions passed to subviews
  const handleAddSubject = (newSubject) => {
    setSubjects(prev => [...prev, newSubject])
  }

  const handleCreateEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent])
  }

  const handleEditEvent = (updatedEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e))
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }

  const handleUploadResource = (newResource) => {
    setResources(prev => [...prev, newResource])
  }

  const handleUpdateEventStatus = (eventId, status) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e))
  }

  const handleOpenCalendarEvent = (eventId) => {
    setActiveTab('calendar')
    setCalendarOpenEventId(eventId)
  }

  const clearCalendarOpenEvent = () => {
    setCalendarOpenEventId(null)
  }

  // Calculate statistics for greetings
  const todayStr = getRelativeDate(0)
  const todayDeadlinesCount = events.filter(e => e.date === todayStr && e.type !== 'Lecture').length

  return (
    <div className="min-h-screen bg-background text-on-background font-inter">
      
      {/* ========================================== */}
      {/* DESKTOP LAYOUT                            */}
      {/* ========================================== */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header setActiveTab={setActiveTab} />
          
          <main className="flex-1 overflow-y-auto bg-white p-8">
            <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-6">
              
              {activeTab === 'dashboard' ? (
                <>
                  {/* Greetings */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-display text-on-surface">Good morning, {user.name}!</h1>
                    <div className="flex items-center gap-2 text-body-md text-on-surface-variant font-medium">
                      <div className="w-5 h-5 bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center rounded-sm">
                        <CalendarIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        You have <strong className="text-on-surface font-semibold">{todayDeadlinesCount} deadlines</strong> today. Time to dive in!
                      </span>
                    </div>
                  </div>

                  {/* Stats Overview */}
                  <StatsRow subjects={subjects} events={events} />

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-3 gap-6 items-start">
                    
                    {/* Left Columns (Subjects & Timetable) */}
                    <div className="col-span-2 flex flex-col gap-6">
                      
                      {/* Subjects Section */}
                      <section className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-headline-md text-on-surface font-semibold">My Enrolled Subjects</h2>
                          <button 
                            onClick={() => setActiveTab('subjects')} 
                            className="text-label-md text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                          >
                            View All
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {subjects.slice(0, 4).map(sub => (
                            <SubjectCard 
                              key={sub.id}
                              subject={sub}
                              onSelect={(s) => {
                                setSelectedSubjectId(s.id);
                                setActiveTab('subject-detail');
                              }}
                            />
                          ))}
                        </div>
                      </section>

                      {/* Timetable Section */}
                      <Timetable events={events} subjects={subjects} />
                    </div>

                    {/* Right Column (Deadlines & Recent Materials) */}
                    <div className="col-span-1 flex flex-col gap-6">
                      <Deadlines events={events} subjects={subjects} onDeadlineClick={handleOpenCalendarEvent} />
                      <RecentMaterials resources={resources} subjects={subjects} />
                    </div>

                  </div>
                </>
              ) : activeTab === 'calendar' ? (
                <CalendarView 
                  events={events} 
                  subjects={subjects} 
                  onCreateEvent={handleCreateEvent}
                  onEditEvent={handleEditEvent}
                  onDeleteEvent={handleDeleteEvent}
                  onOpenSubject={(subjectId) => { setSelectedSubjectId(subjectId); setActiveTab('subject-detail') }}
                  openEventId={calendarOpenEventId}
                  onCloseOpenEvent={clearCalendarOpenEvent}
                />
              ) : activeTab === 'subjects' ? (
                <SubjectsView 
                  subjects={subjects} 
                  onSelectSubject={(sub) => { setSelectedSubjectId(sub.id); setActiveTab('subject-detail') }} 
                  onAddSubject={handleAddSubject}
                />
              ) : activeTab === 'subject-detail' ? (
                <SubjectDetailView 
                  subject={selectedSubject} 
                  events={events}
                  resources={resources}
                  onBack={() => setActiveTab('subjects')} 
                  onUpdateEventStatus={handleUpdateEventStatus}
                  onCreateEvent={handleCreateEvent}
                  onUploadResource={handleUploadResource}
                />
              ) : activeTab === 'profile' ? (
                <Profile user={user} />
              ) : activeTab === 'resources' ? (
                <ResourcesView 
                  resources={resources} 
                  subjects={subjects} 
                  onUploadResource={handleUploadResource}
                />
              ) : (
                <div className="py-20 text-center text-on-surface-variant font-medium">
                  This section is under construction.
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE LAYOUT                             */}
      {/* ========================================== */}
      <div className="block lg:hidden min-h-screen bg-background pb-20 relative">
        <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />
        
        <main className="p-4 flex flex-col gap-6">
          {activeTab === 'dashboard' ? (
            <>
              {/* Greeting Header */}
              <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient">
                <div className="flex-1 min-w-0 pr-3">
                  <h2 className="text-headline-lg-mobile text-on-surface font-semibold">Good morning, {user.name}!</h2>
                  <p className="text-body-md text-on-surface-variant mt-1.5 leading-snug">
                    You have {todayDeadlinesCount} deadlines approaching today.
                  </p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E2E8F0]" 
                />
              </div>

              {/* Stats Cards Swipe Row */}
              <MobileStats subjects={subjects} events={events} />

              {/* Mobile Subjects List */}
              <section className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-headline-md text-on-surface font-semibold">My Subjects</h3>
                  <button 
                    onClick={() => setActiveTab('subjects')} 
                    className="text-label-md text-primary font-semibold bg-transparent border-0 cursor-pointer"
                  >
                    View all
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {subjects.slice(0, 2).map(sub => (
                    <div 
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubjectId(sub.id);
                        setActiveTab('subject-detail');
                      }}
                      className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#eeefff] text-[#004ac6] flex items-center justify-center rounded-md shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-label-md text-on-surface font-semibold">{sub.name}</h4>
                          <span className="text-label-sm text-[#737686] block mt-0.5">Lecturer: {sub.lecturer}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold bg-[#eeefff] text-[#004ac6] px-2 py-0.5 rounded-sm shrink-0 font-geist">
                        {sub.code}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mobile Urgent Deadlines */}
              <MobileUrgentDeadlines events={events} subjects={subjects} onDeadlineClick={handleOpenCalendarEvent} />

              {/* Mobile Today's Schedule */}
              <MobileTodaySchedule events={events} subjects={subjects} />

              {/* Mobile Recent Materials */}
              <MobileRecentMaterials resources={resources} subjects={subjects} />
            </>
          ) : activeTab === 'calendar' ? (
            <CalendarView 
              events={events} 
              subjects={subjects} 
              onCreateEvent={handleCreateEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onOpenSubject={(subjectId) => { setSelectedSubjectId(subjectId); setActiveTab('subject-detail') }}
            />
          ) : activeTab === 'subjects' ? (
            <SubjectsView 
              subjects={subjects} 
              onSelectSubject={(sub) => { setSelectedSubjectId(sub.id); setActiveTab('subject-detail') }} 
              onAddSubject={handleAddSubject}
            />
          ) : activeTab === 'subject-detail' ? (
            <SubjectDetailView 
              subject={selectedSubject} 
              events={events}
              resources={resources}
              onBack={() => setActiveTab('subjects')} 
              onUpdateEventStatus={handleUpdateEventStatus}
              onCreateEvent={handleCreateEvent}
              onUploadResource={handleUploadResource}
            />
          ) : activeTab === 'profile' ? (
            <Profile user={user} />
          ) : activeTab === 'resources' ? (
            <ResourcesView 
              resources={resources} 
              subjects={subjects} 
              onUploadResource={handleUploadResource}
            />
          ) : (
            <div className="py-20 text-center text-on-surface-variant font-medium bg-white rounded-lg border border-[#E2E8F0]">
              This section is under construction.
            </div>
          )}
        </main>

        {/* Mobile Sticky Tab Footer */}
        <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Mobile Sidebar Navigation Drawer */}
        <MobileSidebarDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
        />
      </div>

    </div>
  )
}

export default App