const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const homeRouter = require('./routes/home.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router')

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', homeRouter)
app.use('/realTimeProducts', realTimeProductsRouter)

const httpServer = app.listen(8080, () => {
    console.log('Server ready');
});

const wsServer = new Server(httpServer);
app.set('ws', wsServer)

wsServer.on('connection', (wsClient) => {
    console.log(`Client connected => ${wsClient.id}`);
})