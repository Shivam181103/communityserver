const mongoose = require('mongoose');

module.exports = async (server) => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("mongo connection successful..");

    // Listening to server
    await server.listen(process.env.PORT || 5000, () =>
      console.log(
        `server running on ${process.env.PORT} mode, port ${process.env.PORT}..`
      )
    );
  } catch (error) {
    console.log("mongo connection failed..".red);
    console.log(error);
    process.exit(1);
  }
};
