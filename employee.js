const { io } = require('socket.io-client');
const Chance = new require('chance')();
// const player = require('play-sound');
// const play = require('audio-play');
// const load = require('audio-loader');
const employee = io('ws://localhost:3000/employee');
// const carwash;


function setUpCarPool() {
  const mobileWorkerAvailable = ['Berry', 'Clark', 'Bruce', 'Pedro'];
  const mobileWorkerOnJobs = [];
  const jobQueue = []; 
  // while (mobileWorkerAvailable.length != mobileWorkerOnJobs.length) {
  //   console.log('while loop running.....');
  employee.on('newJobForEmployee', (payload) => {
    const socket = io('ws://localhost:3000/employee');
    console.log('workers available: ', mobileWorkerAvailable.length);
    if (mobileWorkerAvailable.length === 0) {
      socket.emit('noWorkers', payload);
      console.log('no worker available!');
      jobQueue.unshift(payload);
    } else if (jobQueue.length > 0 && mobileWorkerAvailable.length > 1) {
      let payloadInJobQueue = jobQueue.pop();
      let worker = mobileWorkerAvailable.pop();
      mobileWorkerOnJobs.push(worker);
      payloadInJobQueue.employee = worker;
      socket.emit('employeeAcceptedJob', payloadInJobQueue);
      // socket.emit('getAll', payload);
    } else {
      let worker = mobileWorkerAvailable.pop();
      mobileWorkerOnJobs.push(worker);
      payload.employee = worker;
      // console.log('Payload that employee received: ', data);
      socket.emit('employeeAcceptedJob', payload);
      socket.emit('getAll', payload);
    }
    // IN_TRANSIT
    socket.on('newJobByEmployeeConfirmed', (payload) => {
      // data.status = 'in-transit';
      setNewTime(payload);
      console.log(payload.employee, 'picked up order: ', payload.order.orderID);
      // console.log('employee socket.id: ', carwash.id);

      setTimeout(() => {
        socket.emit('in-transit', payload);
        console.log(payload.employee,'is in-transit for job: ', payload.order.orderID);
      }, 1000);

      // JOB IN PROGRESS
      setTimeout(() => {
        // data.status = 'in-progress';
        setNewTime(payload);
        socket.emit('in-progress', payload);
        console.log(' Washing in-progress, order: ', payload.order.orderID);
      }, 7000);

      // JOB COMPLETED
      setTimeout(() => {
        // data.status = 'complete';
        setNewTime(payload);
        payload.status = 'complete';
        socket.emit('complete', payload);
        console.log(payload.employee,' finished job: ', payload.order.orderID);
        let workerWithoutJob = mobileWorkerOnJobs.shift();
        mobileWorkerAvailable.unshift(workerWithoutJob);
      }, 10000);
    });

  });
};

function setNewTime(params) {
  params.time = Chance.date();
  return params;
}

setUpCarPool();
