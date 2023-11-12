const express = require('express');
const {    
    postUserRegister,
    postUserLogin,
    postUserRefresh,
    postUserLogout,
    getProfile,
    putProfile
}=require('../controllers/authentication')

const router=express.Router();

router.post('/register',postUserRegister);
router.post('/login',postUserLogin);
router.post('/refresh',postUserRefresh);
router.post('/logout',postUserLogout);
router.get('/:email/profile',getProfile)
router.put('/:email/profile',putProfile);



module.exports = router;
