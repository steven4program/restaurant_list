const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')

mongoose.connect('mongodb://localhost/restaurant_list')

const db = mongoose.connection

db.on('error', (err) => {
  console.error('MongoDB error:' + err.message)
  process.exit(1)
})

db.once('open', () => {
  console.log('MongoDB connection established')
})

const port = process.env.PORT || 3000

// express template engine
app.engine('.hbs', engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')

// setting static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  try {
    // get all restaurants data
    const restaurants = Restaurant.find().lean()
    res.render('index', { restaurants })
  } catch (err) {
    console.error(err)
  }
})

app.get('/search', async (req, res) => {
  const { keyword } = req.query
  try {
    // search by name or category
    const restaurants = await Restaurant.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    }).lean()

    // show alert when result is empty
    let emptyResult = false
    if (restaurants.length === 0) {
      emptyResult = true
    }

    res.render('index', { restaurants, keyword, emptyResult })
  } catch (err) {
    console.error(err)
  }
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params
  const restaurant = restaurantsData.results.find(
    (restaurant) => restaurant_id === restaurant.id.toString()
  )
  res.render('show', { restaurant })
})

app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - Not Found')
})

app.use((err, req, res, next) => {
  res.type('text/plain')
  res.status(500)
  res.send('500 - Server Error')
})

app.listen(port, () => {
  console.log(
    `App is running on http://localhost:${port};` +
      ` press Ctrl-C to terminate.`
  )
})
