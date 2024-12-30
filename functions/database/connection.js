import { MongoClient, ServerApiVersion } from "mongodb"; // import  MongoClient and ServerApiVersion classes from mongodb
const uri = process.env.ATLAS_URI || ""; // get Atlas URI from env file

/*
create a variable that stores the MongoDB client instance after it connects to the database
in Serverless functionality every function call creates a new instance of the function. 
No caching MongoDB client -> new MongoDB connection established for each request
- increased Latency
- parallel opened multiple connections fill database's connection pool.
Caching MongoDB client
If the client has already been created -> ready to be reused.
If the client is null ->  create a new connection and assign it to cached client variable.

https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
https://akhilaariyachandra.com/blog/using-mongodb-in-a-serverless-app
https://medium.com/@jgcmarins/node-js-serverless-aws-lambda-function-how-to-cache-mongodb-connection-and-reuse-it-between-6ec2fea0f465

*/
let cachedClient = null; // for serverless - comment if not

// create client instance using new MongoClient constructor
const client = new MongoClient(uri, {
  //serverAPI object uses MongoDB driver configuration to use the Server API for specific MongoDB versions compatibility.
  serverAPI: {
    version: ServerApiVersion.v1, // version 1 of the MongoDB Server API for compatibility.
    strict: true, //  MongoDB driver throws error for Server API version unsupported methods-features.
    deprecationErrors: true, // MongoDB driver throws error for Server API version deprecated methods-features.
  },
});

async function getDatabase() {
  try {
    await client.connect(); // wait to Connect to the database.
    // if serverless
    // Check if cached client exist.
    if (!cachedClient) {
      cachedClient = client; // Store the connected client in the cache.
      console.log("MongoDB connection established sucessfully");
    }
    return cachedClient.db("projects"); // Return the database instance from the cached client.
  } catch (error) {
    console.error(error); // console log error
  }
}

const projects_db = await getDatabase(); // get projects database

export default projects_db; // export projects database
