const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// get to restaurant-adding page
router.get('/new', (req, res) => {
  try {
    res.render('new')
  } catch (err) {
    console.error(err)
  }
})

// create a new restaurant
router.post('/', async (req, res) => {
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
router.get('/:_id/edit', async (req, res) => {
  const { _id } = req.params
  try {
    const restaurant = await Restaurant.findOne({ _id }).lean()
    res.render('edit', { restaurant })
  } catch (err) {
    console.error(err)
  }
})

// edit restaurant
router.put('/:_id', async (req, res) => {
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
router.delete('/:_id', async (req, res) => {
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
router.get('/:_id', async (req, res) => {
  const { _id } = req.params
  try {
    const restaurant = await Restaurant.findOne({ _id }).lean()
    res.render('show', { restaurant })
  } catch (err) {
    console.error(err)
  }
})

module.exports = router
