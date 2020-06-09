const cluster = require('cluster'),
    os = require('os');

function startWorker() {

    var worker = cluster.fork();
    console.log(`CLUSTER: Worker ${worker.id} on process-pid ${process.pid} started`);
}


if (cluster.isMaster) {

    os.cpus().forEach(() => startWorker());

    //@ log any worker that disconnects; if a worker disconnects
    //@ it should then exit, so we'll wait for the exit event to spawn
    //@ a new worker to replace it
    cluster.on('disconnect', function (worker) {
        console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster`);
    });

    //@ when a worker dies, create a new worker to replace it
    cluster.on('exit', function (worker, code, signal) {
        console.log(`CLUSTER: Worker ${worker.id} died with exit code ${code} and signal ${signal}`);
        startWorker();
    });
} else {
    //@ start application on worker
    require('./server.js')();
}
