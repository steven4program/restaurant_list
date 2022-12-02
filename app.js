const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const mongoose = require('mongoose')
const restaurant = require('./models/restaurant')
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
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  try {
    // get all restaurants data
    const restaurants = await Restaurant.find().lean()
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

// get to restaurant-adding page
app.get('/restaurants/new', (req, res) => {
  try {
    res.render('new')
  } catch (err) {
    console.error(err)
  }
})

// create a new restaurant
app.post('/restaurants', async (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  } = req.body

  try {
    await Restaurant.create({
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    })
    res.redirect('/')
  } catch (err) {
    console.error(err)
  }
})

// get to edit page
app.get('/restaurants/:_id/edit', async (req, res) => {
  const { _id } = req.params
  try {
    const restaurant = await Restaurant.findOne({ _id }).lean()
    res.render('edit', { restaurant })
  } catch (err) {
    console.error(err)
  }
})

// edit restaurant
app.post('/restaurants/:_id/edit', async (req, res) => {
  const { _id } = req.params
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  } = req.body

  try {
    const restaurant = await Restaurant.findOne({ _id })
    restaurant.name = name
    restaurant.name_en = name_en
    restaurant.category = category
    restaurant.image = image
    restaurant.location = location
    restaurant.phone = phone
    restaurant.google_map = google_map
    restaurant.rating = rating
    restaurant.description = description

    await restaurant.save()
    res.redirect(`/restaurants/${_id}`)
  } catch (err) {
    console.error(err)
  }
})

// delete restaurant
app.post('/restaurants/:_id/delete', async (req, res) => {
  const { _id } = req.params
  try {
    const restaurant = await Restaurant.findOne({ _id })
    await restaurant.remove()
    res.redirect('/')
  } catch (err) {
    console.error(err)
  }
})

// get to detail page
app.get('/restaurants/:_id', async (req, res) => {
  const { _id } = req.params
  try {
    const restaurant = await Restaurant.findOne({ _id }).lean()
    res.render('show', { restaurant })
  } catch (err) {
    console.error(err)
  }
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
