const fs = require('fs');
const url = require('url');
var admin = require('firebase-admin');
var serviceAccount = require('../key.json');
const Test = require('./../models/testingModel.js');

// const path = require('./../data/token.txt');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const content = 'Some content!';

exports.createToken = async (req, res) => {
  try {
    const Token = await Test.create(req.body);

    res.status(200).json({
      status: true,
      Token,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error,
    });
  }
};
exports.getAllTokens = async (req, res) => {
  try {
    const tokens = await Test.find();
    res.send(tokens);
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.sendNotification = async (req, res) => {
  const { query } = url.parse(req.url, true);
  const notification_options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };
  const options = notification_options;

  let textMessage = {
    notification: {
      title: `${query.name} sent a message`,
      body: `${query.message}`,
    },
    //     data: {
    //       type: `${query.type}`,
    //       url: `${query.message}`,
    //       sendFrom: `${query.name}`,
    //       timeStamp: `${query.timeStamp}`,
    //     },
  };
  //   let token;
  //   await Test.findOne(
  //     { name: new RegExp('^' + `${query.name}` + '$', 'i') },
  //     async function (err, doc) {
  //       token = await doc.token;
  //       console.log(token);
  //     }
  //   );

  //   console.log(token);

  //   const user = await Test.findOne(query.name);
  //   console.log(`This is user ${user}`);
  const registrationToken = query.token;
  //   console.log(`This is user ${user.token}`);

  if (registrationToken != null) {
    admin
      .messaging()
      .sendToDevice(registrationToken, textMessage, options)
      .then(() => {
        res.status(200).json({
          status: 'success',
          message: 'message sent',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else console.log('empty token');
};

// exports.savingData = async (req, res) => {
//   //   const stream = fs.createReadStream(`${__dirname}/token.json`);
//   //   stream.pipe(res);

//   //   const stream=JSON.parse( fs.createWriteStream(`${__dirname}/token.json`,'utf-8'));

//   // stream.pipe(res)

//   // This opens up the writeable stream to `output`
//   var writeStream = fs.createWriteStream(`${__dirname}/token.json`, 'utf-8');
//   writeStream.write(req.body);

//   // This pipes the POST data to the file
//   //   req.pipe(writeStream);

//   writeStream.on('error', function (err) {
//     console.log(err);
//   });
// };

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
