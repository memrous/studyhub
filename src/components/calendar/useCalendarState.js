import { useState, useMemo, useEffect } from 'react'

// Mapování designových barev podle TYPU události
export const TYPE_COLOR_MAP = {
  'Lecture': { color: 'blue', dot: '#004ac6', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  'Lab': { color: 'blue', dot: '#004ac6', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  'Assignment': { color: 'green', dot: '#117a3a', bg: 'bg-[#e6f4ea]', text: 'text-[#117a3a]' },
  'Test': { color: 'orange', dot: '#bc4800', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  'Quiz': { color: 'orange', dot: '#bc4800', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  'Exam': { color: 'red', dot: '#ba1a1a', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
  'Deadline': { color: 'red', dot: '#ba1a1a', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
  'default': { color: 'grey', dot: '#737686', bg: 'bg-[#eceef0]', text: 'text-[#737686]' }
}

export const getEventStyle = (type) => {
  return TYPE_COLOR_MAP[type] || TYPE_COLOR_MAP['default']
}

// Pomocná funkce pro formát data
export const formatDateKey = (date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const useCalendarState = ({
  currentEvents = [],
  currentSubjects = [],
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  openEventId,
  onCloseOpenEvent,
}) => {
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
  
  const [selectedSubjects, setSelectedSubjects] = useState([])

  // Keep selectedSubjects in sync when subjects are loaded
  useEffect(() => {
    if (currentSubjects.length > 0 && selectedSubjects.length === 0) {
      setSelectedSubjects(currentSubjects.map(s => s.name))
    }
  }, [currentSubjects, selectedSubjects])

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  
  // Pomocné states pro editaci/vytváření
  const [editingEventId, setEditingEventId] = useState(null)
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('10:00')
  const [newDuration, setNewDuration] = useState('60')
  const [newType, setNewType] = useState('Lecture')

  // Set default subject when subjects load
  useEffect(() => {
    if (currentSubjects.length > 0 && !newSubject) {
      setNewSubject(currentSubjects[0].name)
    }
  }, [currentSubjects, newSubject])

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
        
        // 2. Přetočí hlavní pohled kalendáře na správný měsíc a rok dané události
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
      if (onEditEvent) onEditEvent(eventData)
    } else {
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

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    activeView,
    setActiveView,
    selectedSubjects,
    setSelectedSubjects,
    isModalOpen,
    setIsModalOpen,
    deleteConfirmId,
    setDeleteConfirmId,
    editingEventId,
    setEditingEventId,
    selectedDetailEvent,
    setSelectedDetailEvent,
    newTitle,
    setNewTitle,
    newSubject,
    setNewSubject,
    newDate,
    setNewDate,
    newTime,
    setNewTime,
    newDuration,
    setNewDuration,
    newType,
    setNewType,
    SUBJECTS,
    preparedEvents,
    filteredEvents,
    gridDays,
    upcomingEventsList,
    currentWeekDays,
    selectedDayEvents,
    hourlySlots,
    handleEventSelect,
    handleSubjectToggle,
    handlePrev,
    handleNext,
    handleFormSubmit,
    openCreateModal,
    getMonthName,
  }
}
