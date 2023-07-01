const ObjectId = require('mongoose').Types.ObjectId;
function isValidObjectId(id){
    
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    
}
// Function to validate if a string is valid data
isValidData = function (a) {
    if (a === null || a === undefined) return false; // Check if the input is null or undefined
    if (typeof a !== 'string' || a.trim().length === 0) return false; // Check if the input is not a string or if it is an empty string after trimming
    return /^[A-Za-z\s]+$/.test(a) // Check if the input contains only letters or whitespace
    
};

// Function to validate an email address
validEmail = function (email) {
    return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email); // Check if the email matches the required pattern
};
//function to validate password
validPassword=function(password){
    if(!password){
        return false
    }
    const pass= password.replace(/\s/g, '');
    return /^[^\s]{8,15}$/.test(pass)
}
// Function to validate a mobile number
validMobile = function (mob) {
    if(!mob){
       return false
    }
    const trimmedMobile = mob.replace(/\s/g, ''); // Remove spaces from the mobile number
    return /^[0-9]{10}$/.test(trimmedMobile); // Check if the mobile number consists of exactly 10 digits
};

module.exports = { isValidObjectId,isValidData, validEmail, validMobile,validPassword };