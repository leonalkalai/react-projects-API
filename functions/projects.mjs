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
// export async function handler(event, context) {

//   // Log the method specifically to check if it's there
//   console.log("Event Method:", event?.httpMethod); // Optional chaining to avoid errors if method doesn't exist

//   console.log("Event path:", event?.path);

//   console.log("Event path:", event?.queryStringParameters);

//   // Log the entire event object to inspect its structure
//   console.log("Event Object:", JSON.stringify(event, null, 2)); // Pretty-print the event object

//   const { httpMethod, path, queryStringParameters, body } = event; // destructuring event object
//   const id = path.split("/").pop(); // get id from the path
//   /*
//    const method = event.method;
//    const path = event.path;
//    const query = event.query;
//    const body = event.body;
//   */

//   const method = httpMethod;
//   const query = queryStringParameters;
//   // set headers for the response
//   const headers = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type",
//   };

//   // if method is options return status ok and the headers [ https://freedium.cfd/https://medium.com/@arsh1207/what-are-http-options-methods-2dc73615ecad ]
// if (httpMethod === "OPTIONS") {
//   return {
//     statusCode: 200,
//     headers, // Return CORS headers for preflight
//     body: "",
//   };
// }

//   try {
//     if (method === "GET" && path === "/api/project") {
//          const projects = await getProjects();
// return {
//   statusCode: 200,
//   headers, // Include the headers in the response
//   body: JSON.stringify({ success: true, data: projects }),
// };
//     }

//     if (method === "GET" && path === `/api/project/${id}`) {
//       return await getProject(id);
//     }

//     if (method === "POST") {
//       return await createProject(body);
//     }

//     if (method === "PATCH") {
//       return await updateProject(id, body);
//     }

//     if (method === "DELETE") {
//       return await deleteProject(id);
//     }

//     // If the method is not supported
//     // ${JSON.stringify(event, null, 2)}
//     // If the method is not supported, return a 405 error
//     return {
//       statusCode: 405,
//       headers,
//       body: `Method ${method} Not Allowed`,
//     };
//   } catch (error) {
//     console.error("Error:", error);
//     return {
//       statusCode: 500,
//       headers,
//       body: "server error occured",
//     };
//   }
// }

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
// /functions/project.js
export async function handler(event, context) {
  const { httpMethod, path, queryStringParameters, body } = event;

  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers, // Return CORS headers for preflight
      body: JSON.stringify({ success: true }),
    };
  }

  if (httpMethod === "GET" && path === "/projects") {
    try {
      const projects = await getProjects();
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({ success: true, data: projects }),
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "An internal server error occurred.",
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  if (httpMethod === "GET" && path.startsWith("/projects/")) {
    const projectId = path.split("/").pop(); // Extract project id from path
    try {
      const project = await getProject(projectId);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          projectId: projectId,
          data: project,
        }),
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "An internal server error occurred.",
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  if (httpMethod === "POST" && path.startsWith("/projects/")) {
    // Set headers for the response
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    try {
      const project = await createProject(body);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({ success: true, data: project.data }),
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "An internal server error occurred.",
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  if (httpMethod === "PATCH" && path.startsWith(`/projects/edit/`)) {
    const projectId = path.split("/projects/edit/")[1]; // Extract the projectId from the path
    try {
      const project = await updateProject(projectId, JSON.parse(body));
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({ success: true, data: project }),
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "An internal server error occurred.",
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  if (httpMethod === "DELETE" && path.startsWith("/projects/edit/")) {
    // Extract the projectId from the path (from `/api/project/edit/:id`)
    const projectId = path.split("/projects/edit/")[1]; // This will give you the `projectId`

    try {
      const project = await deleteProject(projectId);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({ success: true, data: project }),
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "An internal server error occurred.",
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers, // Include the headers in the response
    body: JSON.stringify({
      success: false,
      message: "Method Not Allowed",
    }),
  };
}

// ********** Application routes **********
// [ https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes ]

// ######## Get all projects ########

// if serverless

// CreateProject class
class CreateProject {
  constructor(reqbody) {
    this._id = reqbody._id;
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

  // Debugging output to check the fetched data
  console.log("Fetched projects:", projects);

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

    newProject._id = project.insertedId;

    // Return the new project along with its MongoDB _id
    return {
      success: true,
      data: newProject,
    };
  } catch (error) {
    console.error("Error adding new project:", error);

    // Return error response
    throw new Error("Error adding new project");
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
