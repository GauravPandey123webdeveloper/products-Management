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
    return true
    
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
function indianPrice(num){
    return /^[0-9]{1,3}(?:,?[0-9]{2,3})*(?:,[0-9]{3})*(?:\.[0-9]{1,2})?$/.test(num)

}
function sizesCheck(sizes) {
    const validSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
  
    if (!Array.isArray(sizes)) {
      return false; // Sizes should be an array
    }
  
    if (sizes.length < 1) {
      return false; // Sizes array should have at least one element
    }
  
    for (const size of sizes) {
      if (!validSizes.includes(size)) {
        return false; // Invalid size found in the array
      }
    }
  
    return true; // All sizes are valid
  } 

module.exports = { isValidObjectId,isValidData,indianPrice, validEmail, validMobile,validPassword,sizesCheck };