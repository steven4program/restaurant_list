const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json')

db.once('open', () => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err)
    if (restaurants.length) return
  })
  for (let i = 0; i < restaurantData.results.length; i++) {
    new Restaurant(restaurantData.results[i]).save()
  }
  console.log('Seed done')
})
