const socket = io()

socket.on('newProduct', (newProduct) => {
    const container = document.getElementById('productFeed')

    const divContainer = document.createElement('div')
    divContainer.classList.add('product')

    const title = document.createElement('h3')
    title.innerText = newProduct.title

    const divInfo = document.createElement('div')
    divInfo.classList.add('product__info')

    const description = document.createElement('p')
    description.innerText = newProduct.description

    const price = document.createElement('p')
    price.innerText = `$${newProduct.price}`

    const stock = document.createElement('p')
    stock.innerText = `Stock: ${newProduct.stock}`

    const code = document.createElement('p')
    code.innerText = `Code: ${newProduct.code}`

    divInfo.append(description, price, stock, code)
    divContainer.append(title, divInfo)
    container.append(divContainer)
})

socket.on('updateFeed', (products) => {
    const container = document.getElementById('productFeed')
    container.innerHTML = ''

    products.forEach((product) => {
        const divContainer = document.createElement('div')
        divContainer.classList.add('product')

        const title = document.createElement('h3')
        title.innerText = product.title

        const divInfo = document.createElement('div')
        divInfo.classList.add('product__info')

        const description = document.createElement('p')
        description.innerText = product.description

        const price = document.createElement('p')
        price.innerText = `$${product.price}`

        const stock = document.createElement('p')
        stock.innerText = `Stock: ${product.stock}`

        const code = document.createElement('p')
        code.innerText = `Code: ${product.code}`

        divInfo.append(description, price, stock, code)
        divContainer.append(title, divInfo)
        container.append(divContainer)
    })
})