let express = require('express')
const {login, register, profile, clinic, updateProfile, deleteProfile } = require('../controllers/authControllers')
const { loginLimited, authenticateToken } = require('../middleware/authMiddleware')


let router = express.Router()


router.post('/login',loginLimited, login)

router.post('/register',loginLimited, register)

router.get('/profile',authenticateToken, profile)

router.get('/clinic', clinic)

router.put('/profile', authenticateToken, updateProfile)
router.delete('/profile', authenticateToken, deleteProfile)

module.exports = router