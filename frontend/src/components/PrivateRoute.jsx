import { Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

//  NOTE: no need for useAuthStatus as it's a duplicate of Redux state and only used here
//  NOTE: remove the spinner because no req is made to the back end to authenticate the user 
//  Note: no need for outlet as we are not using neste routes anymore


const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth)

    if (user) return children 

    return  <Navigate to='/login' />
}

export default PrivateRoute
