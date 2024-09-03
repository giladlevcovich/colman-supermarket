const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('public'))

app.use(cors())

const productRouter = require('./modules/products');
const supplierRouter = require('./modules/suppliers/suppliers.routes')
const userRouter = require('./modules/users/controller/user.routes')
const orderRouter = require('./modules/orders/controller/orders.routes')
app.use('/api', productRouter);
app.use('/api', supplierRouter)
app.use('/api', userRouter)
app.use('/api', orderRouter)


mongoose.connect('mongodb+srv://morankristal:Ramzi123@colman-supermarket-mong.fkyma.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(80, () => {
        console.log(`App listening on port 80`);
    })
});

