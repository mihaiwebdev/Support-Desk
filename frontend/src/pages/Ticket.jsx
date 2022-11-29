import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { FaPlus } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { getTicket, closeTicket} from '../features/tickets/ticketSlice' 
import { getNotes, createNote} from '../features/notes/noteSlice'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'


const customStyles = {
    content: {
        width: '600px',
        top: '50%',
        left: '50%',
        bottom: 'auto',
        right: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        position: 'relative',
    },
}

Modal.setAppElement('#root')

const Ticket = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [noteText, setNoteText] = useState('')

    const { ticket } = useSelector((state) => state.tickets)
    const { notes } = useSelector((state) => state.notes)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { ticketId } = useParams()

    useEffect(() => {

        dispatch(getTicket(ticketId)).unwrap().catch(toast.error)
        dispatch(getNotes(ticketId)).unwrap().catch(toast.error)

    }, [ticketId, dispatch])

    const onTicketClose = () => {
        // NOTE: we can unwrap our AsyncThunkACtion here so no need for isError and
        // isSuccess state
        dispatch(closeTicket(ticketId)).unwrap().then(() => {
            toast.success('Ticket Closed')
            navigate('/tickets')
          })
          .catch(toast.error)
      }

   
    const onNoteSubmit = (e) => {
        // NOTE: we can unwrap our AsyncThunkACtion here so no need for isError and
        // isSuccess state
        e.preventDefault()
        
        dispatch(createNote({ noteText, ticketId })).unwrap().then(() => {
            setNoteText('')
            closeModal()
        })
        .catch(toast.error)
    }


    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    if (!ticket) {
        return <Spinner />
    }

    return (
        <div className='ticket-page'>
            <header className="ticket-header">
                <BackButton url='/tickets' />
                <h2>Ticket ID: {ticket._id}
                    <span className={`status status-${ticket.status}`}>{ticket.status}</span>
                </h2> 
                <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}</h3>
                <h3>Product: {ticket.product}</h3>
                <hr />
                <div className="ticket-desc">
                    <h3>Description of Issue</h3>
                    <p>{ticket.description}</p>
                </div>
                <h2>Notes</h2>
            </header>

            {ticket.stauts !== 'closed' && (
                <button className="btn" onClick={openModal}><FaPlus /> Add Note</button>
            )}

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
            style={customStyles} contentLabel='Add Note' >
                <h2>Add Note</h2>
                <button className="btn-close" onClick={closeModal}>X</button>
                <form onSubmit={onNoteSubmit}>
                    <div className="form-group">
                        <textarea name="noteText" id="noteText" className='form-control'
                         placeholder='Note Text' value={noteText}
                         onChange={(e) => setNoteText(e.target.value)}>  
                        </textarea>
                    </div>
                    <div className="form-group">
                        <button className="btn" type="submit">Submit</button>
                    </div>
                </form>
            </Modal>

            {notes ? (notes.map((note) => <NoteItem key={note._id} note={note} />)) :
             (<Spinner />)
            }

            {ticket.status !== 'closed' && (
                <button className="btn btn-block btn-danger" onClick={onTicketClose}>
                    Close Ticket
                </button>
            )}
        </div>
    )
}

export default Ticket
