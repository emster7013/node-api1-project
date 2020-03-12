// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express(); //server object

server.listen(4000, ()=>{
    console.log('listening on port 4000');
});

server.use(express.json());


// just to show something on my screen
server.get('/', (request, response) => {
    response.send('Hello World...');
});
//Start your CRUD here now

//post create a user using information sent to the request body
server.post('/api/users', (req, res) => {
    const dbuser = req.body
    console.log(dbuser);
    db.insert(dbuser)
    .then(user => {
        if(req.body.name === '' || req.body.bio === '') {
            res.status(400).json({errorMessage: "Please provide name and bio for the user."})
        }
        res.status(201).json(user)
    })
    .catch(err =>{
        res.status(500).json({errorMessage: "There was an error while saving the user to the database"})
    })
})

//GET returns array of users, returns the user object with id

server.get('/api/users', (req, res) =>{
    db.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
        res.status(500).json({errorMessage: "The users information could not be retrieved." })
    });
});

server.get('/api/users/:id', (req, res) =>{
    const {id} = req.params;
    db.findById(id)
    .then(data => {
        if(data) 
        res.status(200).json(data)
        else{
        res.status(404).json({success: false, message: "The user with the specified ID does not exist."})
        }
    })
    .catch(err => {res.status(500).json({success: false, errorMessage: 'The user information could not be retrieved'})
});
});


//delete a user by id

//Works now!!
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
    .then( user => {
        if(!id){
            res.status(404).json({message: "The user with the specified ID does not exist." })
        }
        else {
            db.remove(id)
            .then(deleted => {
                res.status(200).json(deleted)
            })
        }
    })
    .catch(err => {
        res.status(500).json({errorMessage: "The user could not be removed"})
    })
})

//put updates the user with specified 'id'
//need to still create a put