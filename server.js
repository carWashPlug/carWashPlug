const socketIo = require('socket.io');
const io = socketIo(3000);
const Chance = new require('chance')();

const customer = io.of('/customer');
const employee = io.of('/employee');

let carwashQueue = [];
let carQueue = [];


//  MAIN.IO >>>>>>>>
io.on('connection', (client) => {
  client.on('test', (data) => {
    console.log(' Yoooo!!');
  });
});

//EMPLOYEE.IO NAMESPACE>>>>>>>>
employee.on('connect', (socket) => {
  // CONFIRMING NEW JOBS FROM EMPLOYEE
  socket.on('employeeAcceptedJob', (payload) => {
    console.log('SocketID for employee:', socket.id);
    console.log('creating new room for mobileWorker=>', payload.employee);
    socket.join(payload.employee); // CREATING NEW ROOMS FOR EMPLOYEES
    socket.emit('newJobByEmployeeConfirmed', (payload));
  });

  // STATUS UPDATE TO CUSTOMER - NO WORKERS AVAILABLE
  socket.on('noWorkers', (payload) => {
    console.log('No worker here YOOOO!', payload);
    carwashQueue.push(payload);
  });

  // STATUS UPDATE TO CUSTOMERS - IN-TRANSIT
  socket.on('in-transit', (payload) => {
    payload.status = 'in-transit';
    console.log('EVENT', payload);
    customer.to(payload.order.customer).emit('driverInRoute', payload);
  });

  // STATUS UPDATE TO CUSTOMERS - IN-PROGRESS
  socket.on('in-progress', (payload) => {
    payload.status = 'in-progress';
    console.log('EVENT', payload);
    customer.to(payload.order.customer).emit('carWashInProgress', payload);
  });

  // STATUS UPDATE TO CUSTOMER - COMPLETE
  socket.on('complete', (payload) => {
    payload.status = 'Completed';
    console.log('EVENT', payload);
    customer.to(payload.order.customer).emit('customerReceipt', payload);
  });
});


//CUSTOMER.IO NAMESPACE >>>>>>>>
customer.on('connect', (socket) => {

  // socket.on('getAll', (payload) => {
  //   getAll(payload, socket);
  // });

  // GETTING INITIAL PAYLOAD FROM CUSTOMER AND SENDING TO EMPLOYEE
  socket.on('carWashRequested', (payload) => {
    socket.join(payload.order.customer);
    console.log('SocketID for customer: ', socket.id);
    console.log('carWashQueue:', carwashQueue);
    employee.emit('newJobForEmployee', payload); // send payload to employees
  });

  socket.on('leaveRoom', (carName) => {
    console.log('customer', carName, 'left the room.');
    socket.leave(carName);
  });

});

// function getAll(name, socket) {
//   // const nameType = [name];
//   console.log(`GET ALL FUNCTION- name: ${name}, socket: ${socket.id}`);
//   let messageArray = [];
//   // name.forEach((n) => {
//   carwashQueue.map(index => {
//     if (index.order.customer === name) {
//       messageArray.push(index);
//       carwashQueue.splice(carwashQueue.indexOf(index), 1);
//     }
//   });
//   // });
//   if (messageArray.length > 0) {
//     socket.emit('carwashQueue', messageArray);
//   }
// }