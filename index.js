import {app} from "./app.js"
import connectDB from "./src/db/index.js"

import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const PORT = process.env.PORT || 3000 


connectDB()
.then(()=>(
    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
})
))
.catch(
    (e)=>(console.log('err while connecting the DB ... ',e))
)
