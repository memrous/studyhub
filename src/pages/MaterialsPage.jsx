import { useAppState } from '../context/AppStateContext'
import ResourcesView from '../components/ResourcesView'

const MaterialsPage = () => {
  const { resources, subjects, handleUploadResource } = useAppState()

  return (
    <ResourcesView
      resources={resources}
      subjects={subjects}
      onUploadResource={handleUploadResource}
    />
  )
}

export default MaterialsPage
