const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant_list')

const db = mongoose.connection

db.on('error', (err) => {
  console.error('MongoDB error:' + err.message)
  process.exit(1)
})

db.once('open', () => {
  console.log('MongoDB connection established')
})
