const fs = require('fs');
const url = require('url');
var admin = require('firebase-admin');
var serviceAccount = require('../key.json');
const Test = require('./../models/testingModel.js');

// const path = require('./../data/token.txt');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.testingMulter = (req, res) => {
  const data = JSON.stringify(req.body);
  // fs.writeFile('./token.json', data, (err) => {
  //   if (err) {
  //     console.log('Error writing file', err);
  //   } else {
  //     console.log('Successfully wrote file');
  //   }
  //   res.send(req.body);
  // });
const data = JSON.stringify(req.body);
  jsonReader('./customer.json', (err, customer) => {
    if (err) {
      console.log('Error reading file:', err);
      return;
    }
    // increase customer order count by 1
    customer.order_count += 1;
    fs.writeFile('./customer.json', JSON.stringify(customer), (err) => {
      if (err) console.log('Error writing file:', err);
    });
  });
};

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
