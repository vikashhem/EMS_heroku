// let tokens = [];
let token;

const findToken = (element) => {
  element.forEach((x) => {
    // tokens.push(x.token);
    token = x.token;
  });
  return token;
};

module.exports = findToken;
