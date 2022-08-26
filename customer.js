const { io } = require('socket.io-client');
const Chance = new require('chance')();
const customers = io('ws://localhost:3000/customer');


//GENERATES NEW ORDER>>>>>>
function generateNewOrder() {
  const customers = io('ws://localhost:3000/customer');
  const newOrder = {
    messageID: Chance.bb_pin(),
    status: '',
    time: Chance.date(),
    payload: {
      carWashType: Chance.pickone(['standard', 'premium']),
      carType: Chance.pickone(['Car', 'Truck', 'Jeep', 'Motorcycle']),
      orderID: Chance.string({ length: 7 }),
      customer: Chance.name({ nationality: 'en', middle: true }),
      address: Chance.address(),
      phoneNumber: Chance.phone(),
    },
  };

  customers.emit('carWashRequested', newOrder);
  customers.emit('getAll', newOrder.customer);

  //DRIVER HEADING TO CUSTOMER>>>>>>
  customers.on('driverInRoute', () => {
    console.log('Driver in route!');
  });

  //CAR WASH IN-PROGRESS>>>>>>
  customers.on('carWashInProgress', (jobOrder) => {
    console.log('Your order', jobOrder.payload.orderID, 'is in progress');
  });

  //THANK YOU CUSTOMER>>>>>>
  customers.on('customerReceipt', (jobOrder) => {
    console.log('Your order', jobOrder.payload.orderID, 'has been delivered');
  });
}




setInterval(() => {
  generateNewOrder();
}, 4000);


// setupCarwashPool();

