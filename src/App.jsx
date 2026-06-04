import React, { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Share2, Orbit } from 'lucide-react'

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

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'calendar'
    return window.localStorage.getItem('studyhub-activeTab') || 'calendar'
  })
  const [selectedSubject, setSelectedSubject] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(window.localStorage.getItem('studyhub-selectedSubject') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    window.localStorage.setItem('studyhub-activeTab', activeTab)
    if (selectedSubject) {
      window.localStorage.setItem('studyhub-selectedSubject', JSON.stringify(selectedSubject))
    } else {
      window.localStorage.removeItem('studyhub-selectedSubject')
    }
  }, [activeTab, selectedSubject])

  useEffect(() => {
    if (activeTab === 'subject-detail' && !selectedSubject) {
      setActiveTab('subjects')
    }
  }, [activeTab, selectedSubject])

  return (
    <div className="min-h-screen bg-background text-on-background font-inter">
      
      {/* ========================================== */}
      {/* DESKTOP LAYOUT                            */}
      {/* ========================================== */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          
          <main className="flex-1 overflow-y-auto bg-white p-8">
            <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-6">
              
              {activeTab === 'dashboard' ? (
                <>
                  {/* Greetings */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-display text-on-surface">Good morning, Alex!</h1>
                    <div className="flex items-center gap-2 text-body-md text-on-surface-variant font-medium">
                      <div className="w-5 h-5 bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center rounded-sm">
                        <CalendarIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>You have <strong className="text-on-surface font-semibold">3 deadlines</strong> today. Time to dive in!</span>
                    </div>
                  </div>

                  {/* Stats Overview */}
                  <StatsRow />

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-3 gap-6 items-start">
                    
                    {/* Left Columns (Subjects & Timetable) */}
                    <div className="col-span-2 flex flex-col gap-6">
                      
                      {/* Subjects Section */}
                      <section className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-headline-md text-on-surface font-semibold">My Subjects</h2>
                          <a href="#" className="text-label-md text-primary hover:underline font-semibold">View All</a>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <SubjectCard 
                            code="CS 202"
                            title="Data Structures"
                            nextClass="Next class: Tomorrow, 10:00 AM"
                            icon="share"
                            color="blue"
                            footerType="avatars"
                            footerVal="12"
                          />
                          <SubjectCard 
                            code="PHY 305"
                            title="Quantum Physics"
                            nextClass="Next Class: Monday, 2:00 PM"
                            icon="orbit"
                            color="orange"
                            footerType="progress"
                            footerVal="40"
                          />
                          <SubjectCard 
                            code="HIS 110"
                            title="Modern History"
                            nextClass="Next Class: Wednesday, 9:00 AM"
                            icon="landmark"
                            color="purple"
                            footerType="readings"
                            footerVal="8"
                          />
                          <SubjectCard 
                            code="ECO 101"
                            title="Economics 101"
                            nextClass="Next Class: Friday, 11:30 AM"
                            icon="trending-up"
                            color="green"
                            footerType="grade"
                            footerVal="A"
                          />
                        </div>
                      </section>

                      {/* Timetable Section */}
                      <Timetable />
                    </div>

                    {/* Right Column (Deadlines & Recent Materials) */}
                    <div className="col-span-1 flex flex-col gap-6">
                      <Deadlines />
                      <RecentMaterials />
                    </div>

                  </div>
                </>
              ) : activeTab === 'calendar' ? (
                <CalendarView />
              ) : activeTab === 'subjects' ? (
                <SubjectsView onSelectSubject={(subject) => { setSelectedSubject(subject); setActiveTab('subject-detail') }} />
              ) : activeTab === 'subject-detail' ? (
                <SubjectDetailView subject={selectedSubject} onBack={() => setActiveTab('subjects')} />
              ) : activeTab === 'profile' ? (
                <Profile />
              ) : activeTab === 'resources' ? (
                <ResourcesView />
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
                  <h2 className="text-headline-lg-mobile text-on-surface font-semibold">Good morning, Alex!</h2>
                  <p className="text-body-md text-on-surface-variant mt-1.5 leading-snug">You have 3 deadlines approaching this week.</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Alex Johnson" 
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E2E8F0]" 
                />
              </div>

              {/* Stats Cards Swipe Row */}
              <MobileStats />

              {/* Mobile Subjects List */}
              <section className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-headline-md text-on-surface font-semibold">My Subjects</h3>
                  <a href="#" className="text-label-md text-primary font-semibold">View all</a>
                </div>

                <div className="flex flex-col gap-3">
                  
                  {/* Mobile Subject Card 1 */}
                  <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#eeefff] text-[#004ac6] flex items-center justify-center rounded-md shrink-0">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-label-md text-on-surface font-semibold">Data Structures</h4>
                        <span className="text-label-sm text-[#737686] block mt-0.5">Next class: Today, 2:30 PM</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-[#eeefff] text-[#004ac6] px-2 py-0.5 rounded-sm shrink-0 font-geist">CS 301</span>
                  </div>

                  {/* Mobile Subject Card 2 */}
                  <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ffede6] text-[#bc4800] flex items-center justify-center rounded-md shrink-0">
                        <Orbit className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-label-md text-on-surface font-semibold">Quantum Physics</h4>
                        <span className="text-label-sm text-[#737686] block mt-0.5">Next class: Tomorrow, 10:00 AM</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-[#ffede6] text-[#bc4800] px-2 py-0.5 rounded-sm shrink-0 font-geist">PHY 402</span>
                  </div>

                </div>
              </section>

              {/* Mobile Urgent Deadlines */}
              <MobileUrgentDeadlines />

              {/* Mobile Today's Schedule */}
              <MobileTodaySchedule />

              {/* Mobile Recent Materials */}
              <MobileRecentMaterials />
            </>
          ) : activeTab === 'calendar' ? (
            <CalendarView />
          ) : activeTab === 'subjects' ? (
            <SubjectsView onSelectSubject={(subject) => { setSelectedSubject(subject); setActiveTab('subject-detail') }} />
          ) : activeTab === 'subject-detail' ? (
            <SubjectDetailView subject={selectedSubject} onBack={() => setActiveTab('subjects')} />
          ) : activeTab === 'profile' ? (
            <Profile />
          ) : activeTab === 'resources' ? (
            <ResourcesView />
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
        />
      </div>

    </div>
  )
}

export default App