const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


morgan.token('body', function(req) {
   return JSON.stringify(req.body)
})
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))


let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Martti Tienari', number: '040-123456', id: 2 },
    { name: 'Arto Järvinen', number: '040-123456', id: 3 },
    { name: 'Lea Kutvonen', number: '040-123456', id: 4 }
]

app.get('/api/persons', (request, response) =>{
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(Person.format))
        })
})

app.get('/info', (request, response) =>{
   response.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(Person.format(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
        })

})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id'})
        })
})

const generatedId = () => {
    return Math.floor(Math.random() * Math.floor(9999999999))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    



    if(body.name === undefined || body.name === '') {
        return response.status(400).json({error: 'nimi puuttuu'})
    }

    if(body.number === undefined || body.number === '') {
        return response.status(400).json({error: 'numero puuttuu'})
    }

    Person
        .find({name: body.name})
        .then(result =>{
            console.log(result)
            if(result.length === 0){
                const person = new Person({
                    name: body.name,
                    number: body.number,
                    id: generatedId()
                })
            
            
            
                person  
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                    })
            } else {
                return response.status(400).json({error: 'nimi löytyy jo luettelosta'})
            }
        })



    
    
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person
        .findByIdAndUpdate(request.params.id, person, {new:true})
        .then(updatedNumber => {
            response.json(Person.format(updatedNumber))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: ' malformatted id'})
        })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})