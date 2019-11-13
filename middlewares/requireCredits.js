module.exports = (request, response, next) => {
    if(!request.user.credits < 1){
        return response.status(403).send({ error: 'Not enough Credits!'});
    }

    next();
};