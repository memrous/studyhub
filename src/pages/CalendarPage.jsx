import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppState } from '../context/AppStateContext'
import CalendarView from '../components/CalendarView'

const CalendarPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    events,
    subjects,
    handleCreateEvent,
    handleEditEvent,
    handleDeleteEvent,
  } = useAppState()

  // openEventId may be passed via navigate('/calendar', { state: { openEventId } })
  const [openEventId, setOpenEventId] = useState(
    location.state?.openEventId ?? null
  )

  // Clear the router state so a refresh doesn't re-open the event
  useEffect(() => {
    if (location.state?.openEventId) {
      window.history.replaceState({}, '')
    }
  }, [location.state?.openEventId])

  return (
    <CalendarView
      events={events}
      subjects={subjects}
      onCreateEvent={handleCreateEvent}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      onOpenSubject={(subjectId) => navigate(`/subjects/${subjectId}`)}
      openEventId={openEventId}
      onCloseOpenEvent={() => setOpenEventId(null)}
    />
  )
}

export default CalendarPage
