const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant_list')

const db = mongoose.connection

db.on('error', (err) => {
  console.error('MongoDB error : ' + err.message)
  process.exit(1)
})

db.once('open', () => {
  console.log('MongoDB connection established')
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err)
    if (restaurants.length) return
  })
  for (let i = 0; i < restaurantData.results.length; i++) {
    new Restaurant(restaurantData.results[i]).save()
  }
  console.log('Seed done')
})
