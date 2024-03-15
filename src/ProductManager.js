const fs = require('fs').promises

class ProductManager {

    #products
    #lastProductId
    path

    constructor(path) {
        this.#products = []
        this.path = path
        this.#lastProductId = 1
        this.#readFile()
    }

    async #readFile() {
        try {
            const fileData = await fs.readFile(this.path, 'utf-8')
            this.#products = JSON.parse(fileData)
            this.#updateLastProductId()
        } catch (error) {
            await this.#saveFile()
        }
    }

    #updateLastProductId() {
        const lastProduct = this.#products[this.#products.length - 1]
        if (lastProduct) {
            this.#lastProductId = lastProduct.id + 1
        }
    }

    async #saveFile() {
        await fs.writeFile(this.path, JSON.stringify(this.#products, null, 2), 'utf-8')
    }

    #getNewId() {
        return this.#lastProductId++
    }

    async addProduct(title, description, price, thumbnail, code, status, stock) {
        if (!title || !description || !code) {
            throw new Error("One or more fields have invalid values.")
        }

        if (typeof status === 'undefined' || status === true || status === 'true') {
            status = true
        } else {
            status = false
        }

        if (!thumbnail) {
            thumbnail = 'no image'
        } else {
            thumbnail;
        }

        const numericPrice = parseFloat(price)
        const numericStock = parseInt(stock)

        if (numericStock < 0 && numericPrice <= 0) {
            throw new Error("Make sure 'stock' and 'price' are valid numbers.")
        }

        const existingProduct = await this.getProducts()
        const findProductCode = existingProduct.find(field => field.code === code)

        if (!findProductCode) {
            const product = { id: this.#getNewId(), title, description, price: numericPrice, thumbnail, code, status, stock: numericStock }
            this.#products.push(product)
            await this.#saveFile()
            console.log('Product added.')
        } else {
            throw new Error("'Code' field already exists for one or more products.")
        }
    }

    async getProducts() {
        try {
            const fileContents = await fs.readFile(this.path, 'utf-8')
            const existingProduct = JSON.parse(fileContents)
            return existingProduct
        } catch (err) {
            return []
        }
    }

    async getProductById(id) {
        const existingProducts = await this.getProducts()
        const filterProductById = existingProducts.find(el => el.id === id)
        if (filterProductById) {
            return filterProductById
        } else {
            throw new Error('ID not found.')
        }
    }

    async updateProduct(id, updatedProduct) {
        const indexToUpdate = this.#products.findIndex(el => el.id === id)

        if (indexToUpdate !== -1) {
            const { id: updatedId, stock, price } = updatedProduct

            if (stock <= 0 || price <= 0) {
                throw new Error("Make sure 'stock' and 'price' are valid numbers.")
            }

            if (updatedId && updatedId !== id) {
                throw new Error('Product ID cannot be modified.')
            }

            this.#products[indexToUpdate] = { ...this.#products[indexToUpdate], ...updatedProduct, id }
            await this.#saveFile();
            console.log('Product updated.')
        } else {
            throw new Error('ID not found.')
        }
    }

    async deleteProduct(id) {
        const indexToDelete = this.#products.findIndex(el => el.id === id)
        if (indexToDelete !== -1) {
            this.#products.splice(indexToDelete, 1)
            await this.#saveFile()
            console.log('Product deleted.')
        } else {
            throw new Error('ID not found.')
        }
    }
}

module.exports = ProductManager