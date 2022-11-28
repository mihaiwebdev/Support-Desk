//  import express
const path = require('path')
const express =require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 8000

// connect to database
connectDB()

// initialize server
const app = express()

// allow to send raw json
app.use(express.json())
// accept url encoded form
app.use(express.urlencoded({extended: false}))

// routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
    // Set build folder as static
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => res.sendFile(__dirname, '../', 'frontend', 'build', 'index.html'))

} else {

    app.get('/', (req, res) => {
        res.status(200).json({message: 'Welcome to the Support Desk API'})
    })
}

app.use(errorHandler)
app.listen(PORT, () => console.log(`listening to port ${PORT}`))