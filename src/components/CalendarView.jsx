import React, { useState, useMemo } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  BookOpen, 
  Lightbulb, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react'

// Default mock events seed matching calendar.png
const DEFAULT_EVENTS = [
  {
    id: 1,
    code: 'CS 202',
    title: 'Data Structures Lecture',
    date: '2023-10-03',
    time: '14:00',
    endTime: '15:30',
    subject: 'Computer Science',
    color: 'blue',
    type: 'Lecture'
  },
  {
    id: 2,
    code: 'PHY 305',
    title: 'Quantum Physics Lab',
    date: '2023-10-06',
    time: '09:00',
    endTime: '11:00',
    subject: 'Physics',
    color: 'orange',
    type: 'Lab'
  },
  {
    id: 3,
    code: 'CS 202',
    title: 'Data Structures Lecture',
    date: '2023-10-10',
    time: '14:00',
    endTime: '15:30',
    subject: 'Computer Science',
    color: 'blue',
    type: 'Lecture'
  },
  {
    id: 4,
    code: 'ECON 101',
    title: 'Economics Essay Deadline',
    date: '2023-10-10',
    time: '23:59',
    endTime: '23:59',
    subject: 'Economics',
    color: 'red',
    type: 'Deadline'
  },
  {
    id: 5,
    code: 'PHY 305',
    title: 'Quantum Physics Midterm',
    date: '2023-10-13',
    time: '09:00',
    endTime: '10:30',
    subject: 'Physics',
    color: 'orange',
    type: 'Exam'
  },
  {
    id: 6,
    code: 'CS 202',
    title: 'Algorithm Quiz',
    date: '2023-10-25',
    time: '10:00',
    endTime: '11:00',
    subject: 'Computer Science',
    color: 'blue',
    type: 'Quiz'
  }
]

