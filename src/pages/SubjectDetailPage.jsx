import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import SubjectDetailView from '../components/SubjectDetailView'

const SubjectDetailPage = () => {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const { subjects, events, resources, handleUpdateEventStatus, handleCreateEvent, handleUploadResource } = useAppState()

  const subject = subjects.find((s) => s.id === Number(subjectId)) || null

  // If the subject ID is invalid, redirect back to subjects list
  if (!subject) {
    return <Navigate to="/subjects" replace />
  }

  return (
    <SubjectDetailView
      subject={subject}
      events={events}
      resources={resources}
      onBack={() => navigate('/subjects')}
      onUpdateEventStatus={handleUpdateEventStatus}
      onCreateEvent={handleCreateEvent}
      onUploadResource={handleUploadResource}
    />
  )
}

export default SubjectDetailPage
