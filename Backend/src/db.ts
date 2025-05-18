import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/gardenerApp')
  .then(() => {
    console.log('Sikeres kapcsolódás a mongoose-hoz!'); // Successful connection to Mongoose!
  })
  .catch((err: Error) => { // Explicitly type 'err' as Error
    console.log('Kapcsolat megszakadt hiba miatt: ' + err.message); // Connection interrupted due to error:
    process.exit(1); // It's good practice to exit the process on a critical connection error
  });

// While you can export mongoose, typically for a connection file,
// you might just let the connection happen and then other files import models.
// However, to match the original JS 'module.exports = mongoose;', we'll export it.
export default mongoose;