import React, { useState, useMemo, useEffect } from 'react'
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

// Import tvých sjednocených mock dat
import { INITIAL_EVENTS, INITIAL_SUBJECTS } from '../data/mockData'

// Mapování designových barev podle TYPU události
const TYPE_COLOR_MAP = {
  'Lecture': { color: 'blue', dot: '#004ac6', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  'Lab': { color: 'blue', dot: '#004ac6', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  'Assignment': { color: 'green', dot: '#117a3a', bg: 'bg-[#e6f4ea]', text: 'text-[#117a3a]' },
  'Test': { color: 'orange', dot: '#bc4800', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  'Quiz': { color: 'orange', dot: '#bc4800', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  'Exam': { color: 'red', dot: '#ba1a1a', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
  'Deadline': { color: 'red', dot: '#ba1a1a', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
  'default': { color: 'grey', dot: '#737686', bg: 'bg-[#eceef0]', text: 'text-[#737686]' }
}

const CalendarView = ({ 
  events: propEvents, 
  subjects: propSubjects, 
  onCreateEvent, 
  onEditEvent, 
  onDeleteEvent, 
  onOpenSubject,
  openEventId,        
  onCloseOpenEvent     
}) => {
  
  // Použijeme prioritně data z props, jinak záložní z mocků
  const currentEvents = propEvents || INITIAL_EVENTS
  const currentSubjects = propSubjects || INITIAL_SUBJECTS

  // Seznam předmětů pro filtry
  const SUBJECTS = useMemo(() => {
    return currentSubjects.map((subj) => ({
      id: subj.id,
      name: subj.name,
      code: subj.code
    }))
  }, [currentSubjects])


  // States - nastavené na dnešní datum
  const [selectedDate, setSelectedDate] = useState(new Date()) 
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [activeView, setActiveView] = useState('month')
  
  const [selectedSubjects, setSelectedSubjects] = useState(currentSubjects.map(s => s.name))
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  
  // Pomocné states pro editaci/vytváření
  const [editingEventId, setEditingEventId] = useState(null)
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newSubject, setNewSubject] = useState(currentSubjects[0]?.name || '')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('10:00')
  const [newDuration, setNewDuration] = useState('60')
  const [newType, setNewType] = useState('Lecture')

  // Pomocná funkce pro formát data
  const formatDateKey = (date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  // Obohacení událostí a výpočet časů + BARVY PODLE TYPU
  const preparedEvents = useMemo(() => {
    return currentEvents.map(event => {
      const subjObj = SUBJECTS.find(s => s.id === event.subjectId)
      
      let startTime = event.time
      let endTime = event.time
      if (event.time && event.time.includes('–')) {
        const [start, end] = event.time.split('–')
        startTime = start.trim()
        endTime = end.trim()
      } else if (event.time && event.time.includes('-')) {
        const [start, end] = event.time.split('-')
        startTime = start.trim()
        endTime = end.trim()
      }

      return {
        ...event,
        code: event.code || (subjObj ? subjObj.code : 'MOCK'),
        subject: subjObj ? subjObj.name : (event.subject || 'Unknown'),
        time: startTime,
        endTime: endTime,
        color: 'blue'
      }
    })
  }, [currentEvents, SUBJECTS])

  const filteredEvents = useMemo(() => {
    return preparedEvents.filter(event => selectedSubjects.includes(event.subject))
  }, [preparedEvents, selectedSubjects])

  // Automatické otevření detailu události, pokud přicházíme z Dashboardu přes ID
  useEffect(() => {
    if (openEventId) {
      const targetEvent = preparedEvents.find(e => e.id === Number(openEventId))
      if (targetEvent) {
        const eventDateObj = new Date(targetEvent.date)
        
        // 1. Nastaví vybraný den (pro denní/týdenní zobrazení a zvýraznění kolečka)
        setSelectedDate(eventDateObj)
        
        // 2. NOVÉ: Přetočí hlavní pohled kalendáře na správný měsíc a rok dané události
        setCurrentMonth(new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), 1))
        
        // 3. Otevře pop-up detailu
        setSelectedDetailEvent(targetEvent)
      }
      if (onCloseOpenEvent) {
        onCloseOpenEvent()
      }
    }
  }, [openEventId, preparedEvents, onCloseOpenEvent])

  // Společná funkce pro výběr události odkudkoliv uvnitř kalendáře
  const handleEventSelect = (event) => {
    const eventDateObj = new Date(event.date)
    // 1. Vybere a zvýrazní den v kalendáři
    setSelectedDate(eventDateObj)
    // 2. Přetočí kalendář na správný měsíc a rok
    setCurrentMonth(new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), 1))
    // 3. Otevře pop-up okno
    setSelectedDetailEvent(event)
  }

  // Funkce, která vrátí správné barvy podle typu (Lecture, Assignment, atd.)
  const getEventStyle = (type) => {
    return TYPE_COLOR_MAP[type] || TYPE_COLOR_MAP['default']
  }

  // Generování matice dní pro měsíční přehled
  const gridDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    let startDayOfWeek = firstDay.getDay()
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
    
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    
    const days = []
    
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
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d)
      days.push({
        date: dateObj,
        dayNum: d,
        isCurrentMonth: true,
        dateKey: formatDateKey(dateObj)
      })
    }
    
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

  // Nadcházející události (Top 5 od vybraného dne)
  const upcomingEventsList = useMemo(() => {
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    return filteredEvents
      .filter(e => {
        const eventDate = new Date(e.date)
        return eventDate >= startOfDay
      })
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.time.localeCompare(b.time)
      })
      .slice(0, 5)
  }, [filteredEvents, selectedDate])

  const handleSubjectToggle = (subjName) => {
    if (selectedSubjects.includes(subjName)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjName))
    } else {
      setSelectedSubjects([...selectedSubjects, subjName])
    }
  }

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

  const currentWeekDays = useMemo(() => {
    const startOfWeek = new Date(selectedDate)
    let day = startOfWeek.getDay()
    let diff = day === 0 ? 6 : day - 1
    startOfWeek.setDate(startOfWeek.getDate() - diff)
    
    const week = []
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(startOfWeek)
      dateObj.setDate(startOfWeek.getDate() + i)
      week.push({
        date: dateObj,
        dayNum: dateObj.getDate(),
        dateKey: formatDateKey(dateObj),
        dayName: dayNames[i]
      })
    }
    return week
  }, [selectedDate])

  const handleFormSubmit = (e) => {
  e.preventDefault()
  if (!newTitle.trim()) return

  const targetSubj = currentSubjects.find(s => s.name === newSubject)

  // Výpočet koncového času podle trvání
  const [h, m] = newTime.split(':').map(Number)
  const minutesAdded = Number(newDuration)
  const totalMinutes = h * 60 + m + minutesAdded
  const endH = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0')
  const endM = String(totalMinutes % 60).padStart(2, '0')
  const formattedTimeRange = `${newTime} – ${endH}:${endM}`

  const eventData = {
    id: editingEventId || Date.now(), // Pokud editujeme, zachováme původní ID
    subjectId: targetSubj ? targetSubj.id : 1,
    title: newTitle,
    date: newDate,
    time: formattedTimeRange,
    type: newType,
    status: 'Not Started'
  }

  if (editingEventId) {
    // OPRAVA: Pokud máme nastavené editingEventId, voláme úpravu z App.jsx
    if (onEditEvent) onEditEvent(eventData)
  } else {
    // Jinak vytváříme úplně nový event
    if (onCreateEvent) onCreateEvent(eventData)
  }
  
  // Resetujeme formulář a zavřeme modal
  setNewTitle('')
  setEditingEventId(null)
  setIsModalOpen(false)
}

  const openCreateModal = () => {
    setNewDate(formatDateKey(selectedDate))
    setIsModalOpen(true)
  }

  const getMonthName = (date) => {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }

  const selectedDayEvents = useMemo(() => {
    const key = formatDateKey(selectedDate)
    return filteredEvents.filter(e => e.date === key)
  }, [filteredEvents, selectedDate])

  const hourlySlots = useMemo(() => {
    const slots = []
    for (let i = 8; i <= 20; i++) {
      slots.push(String(i).padStart(2, '0') + ':00')
    }
    return slots
  }, [])

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 font-inter text-on-surface">
      
      {/* LEVÝ SLOUPEC: Mřížka kalendáře */}
      <div className="flex-1 min-w-0 bg-white border border-[#E2E8F0] p-6 rounded-lg shadow-ambient">
        
        {/* Hlavička kalendáře */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-6 mb-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-headline-lg font-bold text-on-surface">Calendar</h1>
            <div className="flex items-center gap-4">
              <span className="text-headline-md text-on-surface font-semibold capitalize">
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

          {/* Přepínání pohledů */}
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

        {/* MĚSÍČNÍ POHLED */}
        {activeView === 'month' && (
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F2F4F6] rounded-t-md text-center py-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (
                <span key={dayName} className="text-label-sm text-[#737686] font-bold">
                  {dayName}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 border-l border-t border-[#E2E8F0] rounded-b-md bg-[#F2F4F6]">
              {gridDays.map((day, idx) => {
                const dayEvents = filteredEvents.filter(e => e.date === day.dateKey)
                const isSelected = formatDateKey(selectedDate) === day.dateKey
                const isToday = formatDateKey(new Date()) === day.dateKey
                
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day.date)}
                    className={`cursor-pointer flex flex-col justify-between items-center sm:items-stretch transition-all group relative rounded-lg sm:rounded-none aspect-square sm:aspect-auto min-h-0 sm:min-h-[110px] p-1 sm:p-2 border-1 sm:border-r sm:border-b border-[#E2E8F0] ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-[#f7f9fb]'
                    } ${
                      isSelected 
                        ? 'bg-[#eeefff]! border-blue-800' 
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
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
                      {/* {dayEvents.length > 0 && (
                        <span className="sm:hidden w-1.5 h-1.5 bg-primary rounded-full"></span>
                      )} */}
                    </div>

                    {/* Seznam akcí pro desktop */}
                    <div className="hidden sm:flex flex-col gap-1 mt-2 flex-grow overflow-y-auto max-h-[75px] no-scrollbar">
                      {dayEvents.map(event => {
                        const styleObj = getEventStyle(event.type)
                        return (
                          <div 
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation(); // Zabrání přepsání selectedDate klikem na políčko
                              handleEventSelect(event);
                            }}
                            title={`${event.code}: ${event.title} (${event.time})`}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm truncate border ${styleObj.bg} ${styleObj.text} border-black/5 hover:brightness-95 transition-all cursor-pointer`}
                          >
                            {event.code}: {event.title}
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Tečky pro mobilní zobrazení */}
                    <div className="sm:hidden flex flex-wrap gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map(event => {
                        const styleObj = getEventStyle(event.type)
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
            
            {/* Mobilní Agenda pod kalendářem */}
            <div className="sm:hidden mt-6 bg-[#F2F4F6] border border-[#E2E8F0] p-4 rounded-lg flex flex-col gap-3">
              <h3 className="text-label-md font-bold text-on-surface">
                Agenda: {selectedDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })}
              </h3>
              {selectedDayEvents.length === 0 ? (
                <p className="text-body-md text-[#737686] italic">No events scheduled for this day.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {selectedDayEvents.map(event => {
                    const styleObj = getEventStyle(event.type)
                    return (
                      <div 
                        key={event.id} 
                        onClick={() => handleEventSelect(event)}
                        className="bg-white border border-[#E2E8F0] p-3 rounded-md flex items-center justify-between shadow-ambient cursor-pointer hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${styleObj.bg} ${styleObj.text} flex items-center justify-center rounded-sm shrink-0 font-bold text-[10px]`}>
                            {event.code}
                          </div>
                          <div>
                            <h4 className="text-label-md font-bold text-on-surface leading-tight">{event.title}</h4>
                            <span className="text-[10px] text-[#737686] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> {event.time} {event.endTime && `- ${event.endTime}`}
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

        {/* TÝDENNÍ POHLED */}
        {activeView === 'week' && (
          <div className="w-full flex flex-col border border-[#E2E8F0] rounded-md overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[700px] border-b border-[#E2E8F0] bg-[#F2F4F6] py-3 text-center font-semibold">
              {currentWeekDays.map(day => {
                const isSelected = formatDateKey(selectedDate) === day.dateKey
                return (
                  <div 
                    key={day.dateKey} 
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
                          const styleObj = getEventStyle(event.type)
                          return (
                            <div 
                              key={event.id}
                              onClick={() => handleEventSelect(event)}
                              className={`p-3 rounded-lg border flex flex-col gap-1.5 shadow-sm hover:shadow transition-shadow cursor-pointer ${styleObj.bg} ${styleObj.text} border-black/5`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">{event.code}</span>
                                {/* <span className={`hidden xl:g:block text-[9px] font-bold px-1.5 rounded-sm bg-white/70`}>{event.type}</span> */}
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

        {/* DENNÍ POHLED */}
        {activeView === 'day' && (
          <div className="w-full flex flex-col border border-[#E2E8F0] rounded-md bg-white p-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-0 justify-between border-b border-[#E2E8F0] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eeefff] text-primary flex items-center justify-center rounded-md">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className=" text-headline-md font-bold text-on-surface capitalize">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
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

            <div className="flex-1 flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-2">
              {hourlySlots.map(hour => {
                const slotEvents = selectedDayEvents.filter(e => {
                  if (!e.time) return false
                  const [eh] = e.time.split(':')
                  return `${eh.padStart(2, '0')}:00` === hour
                })

                return (
                  <div key={hour} className="flex flex-col sm:flex-row gap-4 border-b border-[#eceef0] py-4 items-start ">
                    <span className="w-12 text-label-sm font-bold text-[#737686] text-right pt-0.5">{hour}</span>
                    
                    <div className="flex-1 flex flex-col gap-2">
                      {slotEvents.length === 0 ? (
                        <div className="text-[11px] text-[#c3c6d7] italic pt-1">Free schedule slot</div>
                      ) : (
                        slotEvents.map(event => {
                          const styleObj = getEventStyle(event.type)
                          return (
                            <div 
                              key={event.id}
                              onClick={() => handleEventSelect(event)}
                              className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-ambient hover:shadow-sm transition-all cursor-pointer ${styleObj.bg} ${styleObj.text} border-black/5`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="hidden md:block bg-white/80 px-2 py-1 rounded-sm text-[10px] font-extrabold uppercase shrink-0">
                                  {event.code}
                                </div>
                                <div>
                                  <h4 className="text-label-md font-bold leading-tight">{event.title}</h4>
                                  <span className="text-[10px] flex items-center gap-1 mt-1 opacity-80">
                                    <Clock className="w-3.5 h-3.5" /> {event.time} {event.endTime && `- ${event.endTime}`} ({event.type})
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

      {/* PRAVÝ SLOUPEC: Filtry a Nadcházející události */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
        
        <button 
          onClick={openCreateModal}
          className="w-full bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.98] text-white flex items-center justify-center gap-2 py-3 rounded-lg font-semibold shadow-md transition-all text-body-lg cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>

        {/* Přehled blížících se akcí */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient">
          <h2 className="text-headline-md font-bold text-on-surface mb-4">Upcoming Events</h2>
          
          <div className="flex flex-col gap-3">
            {upcomingEventsList.length === 0 ? (
              <p className="text-body-md text-[#737686] italic text-center py-4">No upcoming events filter matches.</p>
            ) : (
              upcomingEventsList.map(event => {
                const styleObj = getEventStyle(event.type)
                const dateText = new Date(event.date).toLocaleDateString('cs-CZ', { 
                  month: 'short', 
                  day: 'numeric' 
                })
                
                return (
                 <div 
                    key={event.id}
                    onClick={() => handleEventSelect(event)}
                    className="bg-white border border-[#E2E8F0] p-4 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
                  >
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
                    <h3 className="text-label-md font-bold text-on-surface leading-snug truncate group-hover:text-primary transition-colors" title={event.title}>
                      {event.title}
                    </h3>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Dynamické Checkboxy pro filtry */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient">
          <h2 className="text-headline-md font-bold text-on-surface mb-4">Filter by Subject</h2>
          
          <div className="flex flex-col gap-3">
            {SUBJECTS.map(subj => {
              const isChecked = selectedSubjects.includes(subj.name)
              return (
                <label 
                  key={subj.id}
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
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-slate-400" />
                </label>
              )
            })}
          </div>
        </div>

        {/* Legend / Vysvětlivky barev */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient">
          <h2 className="text-headline-md font-bold text-on-surface mb-4">Event Types</h2>

          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-sm shrink-0 bg-[#eeefff] border border-[#004ac6]/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6]" />
              </span>
              <div className="flex flex-col">
                <span className="text-body-md font-bold text-on-surface leading-none">Lectures & Labs</span>
                <span className="text-[11px] text-[#737686] mt-0.5">Regular classes and seminars</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-sm shrink-0 bg-[#e6f4ea] border border-[#117a3a]/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#117a3a]" />
              </span>
              <div className="flex flex-col">
                <span className="text-body-md font-bold text-on-surface leading-none">Assignments</span>
                <span className="text-[11px] text-[#737686] mt-0.5">Homework and project milestones</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-sm shrink-0 bg-[#ffede6] border border-[#bc4800]/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bc4800]" />
              </span>
              <div className="flex flex-col">
                <span className="text-body-md font-bold text-on-surface leading-none">Tests & Quizzes</span>
                <span className="text-[11px] text-[#737686] mt-0.5">Midterms, small tests and quizzes</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-sm shrink-0 bg-[#ffdad6] border border-[#ba1a1a]/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
              </span>
              <div className="flex flex-col">
                <span className="text-body-md font-bold text-on-surface leading-none">Exams & Deadlines</span>
                <span className="text-[11px] text-[#ba1a1a] font-semibold mt-0.5">Final exams and strict deadlines</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODÁLNÍ OKNO PRO TVORBU AKCE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-lg shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden relative font-inter">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-surface">
              <h2 className="text-headline-md font-bold text-on-surface">{editingEventId ? 'Edit Event' : 'Create New Event'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-full hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-label-md font-bold text-on-surface-variant">Event Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Database Systems Practical Test" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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

              <div className="flex flex-col gap-1.5">
                <label className="text-label-md font-bold text-on-surface-variant">Subject</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.map(subj => {
                    const isSelected = newSubject === subj.name
                    return (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => setNewSubject(subj.name)}
                        className={`flex items-center gap-2 p-2.5 rounded-md border text-left text-label-sm font-semibold transition-all cursor-pointer ${
                          isSelected 
                            ? `bg-primary/10 border-primary text-primary ring-1 ring-primary/25` 
                            : 'bg-white border-[#E2E8F0] text-on-surface-variant hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0 bg-slate-400" />
                        <span className="truncate">{subj.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

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

              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingEventId(null)
                  }}
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

      {/* POP-UP MODAL: DETAIL UDÁLOSTI */}
      {selectedDetailEvent && (() => {
        const targetSubject = currentSubjects.find(s => s.id === selectedDetailEvent.subjectId)
        const styleObj = getEventStyle(selectedDetailEvent.type)
        
        return (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden relative font-inter animate-in fade-in zoom-in-95 duration-150">
              
              <div className={`px-6 py-4 border-b border-[#E2E8F0] ${styleObj.bg} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-sm bg-white border border-black/5 ${styleObj.text}`}>
                    {selectedDetailEvent.code}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm bg-white/60 ${styleObj.text}`}>
                    {selectedDetailEvent.type}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedDetailEvent(null)
                    setDeleteConfirmId(null)
                  }}
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-full hover:bg-black/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4.5">
                <div>
                  <h3 className="text-headline-md font-bold text-on-surface leading-tight">
                    {selectedDetailEvent.title}
                  </h3>
                  <p className="text-body-md font-semibold text-primary mt-1">
                    {targetSubject ? targetSubject.name : 'Unknown Subject'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#F2F4F6] p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <CalendarIcon className="w-4 h-4 text-[#737686] shrink-0" />
                    <span className="text-label-md font-medium text-on-surface">
                      {new Date(selectedDetailEvent.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Clock className="w-4 h-4 text-[#737686] shrink-0" />
                    <span className="text-label-md font-medium text-on-surface">
                      {selectedDetailEvent.time} {selectedDetailEvent.endTime && `– ${selectedDetailEvent.endTime}`}
                    </span>
                  </div>
                </div>

                {targetSubject && (
                  <div className="flex flex-col gap-2.5 border-t border-[#E2E8F0] pt-4">
                    <div className="flex justify-between items-center text-body-md">
                      <span className="text-[#737686] font-medium">Lecturer:</span>
                      <span className="font-bold text-on-surface">{targetSubject.lecturer || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center text-body-md">
                      <span className="text-[#737686] font-medium">Credits / Completion:</span>
                      <span className="font-semibold text-on-surface">
                        {targetSubject.credits} STAG Credits ({targetSubject.completionType})
                      </span>
                    </div>
                    {targetSubject.description && (
                      <div className="flex flex-col gap-1 mt-1 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="text-[11px] text-[#737686] font-bold uppercase tracking-wider">Subject Description:</span>
                        <p className="text-label-sm text-on-surface-variant leading-relaxed line-clamp-3">
                          {targetSubject.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      if (targetSubject && onOpenSubject) {
                        onOpenSubject(targetSubject.id)
                      }
                      setSelectedDetailEvent(null)
                    }}
                    className="w-full bg-[#004ac6] hover:bg-[#003ea8] text-white py-2 rounded-md font-semibold text-label-md transition-colors shadow-sm cursor-pointer text-center"
                  >
                    Open Subject Hub
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                      // Naplníme formulář daty z vybrané události
                      setEditingEventId(selectedDetailEvent.id)
                      setNewTitle(selectedDetailEvent.title)
                      setNewSubject(selectedDetailEvent.subject)
                      setNewDate(selectedDetailEvent.date)

                      // Vytáhneme z rozsahu (např. "10:00 – 11:30") čistý startovní čas pro input
                      const startTime = selectedDetailEvent.time.split('–')[0].trim()
                      setNewTime(startTime)
                      setNewType(selectedDetailEvent.type)

                      // Otevřeme modal a zavřeme detail okno
                      setIsModalOpen(true)
                      setSelectedDetailEvent(null)
                      setDeleteConfirmId(null)
                      }}                    
                      className="border border-[#E2E8F0] hover:bg-slate-50 text-on-surface-variant font-bold py-2 rounded-md text-label-md transition-colors cursor-pointer"
                    >
                      Edit Event
                    </button>

                    {deleteConfirmId === selectedDetailEvent.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onDeleteEvent) {
                            onDeleteEvent(selectedDetailEvent.id)
                          }
                          setSelectedDetailEvent(null)
                          setDeleteConfirmId(null)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md text-label-md transition-all cursor-pointer shadow-sm animate-pulse text-center"
                      >
                        Are you sure?
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(selectedDetailEvent.id)}
                        className="border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 rounded-md text-label-md transition-colors cursor-pointer text-center"
                      >
                        Delete Event
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

export default CalendarView