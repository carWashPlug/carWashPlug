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
  //MOBILE WORKERS IN SEPERATE ROOMS
  carwash.on('newWorker', (mobileWorker) => {
    console.log('SocketID:', carwash.id);
    console.log('creating new room for mobileWorker=>', mobileWorker);
    carwash.join(mobileWorker);
  });

  carwash.on('noWorkers', (message) => {
    console.log('No worker here YOOOO!', message);
  });

  carwash.on('in-progress', (carwashData) => {
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', carwashData);
    carwashData.status = 'in-progress';
    console.log('EVENT', carwashData);
    customer.to(carwashData.messageID).emit('carWashInProgress', carwashData);
    // customer.emit('carWashInProgress', carwashData);

  });

  carwash.on('Car-wash-complete', (carwashData) => {
    carwashData.status = 'Completed';
    console.log('EVENT', carwashData);
    customer.to(carwashData.messageID).emit('customerReceipt', carwashData);
    // customer.emit('customerReceipt', carwashData);
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
      customer.emit('carwashQueue', messageArry);
    }
  }

  customer.on('getAll', (customerName) => {
    getAll(customerName);
  });


  customer.on('carWashRequested', (data) => {
    customer.join(data.payload.customer); // 4949495858ikljl

    console.log('CUSTOMER SOCKET.id', customer.id);
    console.log('carWashQueue::', carwashQueue);
    // console.log('EVENT', data);
    carwash.emit('newJobForEmployee', data);
    customer.emit('driverInRoute');

  });

  customer.on('leaveRoom', (carName) => {
    console.log('customer', carName, 'left the room.');
    customer.leave(carName);
  });

});