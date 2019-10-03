//keys.js - determine which environment keys to return

if(process.env.NODE_ENV === 'production'){
    // we are in production - return prod key set
    module.exports = require('./prod');
}else{
    // we are in dev environment return dev set keys
    module.exports = require('./dev');
}