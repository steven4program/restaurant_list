const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const routes = require('./routes')
const methodOverride = require('method-override')

const port = process.env.PORT || 3000

// express template engine
app.engine('.hbs', engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')

// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

require('./config/mongoose')

app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, () => {
  console.log(
    `App is running on http://localhost:${port};` +
      ` press Ctrl-C to terminate.`
  )
})
