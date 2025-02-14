import express from 'express'
import * as dotenv from 'dotenv'
import path from 'node:path'
import bootstrap from './src/app.controller.js'
const app = express()
dotenv.config({path: path.resolve('./src/config/.env.dev')})
const port = process.env.PORT || 3000;

bootstrap(app, express);
app.listen(port, () => console.log(`🚀Example app listening on port ${port}!`))