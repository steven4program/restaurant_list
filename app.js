const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('This is my restaurants list.')
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
