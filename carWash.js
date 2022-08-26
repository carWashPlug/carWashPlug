const { io } = require('socket.io-client');
const Chance = new require('chance')();
// const player = require('play-sound');
const play = require('audio-play');
const load = require('audio-loader');
const carwash = io('ws://localhost:3000/carwash');
// const carwash;


// function setUpCarPool() {
//   const mobileWorkerAvailable = ['Berry', 'Clark', 'Bruce', 'Pedro'];
//   const mobileWorkerOnJobs = [];
//   // while (mobileWorkerAvailable.length != mobileWorkerOnJobs.length) {
//   //   console.log('while loop running.....');
//   mobileWorkerAvailable.forEach((W) => {
//     const carwash = io('ws://localhost:3000/carwash');
//     if (mobileWorkerAvailable.length === mobileWorkerOnJobs) {
//       carwash.emit('noWorkers');
//       console.log('no worker available!');
//     } else {
//       console.log('D in setUpCarPool: ', W);
//       mobileWorkerOnJobs.push(W);
//       carwash.emit('newWorker', W);
//       carwash.emit('getAll', W);
//       console.log('mobileWorkerAvailable: ', mobileWorkerAvailable.length);
//     }
//     carwash.on('newJobForEmployee', (data) => {
//       // data.status = 'in-transit';
//       setNewTime(data);
//       console.log(' picked up order: ', data.payload.orderID);
//       console.log('employee socket.id: ', carwash.id);

//     setTimeout(() => {
//       // data.status = 'in-progress';
//       setNewTime(data);
//       carwash.emit('in-progress', data);
//       console.log(' Washing in-progress, order: ', data.payload.orderID);
//     }, 1500);

//     setTimeout(() => {
//       // data.status = 'complete';
//       setNewTime(data);
//       carwash.emit('Car-wash-completed', data);
//       console.log('Car-wash-completed', data.payload.orderID);
//       mobileWorkerOnJobs.shift();
//     }, 2500);
//   });

// });
// }

function setUpCarPool() {
  const mobileWorkerAvailable = ['Berry', 'Clark', 'Bruce', 'Pedro'];
  const mobileWorkerOnJobs = [];
  carwash.on('newJobForEmployee', (data) => {
    mobileWorkerAvailable.forEach((W) => {
      const carwash = io('ws://localhost:3000/carwash');
      if (mobileWorkerAvailable.length === mobileWorkerOnJobs) {
        carwash.emit('noWorkers');
        console.log('no worker available!');
      } else {
        console.log('D in setUpCarPool: ', W);
        mobileWorkerOnJobs.push(W);
        carwash.emit('newWorker', W);
        carwash.emit('getAll', W);
        console.log('mobileWorkerAvailable: ', mobileWorkerAvailable.length);
      }
    });
    setNewTime(data);
    console.log(' picked up order: ', data.payload.orderID);
    // console.log('employee socket.id: ', carwash.id);

    setTimeout(() => {
      setNewTime(data);
      carwash.emit('in-progress', data);
      console.log(' Washing in-progress, order: ', data.payload.orderID);
    }, 1500);

    setTimeout(() => {
      setNewTime(data);
      carwash.emit('Car-wash-completed', data);
      console.log('Car-wash-completed', data.payload.orderID);
      mobileWorkerOnJobs.shift();
    }, 2500);
  });
}

// function playMusic() {
//   console.log('playMusic was called');
//   load('./song.mp3').then(play);
//   player.play('/song.mp3', (err) => {
//     console.log('playMusic was called inside the play method');
//     if (err) throw err;
//   });
// }

function setNewTime(params) {
  params.time = Chance.date();
  return params;
}

setUpCarPool();
// playMusic();