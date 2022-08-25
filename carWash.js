const { io } = require('socket.io-client');
const Chance = new require('chance')();


function setUpCarPool() {

  const mobileWorker = ['Berry', 'Clark', 'Bruce', 'Pedro'];
  mobileWorker.forEach((W) => {
    const carwash = io('ws://localhost:3000/carwash');
    carwash.emit('newCar', W);
    carwash.emit('getAll', W);
    console.log('D in setUpCarPool: ', W);

    carwash.on('newOrderForDriver', (data) => {
      setNewTime(data);
      console.log(data.driverName, ' picked up ', data.payload.orderID);
      setTimeout(() => {
        carwash.emit('inTransit', data);
      }, 1000);

      setNewTime(data);

      setTimeout(() => {
        carwash.emit('Car-wash-completed', data);
      }, 1500); // this previously said 'delivered'.

      setTimeout(() => {
        console.log('Car-wash-completed', data.payload.orderID); // this previously said 'delivered'.
      }, 2500);
    });

    carwash.on('DriverQueue', (data) => {
      console.log(data[0].driverName, 'delivered order(s)', data);

    });

  });
}

function setNewTime(params) {
  params.time = Chance.date();
  return params;
}
setUpCarPool();