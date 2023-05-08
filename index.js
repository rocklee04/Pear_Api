const express = require("express")
const {connection} =require("./db")
var cors = require('cors')
const {userRouter} = require("./routes/User.routes")
const {ProductModel} = require("./model/Product.model")
const {auth} = require("./middleware/auth.middleware")
const {productRouter} = require("./routes/Product.routes")
require('dotenv').config() 
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const app = express()

var corsOptions = {
  origin: 'https://jealous-hare-umbrella.cyclic.app',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))
app.use(express.json());



const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pear Api',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], 
};

const specification = swaggerJsdoc(options);
app.use("/api_docs",swaggerUi.serve,swaggerUi.setup(specification))

app.use("/users", userRouter);
app.get("/allProducts",async (req, res) => {
  try{
      const products = await ProductModel.find();
      res.status(200).send(products);
  } catch(err) {
      res.send(400).send({"msg": err.message})
  }

}) 


app.use(auth);
app.use("/products", productRouter);

app.listen(process.env.port, async() => {
    try{
        await connection
        console.log("connected to db");
    }catch(err) {
        console.log(err)
        console.log("cannot connected to db")
    }
    console.log(`server is running at ${process.env.port}`);
})