const SUBJECTS = [
  { name: 'Computer Science', color: 'blue', dot: '#004ac6', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  { name: 'Physics', color: 'orange', dot: '#bc4800', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  { name: 'Economics', color: 'red', dot: '#ba1a1a', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
  { name: 'Mathematics', color: 'grey', dot: '#737686', bg: 'bg-[#eceef0]', text: 'text-[#737686]' }
]

const CalendarView = () => {
  // States
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 9, 10)) // defaults to Oct 10, 2023
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 9, 1)) // October 2023
  const [activeView, setActiveView] = useState('month') // month | week | day
  const [events, setEvents] = useState(DEFAULT_EVENTS)
  const [selectedSubjects, setSelectedSubjects] = useState(['Computer Science', 'Physics', 'Economics', 'Mathematics'])
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newSubject, setNewSubject] = useState('Computer Science')
  const [newDate, setNewDate] = useState('2023-10-10')
  const [newTime, setNewTime] = useState('10:00')
  const [newDuration, setNewDuration] = useState('60')
  const [newType, setNewType] = useState('Lecture')

  // Format Helper: date -> 'YYYY-MM-DD'
  const formatDateKey = (date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  // Filter events based on active checkboxes
  const filteredEvents = useMemo(() => {
    return events.filter(event => selectedSubjects.includes(event.subject))
  }, [events, selectedSubjects])

  // Get color setup for a subject name
  const getSubjectStyle = (subjName) => {
    const found = SUBJECTS.find(s => s.name === subjName)
    if (found) return found
    return { name: subjName, color: 'blue', dot: '#004ac6', bg: 'bg-blue-50', text: 'text-blue-700' }
  }

  // Generate days array for Monthly Grid
  const gridDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // First day of month
    const firstDay = new Date(year, month, 1)
    // 0 = Sunday, 1 = Monday...
    const startDayOfWeek = firstDay.getDay()
    
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    
    const days = []
    
    // Previous month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i
      const dateObj = new Date(year, month - 1, dayNum)
      days.push({
        date: dateObj,
        dayNum,
        isCurrentMonth: false,
        dateKey: formatDateKey(dateObj)
      })
    }
    
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d)
      days.push({
        date: dateObj,
        dayNum: d,
        isCurrentMonth: true,
        dateKey: formatDateKey(dateObj)
      })
    }
    
    // Next month padding (complete grid of 6 weeks = 42 cells)
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      const dateObj = new Date(year, month + 1, d)
      days.push({
        date: dateObj,
        dayNum: d,
        isCurrentMonth: false,
        dateKey: formatDateKey(dateObj)
      })
    }
    
    return days
  }, [currentMonth])

  // Upcoming events: filtered, on or after selectedDate, sorted
  const upcomingEventsList = useMemo(() => {
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    return filteredEvents
      .filter(e => {
        const eventDate = new Date(e.date)
        return eventDate >= startOfDay
      })
      .sort((a, b) => {
        // Compare date first, then time
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.time.localeCompare(b.time)
      })
      .slice(0, 5) // top 5
  }, [filteredEvents, selectedDate])

  // Toggle Filters
  const handleSubjectToggle = (subjName) => {
    if (selectedSubjects.includes(subjName)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjName))
    } else {
      setSelectedSubjects([...selectedSubjects, subjName])
    }
  }

  // Navigation handlers
  const handlePrev = () => {
    if (activeView === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    } else if (activeView === 'week') {
      const nextD = new Date(selectedDate)
      nextD.setDate(nextD.getDate() - 7)
      setSelectedDate(nextD)
      setCurrentMonth(new Date(nextD.getFullYear(), nextD.getMonth(), 1))
    } else {
      const nextD = new Date(selectedDate)
      nextD.setDate(nextD.getDate() - 1)
      setSelectedDate(nextD)
      setCurrentMonth(new Date(nextD.getFullYear(), nextD.getMonth(), 1))
    }
  }

  const handleNext = () => {
    if (activeView === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    } else if (activeView === 'week') {
      const nextD = new Date(selectedDate)
      nextD.setDate(nextD.getDate() + 7)
      setSelectedDate(nextD)
      setCurrentMonth(new Date(nextD.getFullYear(), nextD.getMonth(), 1))
    } else {
      const nextD = new Date(selectedDate)
      nextD.setDate(nextD.getDate() + 1)
      setSelectedDate(nextD)
      setCurrentMonth(new Date(nextD.getFullYear(), nextD.getMonth(), 1))
    }
  }

  // Get start/end dates of current week for selectedDate
  const currentWeekDays = useMemo(() => {
    const startOfWeek = new Date(selectedDate)
    const day = startOfWeek.getDay() // 0 = Sun, 1 = Mon...
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    const week = []
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(startOfWeek)
      dateObj.setDate(startOfWeek.getDate() + i)
      week.push({
        date: dateObj,
        dayNum: dateObj.getDate(),
        dateKey: formatDateKey(dateObj),
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]
      })
    }
    return week
  }, [selectedDate])

  // Handle Event Creation Submit
  const handleCreateEvent = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const selectedSubjObj = SUBJECTS.find(s => s.name === newSubject)

    // Calculate end time
    const [h, m] = newTime.split(':').map(Number)
    const minutesAdded = Number(newDuration)
    const totalMinutes = h * 60 + m + minutesAdded
    const endH = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0')
    const endM = String(totalMinutes % 60).padStart(2, '0')
    const calculatedEndTime = `${endH}:${endM}`

    const newEvent = {
      id: Date.now(),
      code: newCode || 'GEN 100',
      title: newTitle,
      date: newDate,
      time: newTime,
      endTime: calculatedEndTime,
      subject: newSubject,
      color: selectedSubjObj ? selectedSubjObj.color : 'blue',
      type: newType
    }

    setEvents([...events, newEvent])
    
    // Reset form
    setNewTitle('')
    setNewCode('')
    setIsModalOpen(false)
  }

  // Set default form date when opening modal
  const openCreateModal = () => {
    setNewDate(formatDateKey(selectedDate))
    setIsModalOpen(true)
  }

  // Month Names Helper
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  // Selected Day Events list (agenda view for mobile / details)
  const selectedDayEvents = useMemo(() => {
    const key = formatDateKey(selectedDate)
    return filteredEvents.filter(e => e.date === key)
  }, [filteredEvents, selectedDate])

  // Hourly slots array (08:00 to 20:00)
  const hourlySlots = useMemo(() => {
    const slots = []
    for (let i = 8; i <= 20; i++) {
      slots.push(String(i).padStart(2, '0') + ':00')
    }
    return slots
  }, [])

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 font-inter text-on-surface">
      
      {/* ========================================== */}
      {/* LEFT COLUMN: Calendar grid & Views         */}
      {/* ========================================== */}
      <div className="flex-1 min-w-0 bg-white border border-[#E2E8F0] p-6 rounded-lg shadow-ambient">
        
        {/* Calendar Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-6 mb-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-headline-lg font-bold text-on-surface">Calendar</h1>
            <div className="flex items-center gap-4">
              <span className="text-headline-md text-on-surface font-semibold">
                {activeView === 'month' ? getMonthName(currentMonth) : getMonthName(selectedDate)}
              </span>
              <div className="flex items-center bg-[#F2F4F6] rounded-md border border-[#E2E8F0]">
                <button 
                  onClick={handlePrev}
                  className="p-1.5 hover:bg-surface-container transition-colors rounded-l-md cursor-pointer border-r border-[#E2E8F0]"
                >
                  <ChevronLeft className="w-4 h-4 text-[#737686]" />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-1.5 hover:bg-surface-container transition-colors rounded-r-md cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#737686]" />
                </button>
              </div>
            </div>
          </div>

          {/* View Toggle tabs (Month, Week, Day) */}
          <div className="flex p-0.5 bg-[#F2F4F6] border border-[#E2E8F0] rounded-md shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
            {['Month', 'Week', 'Day'].map((view) => (
              <button
                key={view}
                onClick={() => {
                  setActiveView(view.toLowerCase())
                  if (view.toLowerCase() === 'month') {
                    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
                  }
                }}
                className={`px-4 py-1.5 rounded-sm text-label-md font-semibold transition-all cursor-pointer flex-1 sm:flex-none text-center ${
                  activeView === view.toLowerCase()
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* MONTH VIEW                                 */}
        {/* ========================================== */}
        {activeView === 'month' && (
          <div className="flex flex-col w-full">
            {/* Weekday Names Header */}
            <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F2F4F6] rounded-t-md text-center py-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                <span key={dayName} className="text-label-sm text-[#737686] font-bold">
                  {dayName}
                </span>
              ))}
            </div>

            {/* Monthly Day Grid */}
            <div className="grid grid-cols-7 border-l border-t border-[#E2E8F0] rounded-b-md bg-[#F2F4F6]">
              {gridDays.map((day, idx) => {
                const dayEvents = filteredEvents.filter(e => e.date === day.dateKey)
                const isSelected = formatDateKey(selectedDate) === day.dateKey
                const isToday = formatDateKey(new Date()) === day.dateKey
                
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day.date)}
                    className={`min-h-[110px] p-2 border-r border-b border-[#E2E8F0] cursor-pointer flex flex-col justify-between transition-colors group relative ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-[#f7f9fb]'
                    } ${
                      isSelected 
                        ? 'bg-[#eeefff]!' 
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex justify-between items-start">
                      {isSelected ? (
                        <span className="w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-label-sm shadow-sm">
                          {day.dayNum}
                        </span>
                      ) : (
                        <span className={`text-label-md font-semibold ${
                          day.isCurrentMonth 
                            ? isToday ? 'text-primary font-bold' : 'text-on-surface'
                            : 'text-[#c3c6d7]'
                        }`}>
                          {day.dayNum}
                        </span>
                      )}
                      {dayEvents.length > 0 && (
                        <span className="sm:hidden w-1.5 h-1.5 bg-primary rounded-full"></span>
                      )}
                    </div>

                    {/* Events list (Desktop only) */}
                    <div className="hidden sm:flex flex-col gap-1 mt-2 flex-grow overflow-y-auto max-h-[75px] no-scrollbar">
                      {dayEvents.map(event => {
                        const styleObj = getSubjectStyle(event.subject)
                        return (
                          <div 
                            key={event.id}
                            title={`${event.code}: ${event.title} (${event.time})`}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm truncate border ${styleObj.bg} ${styleObj.text} border-black/5 hover:brightness-95 transition-all`}
                          >
                            {event.code}: {event.title}
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Events count (Mobile view helper fallback dot bar) */}
                    <div className="sm:hidden flex flex-wrap gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map(event => {
                        const styleObj = getSubjectStyle(event.subject)
                        return (
                          <span 
                            key={event.id}
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: styleObj.dot }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Mobile agenda for selected date */}
            <div className="sm:hidden mt-6 bg-[#F2F4F6] border border-[#E2E8F0] p-4 rounded-lg flex flex-col gap-3">
              <h3 className="text-label-md font-bold text-on-surface">
                Agenda: {selectedDate.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' })}
              </h3>
              {selectedDayEvents.length === 0 ? (
                <p className="text-body-md text-[#737686] italic">No events scheduled for this day.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {selectedDayEvents.map(event => {
                    const styleObj = getSubjectStyle(event.subject)
                    return (
                      <div key={event.id} className="bg-white border border-[#E2E8F0] p-3 rounded-md flex items-center justify-between shadow-ambient">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${styleObj.bg} ${styleObj.text} flex items-center justify-center rounded-sm shrink-0 font-bold text-[10px]`}>
                            {event.code}
                          </div>
                          <div>
                            <h4 className="text-label-md font-bold text-on-surface leading-tight">{event.title}</h4>
                            <span className="text-[10px] text-[#737686] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> {event.time} - {event.endTime}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm ${styleObj.bg} ${styleObj.text}`}>
                          {event.type}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* WEEK VIEW                                  */}
        {/* ========================================== */}
        {activeView === 'week' && (
          <div className="w-full flex flex-col border border-[#E2E8F0] rounded-md overflow-x-auto">
            {/* Headers row */}
            <div className="grid grid-cols-7 min-w-[700px] border-b border-[#E2E8F0] bg-[#F2F4F6] py-3 text-center font-semibold">
              {currentWeekDays.map(day => {
                const isSelected = formatDateKey(selectedDate) === day.dateKey
                return (
                  <div 
                    key={day.dayName} 
                    onClick={() => setSelectedDate(day.date)}
                    className={`flex flex-col items-center justify-center gap-1 py-1 cursor-pointer transition-colors ${
                      isSelected ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    <span className="text-label-sm text-[#737686] font-bold uppercase">{day.dayName}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold transition-all ${
                      isSelected 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'hover:bg-surface-container'
                    }`}>
                      {day.dayNum}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Timetable content columns */}
            <div className="grid grid-cols-7 min-w-[700px] bg-white divide-x divide-[#E2E8F0] h-[480px] overflow-y-auto">
              {currentWeekDays.map(day => {
                const dayEvents = filteredEvents.filter(e => e.date === day.dateKey)
                return (
                  <div key={day.dateKey} className="p-3 flex flex-col gap-3 min-h-full bg-white hover:bg-slate-50/50 transition-colors">
                    {dayEvents.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-[11px] text-[#c3c6d7] italic border-2 border-dashed border-[#eceef0] rounded-lg p-2 text-center select-none">
                        No events
                      </div>
                    ) : (
                      dayEvents
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(event => {
                          const styleObj = getSubjectStyle(event.subject)
                          return (
                            <div 
                              key={event.id}
                              className={`p-3 rounded-lg border flex flex-col gap-1.5 shadow-sm hover:shadow transition-shadow ${styleObj.bg} ${styleObj.text} border-black/5`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">{event.code}</span>
                                <span className={`text-[9px] font-bold px-1.5 rounded-sm bg-white/70`}>{event.type}</span>
                              </div>
                              <h4 className="text-label-md font-bold leading-snug truncate" title={event.title}>{event.title}</h4>
                              <div className="flex items-center gap-1 text-[10px] opacity-80 mt-0.5">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span>{event.time}</span>
                              </div>
                            </div>
                          )
                        })
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* DAY VIEW                                   */}
        {/* ========================================== */}
        {activeView === 'day' && (
          <div className="w-full flex flex-col border border-[#E2E8F0] rounded-md bg-white p-4">
            
            {/* Selected day header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eeefff] text-primary flex items-center justify-center rounded-md">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-headline-md font-bold text-on-surface">
                    {selectedDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h3>
                  <p className="text-body-md text-[#737686] mt-0.5">Your schedule and deadlines for today</p>
                </div>
              </div>
              
              <button 
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-label-md bg-primary text-white rounded-md font-semibold hover:bg-primary/95 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>

            {/* Daily timeline grid */}
            <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-2">
              {hourlySlots.map(hour => {
                // Find events starting in this hour (e.g. "10:00" starts in "10:00")
                const slotEvents = selectedDayEvents.filter(e => {
                  const [eh, em] = e.time.split(':')
                  return `${eh.padStart(2, '0')}:00` === hour
                })

                return (
                  <div key={hour} className="flex gap-4 border-b border-[#eceef0] py-4 items-start min-h-[70px]">
                    <span className="w-12 text-label-sm font-bold text-[#737686] text-right pt-0.5">{hour}</span>
                    
                    <div className="flex-1 flex flex-col gap-2">
                      {slotEvents.length === 0 ? (
                        <div className="text-[11px] text-[#c3c6d7] italic pt-1">Free schedule slot</div>
                      ) : (
                        slotEvents.map(event => {
                          const styleObj = getSubjectStyle(event.subject)
                          return (
                            <div 
                              key={event.id}
                              className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-ambient hover:shadow-sm transition-all ${styleObj.bg} ${styleObj.text} border-black/5`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="bg-white/80 px-2 py-1 rounded-sm text-[10px] font-extrabold uppercase shrink-0">
                                  {event.code}
                                </div>
                                <div>
                                  <h4 className="text-label-md font-bold leading-tight">{event.title}</h4>
                                  <span className="text-[10px] flex items-center gap-1 mt-1 opacity-80">
                                    <Clock className="w-3.5 h-3.5" /> {event.time} - {event.endTime} ({event.type})
                                  </span>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-sm bg-white/70 w-fit self-end md:self-auto`}>
                                {event.subject}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* RIGHT COLUMN: Actions, Filters, Focus Mode */}
      {/* ========================================== */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
        
        {/* Create New Event Button */}
        <button 
          onClick={openCreateModal}
          className="w-full bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.98] text-white flex items-center justify-center gap-2 py-3 rounded-lg font-semibold shadow-md transition-all text-body-lg cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>

        {/* Upcoming Events List */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient">
          <h2 className="text-headline-md font-bold text-on-surface mb-4">Upcoming Events</h2>
          
          <div className="flex flex-col gap-3">
            {upcomingEventsList.length === 0 ? (
              <p className="text-body-md text-[#737686] italic text-center py-4">No upcoming events filter matches.</p>
            ) : (
              upcomingEventsList.map(event => {
                const styleObj = getSubjectStyle(event.subject)
                const dateText = new Date(event.date).toLocaleDateString('default', { 
                  month: 'short', 
                  day: 'numeric' 
                })
                
                return (
                  <div 
                    key={event.id}
                    onClick={() => {
                      setSelectedDate(new Date(event.date))
                      setCurrentMonth(new Date(event.date))
                    }}
                    className="bg-white border border-[#E2E8F0] p-4 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                  >
                    {/* Vertical left border accent */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1" 
                      style={{ backgroundColor: styleObj.dot }}
                    />
                    
                    <div className="flex justify-between items-start gap-1">
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm ${styleObj.bg} ${styleObj.text}`}>
                        {event.code}
                      </span>
                      <span className="text-[10px] text-[#737686] font-semibold">
                        {dateText}, {event.time}
                      </span>
                    </div>
                    <h3 className="text-label-md font-bold text-on-surface leading-snug truncate" title={event.title}>
                      {event.title}
                    </h3>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Filter by Subject Checkboxes */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient">
          <h2 className="text-headline-md font-bold text-on-surface mb-4">Filter by Subject</h2>
          
          <div className="flex flex-col gap-3">
            {SUBJECTS.map(subj => {
              const isChecked = selectedSubjects.includes(subj.name)
              return (
                <label 
                  key={subj.name}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-[#F2F4F6] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSubjectToggle(subj.name)}
                      className="w-4.5 h-4.5 rounded border-[#E2E8F0] text-primary focus:ring-primary accent-primary shrink-0 cursor-pointer"
                    />
                    <span className="text-body-md font-semibold text-on-surface">{subj.name}</span>
                  </div>
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: subj.dot }}
                  />
                </label>
              )
            })}
          </div>
        </div>

        {/* Focus Mode Card */}
        <div className="bg-[#eeefff] border border-[#d3e4fe] p-5 rounded-lg flex flex-col gap-3 relative overflow-hidden shadow-ambient text-[#004ac6]">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 fill-current shrink-0" />
            <span className="font-geist font-bold text-label-md uppercase tracking-wider">Focus Mode</span>
          </div>
          <p className="text-body-md font-medium leading-relaxed">
            Your "Quantum Physics" exam is in 3 days. We've cleared your schedule for tomorrow afternoon.
          </p>
        </div>

      </div>

      {/* ========================================== */}
      {/* EVENT CREATION MODAL                       */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
          
          {/* Modal Container */}
          <div className="bg-white rounded-lg shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden relative font-inter">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-surface">
              <h2 className="text-headline-md font-bold text-on-surface">Create New Event</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-full hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateEvent} className="p-6 flex flex-col gap-4">
              
              {/* Event Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-md font-bold text-on-surface-variant">Event Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Data Structures Exam" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
                />
              </div>

              {/* Course Code & Event Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md font-bold text-on-surface-variant">Course Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CS 202" 
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md font-bold text-on-surface-variant">Type</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Exam">Exam</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>
              </div>

              {/* Subject (Color code matching) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-md font-bold text-on-surface-variant">Subject</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.map(subj => {
                    const isSelected = newSubject === subj.name
                    return (
                      <button
                        key={subj.name}
                        type="button"
                        onClick={() => setNewSubject(subj.name)}
                        className={`flex items-center gap-2 p-2.5 rounded-md border text-left text-label-sm font-semibold transition-all cursor-pointer ${
                          isSelected 
                            ? `${subj.bg} ${subj.text} border-primary/20 ring-1 ring-primary/25` 
                            : 'bg-white border-[#E2E8F0] text-on-surface-variant hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: subj.dot }} />
                        <span className="truncate">{subj.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Date & Start Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md font-bold text-on-surface-variant">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md font-bold text-on-surface-variant">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-md font-bold text-on-surface-variant">Duration (Minutes)</label>
                <select 
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="0">Deadline (All Day)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-label-md font-semibold text-on-surface-variant rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004ac6] hover:bg-[#003ea8] text-white text-label-md font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Save Event
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default CalendarView
