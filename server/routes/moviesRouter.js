const express = require('express');
const {getMovies,getMovieById} =require('../controllers/movies')
const router=express.Router();


router.get('/search',getMovies);
router.get('/data/:imdbID',getMovieById);

module.exports = router;
