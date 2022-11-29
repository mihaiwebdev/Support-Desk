import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import noteService from './noteService'
import { extractErrorMessage } from '../../utils'

const initialState = {
    notes: null,
    
}

// get ticket notes
export const getNotes = createAsyncThunk('notes/getAll',
 async (ticketId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await noteService.getNotes(ticketId, token)
    } catch (error) {

        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
})

// create a ticket note
export const createNote = createAsyncThunk('notes/create',
 async ({ noteText, ticketId }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await noteService.createNote(noteText, ticketId, token)
    } catch (error) {
        
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
})


export const noteSlice = createSlice({
    name: 'note',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(getNotes.pending, (state) => {
            // NOTE: reset notes to null on pending so we can show a Spinner while
            // fetching notes
            state.notes = null
          })
          .addCase(getNotes.fulfilled, (state, action) => {
            // NOTE: even if there are no notes for the ticket we get an empty
            // array, so we can use this to detect if we have notes or are fetching
            // notes. Payload will be an array of notes or an empty array, either
            // means we have finished fetching the notes.
            state.notes = action.payload
          })
          .addCase(createNote.fulfilled, (state, action) => {
            state.notes.push(action.payload)
          })
    }
})

export const { reset } = noteSlice.actions 
export default noteSlice.reducer 