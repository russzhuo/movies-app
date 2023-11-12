/* GET /people/{id} */
const getPersonById = async (req, res) => {
    const id = req.params.id;
    req.db.select(
            "name",
            "principals.tconst",
            "birthYear",
            "deathYear",
            "primaryTitle",
            "category",
            "characters",
            "imdbRating")
        .from("basics")
        .join("principals", "principals.tconst", "=", "basics.tconst")
        .join("names", "principals.nconst", "=", "names.nconst")
        .where("principals.nconst", id)
        .then((rows) => {
            if (!rows[0]) {
                res.status(404).json({
                        error: true,
                        message: "No record exists of a person with this ID",
                    });
                return;
            }

            const { name, birthYear, deathYear } = rows[0];

            const roles = rows.map(
                ({ tconst, primaryTitle, category, characters, imdbRating }) => {
                    return {
                        movieName: primaryTitle,
                        movieId: tconst,
                        category,
                        characters: characters ? eval(characters) : [],
                        imdbRating: imdbRating? Number(imdbRating):null,
                    };
                }
            );

            res.status(200).json({
                name,
                birthYear,
                deathYear,
                roles,
            });
        })
        .catch((e) => console.log(e));
};


module.exports = {
    getPersonById,
};
