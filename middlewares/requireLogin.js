module.exports = (request, response, next) => {
    if(!request.user){
        return response.status(401).send({ error: 'You must Log In!'});
    }

    next();
};