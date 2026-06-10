import { useAuth } from '../context/AuthContext'
import Profile from '../components/Profile'

const ProfilePage = () => {
  const { authUser } = useAuth()

  return <Profile user={authUser} />
}

export default ProfilePage
