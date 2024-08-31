import { config } from "dotenv";
import { app } from "./src/app.js";
import { connectDB } from "./src/db.js";
const nodeVersion = +process.env.NODE_VERSION?.split('.')[0] || 0
config({
    path:'./config.env'
})



const startServer = () => {
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is hosted on PORT ${process.env.PORT}`)
    })
}

if(nodeVersion >= 14){
    try{
        await connectDB()
        startServer()
    }
    catch (err) {
        console.log("Unexpected Error Occurred")
    }
}
else{

    connectDB().then(()=>{
        startServer();
        console.log("Mongo Connection success")
    }).catch((error)=> {
        console.log('Error occured in connection')
    })

}