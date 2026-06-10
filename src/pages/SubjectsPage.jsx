import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import SubjectsView from '../components/SubjectsView'

const SubjectsPage = () => {
  const navigate = useNavigate()
  const { subjects, handleAddSubject } = useAppState()

  const handleSelectSubject = (subject) => {
    navigate(`/subjects/${subject.id}`)
  }

  return (
    <SubjectsView
      subjects={subjects}
      onSelectSubject={handleSelectSubject}
      onAddSubject={handleAddSubject}
    />
  )
}

export default SubjectsPage
