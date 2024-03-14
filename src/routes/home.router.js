const { Router } = require('express')
const router = Router()
const ProductManager = require('../ProductManager')

const manager = new ProductManager(`${__dirname}/../../assets/Products.json`)

router.get('/', async (_, res) => {
    try {
        const products = await manager.getProducts()

        const productsData = products.map(product => ({
            title: product.title,
            thumbnail: product.thumbnail,
            description: product.description,
            price: product.price,
            stock: product.stock,
            code: product.code
        }))

        res.render('home', {
            products: productsData,
            style: ['styles.css']
        })
    } catch {
        res.status(500).send('Server error')
    }
})

module.exports = router