const express = require('express');
const UserController = require('./users.controller');

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/users', UserController.createUser);
        this.router.get('/users', UserController.getAllUsers); 
        this.router.get('/users/:id', UserController.getUserById); 
        this.router.put('/users/:id', UserController.updateUser); 
        this.router.delete('/users/:id', UserController.deleteUser); 
        this.router.post('/users/authenticate', UserController.authenticateUser);
    }
}

module.exports = new UserRoutes().router;