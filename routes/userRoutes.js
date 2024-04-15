const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')





router.patch('/changePassword', authController.protect, authController.changePassword)
router.post('/signup', authController.signup)
router.post('/login', authController.login)
module.exports = router;
