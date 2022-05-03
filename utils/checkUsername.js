const checkUserName = async (model, username) => {
  if (await model.find({ username: username })) {
    return true;
  } else {
    return false;
  }
};

module.exports = checkUserName;
