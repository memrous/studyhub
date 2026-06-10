import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppState } from '../context/AppStateContext'
import CalendarView from '../components/CalendarView'
import PageState from '../components/PageState'

const CalendarPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // openEventId may be passed via navigate('/calendar', { state: { openEventId } })
  const [openEventId, setOpenEventId] = useState(
    location.state?.openEventId ?? null
  )
  const {
    events,
    subjects,
    handleCreateEvent,
    handleEditEvent,
    handleDeleteEvent,
    isLoading,
    error,
    reloadData,
  } = useAppState()

  // Clear the router state so a refresh doesn't re-open the event
  useEffect(() => {
    if (location.state?.openEventId) {
      window.history.replaceState({}, '')
    }
  }, [location.state?.openEventId])

  if (isLoading) {
    return <PageState variant="loading" title="Loading..." />
  }

  if (error) {
    return (
      <PageState
        variant="error"
        title={error}
        description="Zkuste stránku načíst znovu."
        actionLabel="Zkusit znovu"
        onAction={reloadData}
      />
    )
  }

  if (events.length === 0 && subjects.length === 0) {
    return (
      <PageState
        variant="empty"
        title="Žádná data"
        description="Kalendář zatím neobsahuje žádné události."
      />
    )
  }

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
