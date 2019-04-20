const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 8000;

app.use(morgan('dev'))

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})