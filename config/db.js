const mongoose = require("mongoose");

function connectDB() {
	const uri = "mongodb://localhost:27017/amazon-but-classier";
	mongoose.connect(uri, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		}).catch((error) => console.log(error));
    // const connection = mongoose.connection;
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
}

module.exports = connectDB;
