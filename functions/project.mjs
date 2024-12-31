import { getDatabase } from "./database/connection.js"; // import projects database from connection

import { ObjectId } from "mongodb"; // import ObjectId method to convert the _id field value to string [ https://www.mongodb.com/docs/manual/reference/method/ObjectId/ ]

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

// ********** Application routes **********
// [ https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes ]

// ######## Get all projects ########

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
  const projects_db = await getDatabase();
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
  const projects_db = await getDatabase();
  const collection = await projects_db.collection("projects");
  const query = { _id: new ObjectId(project_id) }; // set new query object id based on entry in the database having the _id field
  /* [ https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/ ]
    findOne(query) looks for a single document in the collection that matches the criteria in query (_id).
   */
  const project = await collection.findOne(query);
  if (!project) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Project not found" }),
    };
  }
  return { statusCode: 200, headers, body: JSON.stringify(project) };
}

// POST request handler to create project
async function createProject(body) {
  try {
    // Parse the body and instantiate CreateProject
    const reqbody = JSON.parse(body); // Parse JSON string into an object
    const newProject = new CreateProject(reqbody); // use CreateProject class to create new object
    const projects_db = await getDatabase();
    const collection = await projects_db.collection("projects");

    const project = await collection.insertOne(newProject);

    // Return success response
    return {
      statusCode: 201,
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
  const projects_db = await getDatabase();
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
      body: JSON.stringify({
        message: `Project with ${project_id} doesn't exist`,
      }),
    };
  }
  return { statusCode: 200, headers, body: JSON.stringify(project) };
}

// DELETE request handler for project with id
async function deleteProject(project_id) {
  const projects_db = await getDatabase();
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
      body: JSON.stringify({
        message: `Project with ${project_id} doesn't exist`,
      }),
    };
  }
  return { statusCode: 200, headers, body: JSON.stringify(project) };
}