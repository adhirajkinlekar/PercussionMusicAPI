const mongoose = require('mongoose')
// to connect config.env to node.js we need to install dotenv package
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
//configurations must be read before app is imported
const app = require('./index.js');

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((con) => {
    console.log('connected to MongoDB')
})

const port = process.env.port || 3001
const server = app.listen(port, () => {
    console.log(`running... on port ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);// in  production add tools to restart the server. In some cases in production it is handled isself
    });
});