const { Router } = require('express')
const router = Router()
const ProductManager = require('../ProductManager')

const manager = new ProductManager(`${__dirname}/../../assets/Products.json`)

router.get('/', async (_, res) => {
    try {
        const products = await manager.getProducts();

        const productsData = products.map(product => ({
            title: product.title,
            description: product.description,
            price: product.price,
            stock: product.stock,
            code: product.code,
            id: product.id
        }))

        res.render('realTimeProducts', {
            products: productsData,
            style: ['styles.css'],
            script: ['realTimeProducts.js'],
            useWS: true
        })
    } catch {
        res.status(500).send('Error retrieving products')
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body

        const newProduct = { title, description, price, thumbnail, code, stock }

        if (newProduct.title && newProduct.description && newProduct.price && newProduct.thumbnail && newProduct.code && newProduct.stock) {
            req.app.get('ws').emit('newProduct', newProduct)
        }

        await manager.addProduct(title, description, price, thumbnail, code, stock)

        res.status(301).redirect('/realtimeproducts')
    } catch (err) {
        console.log(err)
        res.status(500).send('Error adding product')
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)

        await manager.deleteProduct(productId)

        const products = await manager.getProducts()
 
        req.app.get('ws').emit('updateFeed', products)

        res.status(301).redirect('/realtimeproducts')
    } catch {
        res.status(500).send('Error deleting product')
    }
});

module.exports = router;