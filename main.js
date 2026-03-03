const { json } = require('body-parser')
const express = require('express')




const app = express()
const port = 3000
app.use(json())


app.use('/products', require('./routers/products'))
app.use('/categories', require('./routers/categories'))
// GET GET/ID POST PUT DELETE



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
