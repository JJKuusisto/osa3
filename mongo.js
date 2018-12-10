const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
  }

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if(process.argv.length < 3){
    console.log('puhelinluettelo:')
    Person
        .find({})
        .then(persons=> {
            persons.forEach(person => {
                console.log(person.name + ' ' + person.number)
              })
            mongoose.connection.close()
  })
    } else {
        const person = new Person({
            name: process.argv[2],
            number: process.argv[3]
        })

        person
            .save()
            .then(result => {
                console.log('lisätään henkilö ' + process.argv[2] + ' numero ' + process.argv[3] + ' luetteloon')
                mongoose.connection.close()
            })
            
    }
       
