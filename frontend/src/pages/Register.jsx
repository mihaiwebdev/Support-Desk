import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {FaUser} from 'react-icons/fa'
import {useSelector, useDispatch} from 'react-redux'
import {register, reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    })

    const {name, email, password, password2} = formData

    const dispatch = useDispatch()
    
    const navigate = useNavigate()

    const {user, isError, isLoading, isSuccess, message} = 
    useSelector(state => state.auth)

    useEffect(() => { 

        if (isError) {
            toast.error(message)
        }

        // Redirect when logged in
        if (isSuccess || user) {
            navigate('/')
        }

        dispatch(reset())

    }, [isError, isSuccess, user, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (password !== password2) {
            toast.error('passwords do not match');
        } else {
            const userData = {
                name, 
                email, 
                password
            }

            dispatch(register(userData))
        }
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
            <section className='heading'>
                <h1>
                    <FaUser /> Register
                </h1>
                <p>Please create an account</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input type="text" className='form-control' id='name'
                               value={name} onChange={onChange} required
                               name='name' placeholder='Enter your name'
                        />
                    </div>
                    <div className="form-group">
                        <input type="email" className='form-control' id='email'
                               value={email} onChange={onChange} required
                               name='email' placeholder='Enter your email'
                        />
                    </div>
                    <div className="form-group">
                        <input type="password" className='form-control' id='password'
                               value={password} onChange={onChange} required
                               name='password' placeholder='Enter your password'
                        />
                    </div>
                    <div className="form-group">
                        <input type="password" className='form-control' id='password2'
                               value={password2} onChange={onChange} required
                               name='password2' placeholder='Confirm password'
                        />
                    </div>
                    <div className="form-group">
                        <button className='btn btn-block'>
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register
