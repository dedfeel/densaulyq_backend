let express = require('express')
let app = express()
let cors = require('cors')
let helmet = require('helmet')
const {PORT} = require('./config/env')
const authRoutes = require('./routes/authRoutes')

let corsOptions = {
    origin: 'https://densaulyq-backend.onrender.com',
    optionsSuccessStatus: 200
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet())

app.use('/api', authRoutes)

app.listen(PORT, ()=>{  
    console.log(`Server is working on ${PORT} port`);
})

