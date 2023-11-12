var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const jwt_key=process.env.JWT_KEY;

/* POST /user/register*/
const postUserRegister = async (req, res) => {
    const { email, password } = req.body;

    // see if both email and password are provided
    if (!email || !password) {
        res.status(400).json({
                error: true,
                message: "Request body incomplete, both email and password are required"
            })
        return;
    }

    // see if the user already exists in the table
    req.db.select('*').from('users').where('email',email)
    .then((user)=>{
        if(user.length>0){
            console.log('User already exists')
            res.status(409).json({
                error: true,
                message: "User already exists"
            })

            return;
        }
        //insert the user into the database
        const saltRounds=10;
        const hash = bcrypt.hashSync(password, saltRounds)
        console.log(hash)
        req.db.from("users").insert({ email:email,password:hash}).then(
            (q)=>{
                console.log(q)
            res.status(201).json({ 
                message: "User created"
            })  
        }

        );
    })
    .catch(e=>console.log(e))
};

/* POST /user/login*/
const postUserLogin = async (req, res) => {
    const { email, password } = req.body;
    
    // see if both email and password are provided
    if (!email || !password) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete, both email and password are required"
        })
        return;
    }

    req.db.select('*').from('users').where('email',email)
    .then((user)=>{
        console.log(user)
        if(user.length==0){
            res.status(401).json({
                error: true,
                message: "Incorrect email or password"
            })
            return;
        }
        return match=bcrypt.compare(password,user[0].password)
    })
    .then((match)=>{
        // incorrect password
        if (!match) {
            res.status(401).json({
                error: true, 
                message: "Incorrect email or password"
            })
            return;
        }
        //sign in
        const bearerExpiresInSeconds=req.body.bearerExpiresInSeconds || 600;
        const refreshExpiresInSeconds=req.body.refreshExpiresInSeconds || 86400;

        signJwtAndReturnRes(email,res,bearerExpiresInSeconds,refreshExpiresInSeconds);
        
    })
    .catch(e=>console.log(e))
    
};

/* POST /user/refresh*/
const postUserRefresh = async (req, res) => { 
    if (!req.body.refreshToken){
        res.status(400).json({
            "error": true,
            "message": "Request body incomplete, refresh token required"
        });
        return;
    }
    const token=req.body.refreshToken;

    jwt.verify(token,jwt_key,(err,authData)=>{
        //see if the token has expired
        if(err && err.name=='TokenExpiredError'){
            res.status(401).json({
                    "error": true,
                    "message": "JWT token has expired"
            });
            return;
        }
        if(err)
            return;
        //refresh token
        const {email}=authData
        signJwtAndReturnRes(email,res,600,86400);
        
    });
};

/* POST /user/logout*/
const postUserLogout = async (req, res) => { 
    if (!req.body.refreshToken){
        res.status(400).json({
            "error": true,
            "message": "Request body incomplete, refresh token required"
        });
        return;
    }
    const token=req.body.refreshToken;

    jwt.verify(token,jwt_key,(err,authData)=>{
        //see if the token has expired
        if(err && err.name=='TokenExpiredError'){
            res.status(401).json({
                    "error": true,
                    "message": "JWT token has expired"
            });
            return;
        }
    });

};


const getProfile = async (req, res) => {
    const email = req.url.split('/')[1];
    let isAuthorised=true;
    if(!req.headers.authorization){
        isAuthorised=false;
    }else{
        const splited = req.headers.authorization.split(' ');
    
        if(splited[0]!=='Bearer'){
            res.status(401).json({
                "error": true,
                "message": "Authorization header is malformed"
            })
            return
        }

        const token = splited[1];
    
        jwt.verify(token,jwt_key,(err,authData)=>{
            //see if the token has expired
            if(err && err.name=='TokenExpiredError'){
                res.status(401).json({
                        "error": true,
                        "message": "JWT token has expired"
                });
                return;
            }
            
            //see if the token fails verification
            if(err && err.name=='JsonWebTokenError'){
                res.status(401).json({
                    "error": true,
                    "message": "Invalid JWT token"
                });
                return;
            }
        });
    }

    req.db.select('*').from('users').where("email",email)
    .then((user)=>{
        if (!user[0]) {
            res.status(404).json({
                    error: true,
                    message: "User not found"
                });
            return;
        }

        let profile={
            email,
            firstName:user[0].firstName || null,
            lastName:user[0].lastName || null,
        }

        if(isAuthorised){
            profile.dob=user[0].dob||null;
            profile.address=user[0].address||null;
        }

        res.status(200).send(profile);
    })
    .catch(e=>console.log(e))

}

