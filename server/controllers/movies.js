/* GET /movies/search */
const getMovies = async (req, res) => {
  const title = req.query.title ? `%${req.query.title}%` : "%";
  const year = req.query.year ? req.query.year : "%";
  
  if(req.query.year && !isValidYear(req.query.year)){
    res.status(400).json({
      "error": true,
      "message": "Invalid year format. Format must be yyyy."
    });
    return;
  }
  
  req.db
    .select("*").from("basics").where("primaryTitle", "like", title).where("year", "like", year)
    .then((rows) => {
      return rows;
    })
    .then((rows) => {
      if(!rows[0]){
        res.status(404).json({
          "error": true,
          "message": "No record found."
        });
      }

      const data=rows.map(
        ({
          primaryTitle,
          year,
          tconst,
          imdbRating,
          rottentomatoesRating,
          metacriticRating,
          rated,
        }) => ({
          title: primaryTitle,
          year,
          imdbID: tconst,
          imdbRating:imdbRating ? Number(imdbRating):null,
          rottentomatoesRating:rottentomatoesRating? Number(rottentomatoesRating):null,
          metacriticRating:metacriticRating?Number(metacriticRating):null,
          classification: rated,
        })
      )

      const pagination={
        total:data.length,
        lastPage:1,
        prevPage:null,
        nextPage:null,
        perPage:100,
        currentPage:req.query.page?Number(req.query.page):1,
        from:0,
        to:data.length
      }

      res.status(200).json({
        data,
        pagination
      });
    })
    .catch((e) => console.log(e));
};

/* GET /movies/data/{imdbID} */
const getMovieById = async (req, res) => {
  const imdbID=req.params.imdbID;

  req.db.select('*').from('basics').leftJoin('principals',function(){
    this.on('basics.tconst','=','principals.tconst')
  }).where('basics.tconst',imdbID)
  .then((rows)=>{
    if (!rows[0]) {
      res.status(404).json({
        error: true,
        "message": "No record exists of a movie with this ID"
      });
      return 
    }
    
    const {primaryTitle,year,runtimeMinutes,genres,country,boxoffice,poster, plot,imdbRating,rottentomatoesRating,metacriticRating} =rows[0];

    const ratings=[{
        source:"Internet Movie Database",
        value:Number(imdbRating)
      },
      { source:"Rotten Tomatoes",
        value:Number(rottentomatoesRating)
      },
      { source: "Metacritic",
        value:Number(metacriticRating)
      }]

    const principals=rows.map(({nconst,category,name,characters})=>{
      return {nconst,category,name,characters:characters ? eval(characters):[]};
    });
    
    res.status(200).json({
        title: primaryTitle,
        year,
        runtime:runtimeMinutes,
        genres:[genres],
        country,
        principals:principals,
        ratings:ratings,
        boxoffice: (boxoffice==0) ? null:boxoffice,
        poster,
        plot,
    })
  })
  .catch(e=>console.log(e))
};

function isValidYear(year){

  if (year.length!==4){
    return false;
  }

  if (!Number(year)){
    return false;
  }

  const validYears=Array(2024 - 1990)
  .fill()
  .map((_, i) => i + 1990);
  
  if(!validYears.includes(Number(year))){
    return false;
  }
  
  return true;
}

module.exports = {
  getMovieById,
  getMovies,
};
