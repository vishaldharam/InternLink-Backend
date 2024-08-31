
// const mongoDBStoreConstructor = MongoDBStore(session)

// const store = new mongoDBStoreConstructor({
//     uri:process.env.MONGO_URI,
//     databaseName:process.env.MONGO_DB_NAME,
//     collection:"User Session"
// })

// store.on('error',(err)=> {
//     console.log(err)
// })

// app.use(session({
//     secret:process.env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:true,
//     cookie:{
//         secure:false,
//         maxAge:1000 * 60 * 60 //1 hr.
//     },
//     store:store
// }))
