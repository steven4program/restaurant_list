const express = require('express')
const app = express()
const { engine } = require('express-handlebars')

const port = process.env.PORT || 3000

// restaurants data
const restaurants = require('./restaurant.json')

// express template engine
app.engine('.hbs', engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')

// setting static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurants.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params
  const restaurant = restaurants.results.find(
    (restaurant) => restaurant_id === restaurant.id.toString()
  )
  res.render('show', { restaurant })
})

app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - Not Found')
})

// app.use((err, req, res, next) => {
//   res.type('text/plain')
//   res.status(500)
//   res.send('500 - Server Error')
// })

app.listen(port, () => {
  console.log(
    `App is running on http://localhost:${port};` +
      ` press Ctrl-C to terminate.`
  )
})
