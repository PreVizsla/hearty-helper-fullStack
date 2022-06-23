import jwt from 'jsonwebtoken';

// wants to like a post
// click the like button => auth middleware()
// if middleware say yes, like controller...


const auth = async (req, res, next) => {
    try {
        //check if token valid
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if(token && isCustomAuth){
            //token and secret
            decodedData = jwt.verify(token, 'test');

            req.userId = decodedData ?.id;
        
        } else{
            //using gogoel Auth function
            decodedData = jwt.decode(token);
            req.userId = decodedData ?.sub;

        }
        next();
    } catch (error){
        console.log(error);
    }
}

export default auth;