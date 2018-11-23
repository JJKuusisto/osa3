const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


morgan.token('body', function(req) {
   return JSON.stringify(req.body)
})
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))


let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Martti Tienari', number: '040-123456', id: 2 },
    { name: 'Arto Järvinen', number: '040-123456', id: 3 },
    { name: 'Lea Kutvonen', number: '040-123456', id: 4 }
]

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

app.get('/info', (request, response) =>{
   response.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generatedId = () => {
    return Math.floor(Math.random() * Math.floor(9999999999))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    const existsAlready = persons.some(person => person.name === body.name)

    if(body.name === undefined || body.name === '') {
        return response.status(400).json({error: 'nimi puuttuu'})
    }

    if(body.number === undefined || body.number === '') {
        return response.status(400).json({error: 'numero puuttuu'})
    }

    if(existsAlready){
        return response.status(400).json({error: 'nimi löytyy jo luettelosta'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generatedId()
    }

    persons = persons.concat(person)

    response.json(person)
    
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})