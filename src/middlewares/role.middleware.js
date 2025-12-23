
//Check User Role
function roleMiddleware(...roles){


  return (request,response,next)=>{
    const userRole = request.user.role;
    if(!userRole){
      return response.status(401).json({message:"Unauthorized"})
    }
   const isExist =  roles.includes(userRole);
    if(!isExist){
      return response.status(403).json({message:"Access Denied ! "})
    }
    next();
  }
}

module.exports={roleMiddleware};