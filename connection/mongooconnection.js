const Mongoose = require('mongoose');
Mongoose.connect("mongodb://localhost:27017/test_hatsof", { 
  useNewUrlParser: true, 
  useFindAndModify: false, 
  autoIndex: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 10
});
var db = Mongoose.connection;
db.on("error", err  => {
  console.log("err", err);
});
db.on("connected", (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("mongoose is connected");
    }
});
db.on('disconnected', function(){
    console.log("Mongoose default connection is disconnected");
});
db.on("reconnected", () => {
  console.log("Connection Reestablished");
});
db.on("close", () => {
    console.log("Connection Closed");
});

process.on('SIGINT', async () => {
  await Mongoose.connection.close();
  process.exit(0)
})