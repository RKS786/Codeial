const express = require('express');
const router = express.Router();

console.log('user router loaded');

const userController = require('../controllers/users_controller');

router.get('/profile', userController.profile);
module.exports = router;