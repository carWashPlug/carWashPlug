const socketIo = require('socket.io');
const io = socketIo(3000);

const customer = io.of('/customer');
const carwash = io.of('/carwash');

let carwashQueue = [];
let carQueue = [];


//  MAIN.IO >>>>>>>>
io.on('connection', (client) => {
  client.on('test', (data) => {
    console.log(' Yoooo!!');
  });
});

//CARWASH.IO>>>>>>>>>
carwash.on('connect', (carwash) => {

  carwash.on('newCar', (mobileWorker) => {
    console.log('SocketID:', carwash.id);
    console.log('creating new room for cars ', mobileWorker);

    carwash.join(mobileWorker);
  });

});


//  CUSTOMER.IO >>>>>>>>
customer.on('connect', (customer) => {
  function getAll(carName) {
    const nameType = [carName];
    let messageArry = [];
    nameType.forEach((n) => {
      carwashQueue.map(x => {
        if (x.payload.store === carName) {
          messageArry.push(x);
          carwashQueue.splice(carwashQueue.indexOf(x), 1);
        }
      });
    });
    if (messageArry.length > 0) {
      customer.emit('VendorQueue', messageArry);
    }
  }

  customer.on('getAll', (vendor) => {
    getAll(vendor);
  });

  customer.on('order', () => {
    // console.log('new order from', data);
    customer.emit('createOrder');
  });

  //JOINS ROOMS
  customer.on('newcarWash', (vehicle) => {
    // console.log('car names in app.js: ', carName);
    console.log('creating new room in app.js for ', vehicle);
    console.log('SocketID from app.js:', customer.id);
    customer.join(vehicle);
    // carwash.emit('createOrder', carName);
  });

  customer.on('carWashReady', (data) => {

    console.log('VENDOR QUEUE', carwashQueue);
    console.log('EVENT', data);




    // const driverName = Chance.pickone(['driver1', 'driver2', 'driver3']);
    // data.driverName = driverName;
    // carwash.to(driverName).emit('newOrderForDriver', data);

  });

  customer.on('leaveRoom', (carName) => {
    console.log('customer', carName, 'left the room.');
    customer.leave(carName);
  });

});