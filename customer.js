const { io } = require('socket.io-client');
const Chance = new require('chance')();
const customers = io('ws://localhost:3000/customer');

const customer = ['carWash1', 'carWash2'];

function setupCarwashPool() {
  customer.forEach((c) => {
    const customers = io('ws://localhost:3000/customer');
    customers.emit('newcarWash', c);
    customers.emit('getAll', c);
  });

  setInterval(() => {
    customers.emit('order');
  }, 10000);
}


function generateNewOrder() {
  customers.on('createOrder', (data) => {
    console.log('generateNewOrder was called!');

    const obj = {
      messageID: Chance.bb_pin(),
      status: 'arrived',
      time: Chance.date(),
      payload: {
        carWashType: Chance.pickone(['mobile', 'stationary']),
        carType: Chance.pickone(['Car', 'Truck', 'Jeep', 'Motorcycle']),
        orderID: Chance.string({ length: 7 }),
        customer: Chance.name({ nationality: 'en', middle: true }),
        address: Chance.address(),
        phoneNumber: Chance.phone(),

      },
    };
    customers.emit('carWashReady', obj);

  });
}

setupCarwashPool();
generateNewOrder();

