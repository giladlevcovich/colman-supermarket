const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'))


const productRouter = require('./modules/products');
app.use('/api', productRouter);


mongoose.connect('mongodb+srv://morankristal:Ramzi123@colman-supermarket-mong.fkyma.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(80, () => {
        console.log(`App listening on port 80`);
    })
});

