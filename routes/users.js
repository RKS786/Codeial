const express = require('express');
const router = express.Router();

console.log('user router loaded');

const userController = require('../controllers/users_controller');
const passport = require('../config/passport-local-strategy');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);

router.post('/create', userController.create);

router.post('/create-session', passport.authenticate('local', {failureRedirect: '/users/sign-in'}), userController.createSession);
router.get('/sign-out', userController.destroySession);

module.exports = router;