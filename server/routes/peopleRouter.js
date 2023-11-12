const express = require('express');
const { getPersonById } = require('../controllers/people');
const {VerifyToken} = require('../controllers/authentication');

const router=express.Router();

router.get('/:id',VerifyToken,getPersonById);


module.exports = router;