/* PUT /user/{email}/ */
const putProfile = async (req, res) => {
    //see if bad request
    
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const dob=req.body.dob;
    const address=req.body.address;

    if(!(firstName && lastName && dob && address)){
        res.status(400).json({
            error: true,
            message: "Request body incomplete: firstName, lastName, dob and address are required"
        });
        return;
    }

    if(!(typeof firstName ==='string' && typeof lastName ==='string'  && typeof dob ==='string'  && typeof address ==='string')){
        res.status(400).json({
            error: true,
            message: "Request body invalid: firstName, lastName, dob and address must be strings only"
        });
        return;
    }

    if(!isValidDate(dob)){
        res.status(400).json({
            error: true,
            message: "Invalid input: dob must be a real date in format YYYY-MM-DD"        
        });
        return;
    }


    const email = req.url.split('/')[1];

    console.log(email);

    await req.db.select('*').from('users').where('email',email)
    .then((user)=>{
        if (!user[0]) {
            res.status(404).json({
                    error: true,
                    message: "User not found"
                });
            return;
        }

        if(!req.headers.authorization){
            res.status(401).json({
                "error": true,
                "message": "Authorization header ('Bearer token') not found"
            })
            return
        }
    
        const splited = req.headers.authorization.split(' ');
    
        if(splited[0]!=='Bearer'){
            res.status(401).json({
                "error": true,
                "message": "Authorization header is malformed"
            })
            return
        }
    
        const token =splited[1];
    
        jwt.verify(token,jwt_key,(err,authData)=>{
            //see if the token has expired
            if(err && err.name=='TokenExpiredError'){
                res.status(401).json({
                        "error": true,
                        "message": "JWT token has expired"
                });
                return;
            }
            
            //see if the token fails verification
            if(err && err.name=='JsonWebTokenError'){
                res.status(401).json({
                    "error": true,
                    "message": "Invalid JWT token"
                });
                return;
            }
    
            console.log(err);
            
            if(authData.email!==email){
                res.status(403).json({
                    "error": true,
                    "message": "Forbidden"
                })
                return;
            }
            console.log('good')
        });
        
        req.db.from('users').where('email',email)
        .update({
            firstName: firstName,
            lastName: lastName,
            dob:dob,
            address:address
        })
        .then(()=>{
            res.status(200).json({
                email,
                firstName,
                lastName,
                dob,
                address
            })
        })
        .catch(e=>console.log(e))
      
        
    })
    .catch(e=>console.log(e))



}


/* check authentication */
const VerifyToken = (req, res, next) => {
    if(!req.headers.authorization){
            res.status(401).json({
                "error": true,
                "message": "Authorization header ('Bearer token') not found"
        })
        return
    }

    const token = req.headers.authorization.split(' ')[1];

    console.log(token)
    jwt.verify(token,jwt_key,(err,authData)=>{
        if(err && err.name=='TokenExpiredError'){
            res.status(401).json({
                    "error": true,
                    "message": "JWT token has expired"
                });
        return;
        }
        next();
    });
}

module.exports = {
    postUserRegister,
    postUserLogin,
    postUserRefresh,
    postUserLogout,
    getProfile,
    putProfile,
    VerifyToken,
};


const signJwtAndReturnRes=((email,res,bearerExpiresInSeconds,refreshExpiresInSeconds)=>{
    const bearerToken=jwt.sign(
        {email:email},
        jwt_key,
        {expiresIn:bearerExpiresInSeconds},
    )
    
    const refreshToken=jwt.sign(
        {email:email},
        jwt_key,
        {expiresIn:refreshExpiresInSeconds},
    )

    res.status(200).json({ 
        "bearerToken":{
            "token":bearerToken,
            "token_type": "Bearer",
            "expires_in": bearerExpiresInSeconds
        },
        "refreshToken":{
            "token": refreshToken,
            "token_type": "Refresh",
            "expires_in": refreshExpiresInSeconds
        }
    })
});


function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }
  