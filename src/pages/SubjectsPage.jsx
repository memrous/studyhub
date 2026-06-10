import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import SubjectsView from '../components/SubjectsView'
import PageState from '../components/PageState'

const SubjectsPage = () => {
  const navigate = useNavigate()
  const { subjects, handleAddSubject, isLoading, error, reloadData } = useAppState()

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
