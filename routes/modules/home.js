const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', async (req, res) => {
  try {
    // get all restaurants data
    const restaurants = await Restaurant.find().lean()
    res.render('index', { restaurants })
  } catch (err) {
    console.error(err)
  }
})

router.get('/search', async (req, res) => {
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

module.exports = router
