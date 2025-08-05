let express = require('express')
let app = express()
let cors = require('cors')
let helmet = require('helmet')
const {PORT} = require('./config/env')
const authRoutes = require('./routes/authRoutes')

let corsOptions = {
    origin: 'https://courageous-pithivier-ef9542.netlify.app',
    optionsSuccessStatus: 200
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet())

app.use('/api', authRoutes)

app.listen(PORT, ()=>{  
    console.log(`Server is working on ${PORT} port`);
})

