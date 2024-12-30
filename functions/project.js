const serverless = true; // set serverless to true

if (!serverless) {
  // check if serverless
  import express from "express"; // import express
}

import projects_db from "./database/connection.js"; // import projects database from connection

import { ObjectId } from "mongodb"; // import ObjectId method to convert the _id field value to string [ https://www.mongodb.com/docs/manual/reference/method/ObjectId/ ]

if (!serverless) {
  const router = express.Router(); // create new instance of Router to create middleware for requests
}

/*
https://www.netlify.com/blog/intro-to-serverless-functions/

The function handler receives HTTP request data through event.
It processes the request using the httpMethod to determine the type of operation (GET, POST, etc.).
Based on the request path, it interacts with a MongoDB collection (projects_db.collection("projects")) to:
Retrieve all projects or a single project by ID (GET).
Insert a new project (POST).
It returns a response object containing an appropriate statusCode, headers, and body.
When It’s Invoked
The serverless platform automatically invokes the handler function whenever the corresponding API route is accessed by an HTTP request. For example:

A GET request to /api/project/123 calls handler with the event containing the path /project/123.
A POST request to /api/project with a body payload triggers the POST logic within handler.


Serverless function handler [ https://docs.digitalocean.com/products/functions/reference/runtimes/node-js/ ]
The handler function passes two parameters, event and context.
event -> input event initiating the function. HTTP event -> web event.
context ->  function’s execution environment data(timeout, memory)

*/
export async function handler(event, context) {
  const { method, path, query, body } = event; // destructuring event object
  const id = path.split("/").pop(); // get id from the path
  /*
   const method = event.method;
   const path = event.path;
   const query = event.query;
   const body = event.body;
  */

  // set headers for the response
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // if method is options return status ok and the headers [ https://freedium.cfd/https://medium.com/@arsh1207/what-are-http-options-methods-2dc73615ecad ]
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }

  try {
    if (method === "GET" && path === "/") {
      return await getProjects();
    }

    if (method === "GET" && path === "/project/") {
      return await getProject(id);
    }

    if (method === "POST") {
      return await createProject(body);
    }

    if (method === "PATCH") {
      return await updateProject(id, body);
    }

    if (method === "DELETE") {
      return await deleteProject(id);
    }

    // If the method is not supported
    return { statusCode: 405, headers, body: `Method ${method} Not Allowed` };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: "server error occured",
    };
  }
}

// check if serverless
if (!serverless) {
  // Helper function to set CORS headers
  const setCorsHeaders = (response) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // Allow your GitHub Pages URL
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE"
    ); // Allow GET, POST, PATCH, DELETE methods
    response.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow content-type header
  };
}
// check if serverless
if (!serverless) {
  // Handle preflight requests (OPTIONS method)
  router.options("*", (request, response) => {
    setCorsHeaders(response);
    response.status(200).send();
  });
}

// ********** Application routes **********
// [ https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes ]

// ######## Get all projects ########

