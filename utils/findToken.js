

exports.findToken=(user)=>{
    const token;
  user.forEach((element) => {
      token = element.token;
    });
    return token;
};