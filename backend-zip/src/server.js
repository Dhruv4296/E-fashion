require('dotenv').config();
const { app } = require(".");
const { connectDb } = require("./config/db");
const userService=require("./services/user.service.js")

const PORT = process.env.PORT || 5454;
app.listen(PORT, async () => {
    await connectDb()
    userService.initializeAdminUser()
    console.log("ecommerce api listing on port ", PORT)
})