// check if serverless
if (!serverless) {
  router.get("/", async (request, response) => {
    // [ https://www.geeksforgeeks.org/express-js-app-get-request-function/ ]

    const collection = await projects_db.collection("projects"); // get the projects collection request
    /* find all projects in the collection and convert data to array with .toArray() method [ https://www.mongodb.com/docs/manual/reference/method/cursor.toArray/ ]
     return all documents in a collection, omit query parameter or pass an empty document ({}) 
     db.collection.find() same with db.collection.find({}) [ https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#std-label-method-find-query ]
  */
    const projects = await collection.find({}).toArray();

    setCorsHeaders(response); // Set CORS headers before sending the response
    response.send(projects).status(200); // send response with status 200 ok
  });

  // ######## Get a project based on project id ########

  /* [ https://expressjs.com/en/guide/routing.html#route-parameters ]
To use route parameters, im adding a parameter to the route. Syntax for defining a route parameter (:parameter).
*/
  router.get("/:id", async (request, response) => {
    // [ https://www.geeksforgeeks.org/express-js-app-get-request-function/ ]

    const collection = await projects_db.collection("projects"); // get the projects collection
    /* find all projects in the collection and convert data to array with .toArray() method [ https://www.mongodb.com/docs/manual/reference/method/cursor.toArray/ ]
       return all documents in a collection, omit query parameter or pass an empty document ({}) 
       db.collection.find() same with db.collection.find({}) [ https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#std-label-method-find-query ]
    
    [ https://www.geeksforgeeks.org/what-is-objectid-in-mongodb/ ]
    In MongoDB, every document within a collection contains an "_id" field that uniquely identifies it, serving as the primary key.
    
    [ https://expressjs.com/en/guide/routing.html#route-parameters ]
    example
        Route path: /:id/
        Request URL: http://localhost:5050/34/
        req.params: { "id": "34" }
    */

    const project_id = request.params.id; // get the project .id referring to "/:id" parameter from the url params object
    const query = { _id: new ObjectId(project_id) }; // set new query object id based on entry in the database having the _id field
    /* [ https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/ ]
    findOne(query) looks for a single document in the collection that matches the criteria in query (_id).
   */
    const project = await collection.findOne(query);

    setCorsHeaders(response); // Set CORS headers before sending the response
    // check if no projects are found
    if (!project) {
      response
        .send("project not found") // Send the HTTP response. [ https://expressjs.com/en/5x/api.html#res.send ]
        .status(404); // Set the status code. [ https://expressjs.com/en/5x/api.html#res.status ]
    } else {
      response.send(project).status(200); // send response with status 200 ok
    }
  });

  // ######## Create a new project ########

  // Create a new class to create new project

  class CreateProject {
    constructor(request) {
      const reqbody = request.body; // easier access to request.body
      this.name = reqbody.name;
      this.category = reqbody.category;
      this.description = reqbody.description;
      this.tech_stack = reqbody.tech_stack;
      this.repository = reqbody.repository;
      this.url = reqbody.url;
      this.image = reqbody.image;
    }
  }

  /* [ https://expressjs.com/en/guide/routing.html#route-parameters ]
To use route parameters, im adding a parameter to the route. Syntax for defining a route parameter (:parameter).
*/
  router.post("/", async (request, response) => {
    // [ https://www.geeksforgeeks.org/express-js-app-post-function/ ]

    try {
      const newProject = new CreateProject(request);

      /*
        -----result-----
        const newProject = {
            name: request.body.name,
            category: request.body.category,
            description:request.body.description,
            tech_stack:request.body.tech_stack,
            repository:request.body.repository,
            url:request.body.url,
            image:request.body.image,
        };
        */

      const collection = await db.collection("projects"); // get the projects collection

      const project = await collection.insertOne(newProject); // [ https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/ ]
      setCorsHeaders(response); // Set CORS headers before sending the response
      response.send(project).status(204); // send response with status 204 ok [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204 ]
    } catch (error) {
      console.error(error); // console log error
      response
        .status(500) // [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500 ]
        .send("Error adding new project");
    }
  });

  // ######## Update a project based on project id ########

  router.patch("/:id", async (request, response) => {
    // [  update the specific part of the database entry [ https://www.geeksforgeeks.org/difference-between-put-and-patch-request/#patch-request ]

    try {
      const project_id = request.params.id; // get the project .id referring to "/:id" parameter from the url params object
      const query = { _id: new ObjectId(project_id) }; // set new query object id based on entry in the database having the _id field
      // [ https://www.mongodb.com/docs/manual/reference/operator/update/set/ ]

      const newProject = new CreateProject(request);

      const collection = await db.collection("projects"); // get the projects collection

      const projectUpdates = { $set: newProject };

      /*
        -----result-----
        const projectUpdates = {
            $set:{
                name: request.body.name,
                category: request.body.category,
                description:request.body.description,
                tech_stack:request.body.tech_stack,
                repository:request.body.repository,
                url:request.body.url,
                image:request.body.image,
            },
        };
        */

      const project = await collection.updateOne(query, projectUpdates); // [ https://www.mongodb.com/docs/php-library/current/reference/method/MongoDBCollection-updateOne/ ]
      setCorsHeaders(response); // Set CORS headers before sending the response
      response.send(project).status(200); // send response with status 200 ok [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200 ]
    } catch (error) {
      console.error(error); // console log error
      response
        .status(500) // [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500 ]
        .send("Error updating project");
    }
  });

  // ######## Update a project based on project id ########

  router.delete("/:id", async (request, response) => {
    // [  update the specific part of the database entry [ https://www.geeksforgeeks.org/express-js-app-delete-function/ ]

    try {
      const project_id = request.params.id; // get the project .id referring to "/:id" parameter from the url params object
      const query = { _id: new ObjectId(project_id) }; // set new query object id based on entry in the database having the _id field
      // [ https://www.mongodb.com/docs/manual/reference/operator/update/set/ ]

      const newProject = new CreateProject(request);

      const collection = await projects_db.collection("projects"); // get the projects collection

      const project = await collection.deleteOne(query); // [https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/ ]
      setCorsHeaders(response); // Set CORS headers before sending the response
      response.send(project).status(200); // send response with status 200 ok [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200 ]
    } catch (error) {
      console.error(error); // console log error
      response
        .status(500) // [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500 ]
        .send("Error deleting project");
    }
  });
} else {
  // if serverless

  // CreateProject class
  class CreateProject {
    constructor(request) {
      const reqbody = request.body; // easier access to request.body
      this.name = reqbody.name;
      this.category = reqbody.category;
      this.description = reqbody.description;
      this.tech_stack = reqbody.tech_stack;
      this.repository = reqbody.repository;
      this.url = reqbody.url;
      this.image = reqbody.image;
    }
  }

  // GET request handler for all projects
  async function getProjects() {
    const collection = await projects_db.collection("projects");
    const projects = await collection.find({}).toArray();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(projects),
    };
  }

  // GET request handler for project with id
  async function getProject(project_id) {
    const collection = await projects_db.collection("projects");
    const query = { _id: new ObjectId(project_id) }; // set new query object id based on entry in the database having the _id field
    /* [ https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/ ]
    findOne(query) looks for a single document in the collection that matches the criteria in query (_id).
   */
    const project = await collection.findOne(query);

    if (!project) {
      return { statusCode: 404, headers, body: "Project not found" };
    }
    return { statusCode: 200, headers, body: JSON.stringify(project) };
  }

  // POST request handler to create project
  async function createProject(body) {
    try {
      // Parse the body and instantiate CreateProject
      const reqbody = JSON.parse(body); // Parse JSON string into an object
      const newProject = new CreateProject(reqbody); // use CreateProject class to create new object

      const collection = await db.collection("projects");

      const project = await collection.insertOne(newProject);

      // Return success response
      return {
        statusCode: 204,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(project),
      };
    } catch (error) {
      console.error("Error adding new project:", error);

      // Return error response
      return {
        statusCode: 500, // Internal Server Error
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Error adding new project" }),
      };
    }
  }

  // PATCH request handler for project with id
  async function updateProject(project_id, body) {
    const collection = await projects_db.collection("projects");
    const reqbody = JSON.parse(body); // Parse JSON string into an object

    const query = { _id: new ObjectId(project_id) };
    const newProject = new CreateProject(reqbody);
    const projectUpdates = { $set: newProject };
    const project = await collection.updateOne(query, projectUpdates);

    // matchedCount = 0 -> check if the project with the specified _id doesnt exist in the database [ https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/]
    if (project.matchedCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: `Project with ${project_id} dooesn't exist`,
      };
    }
    return { statusCode: 200, headers, body: JSON.stringify(project) };
  }

  // DELETE request handler for project with id
  async function deleteProject(project_id) {
    const collection = await projects_db.collection("projects");
    const reqbody = JSON.parse(body); // Parse JSON string into an object
    const query = { _id: new ObjectId(project_id) };
    const project = await collection.deleteOne(query);

    /*   check how many projects deleted
      deletedCount -> property of the result object returned by MongoDB’s deleteOne() method.  
    */
    if (project.deletedCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: `Project with ${project_id} dooesn't exist`,
      };
    }
    return { statusCode: 200, headers, body: JSON.stringify(project) };
  }
}

export default router; // export router module
