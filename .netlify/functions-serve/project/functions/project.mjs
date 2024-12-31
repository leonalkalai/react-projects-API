
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// functions/database/connection.js
import { MongoClient, ServerApiVersion } from "mongodb";
var uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(uri);
}
var cachedClient = null;
var client = new MongoClient(uri, {
  //serverAPI object uses MongoDB driver configuration to use the Server API for specific MongoDB versions compatibility.
  serverAPI: {
    version: ServerApiVersion.v1,
    // version 1 of the MongoDB Server API for compatibility.
    strict: true,
    //  MongoDB driver throws error for Server API version unsupported methods-features.
    deprecationErrors: true
    // MongoDB driver throws error for Server API version deprecated methods-features.
  }
});
async function getDatabase() {
  if (cachedClient) {
    return cachedClient.db("projects");
  }
  try {
    await client.connect();
    cachedClient = client;
    console.log("MongoDB connection established successfully");
    return client.db("projects");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
var projects_db = await getDatabase();
var connection_default = projects_db;

// functions/project.mjs
import { ObjectId } from "mongodb";
async function handler(event, context) {
  const { method, path, query, body: body2 } = event;
  const id = path.split("/").pop();
  const headers2 = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: headers2
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
      return await createProject(body2);
    }
    if (method === "PATCH") {
      return await updateProject(id, body2);
    }
    if (method === "DELETE") {
      return await deleteProject(id);
    }
    return { statusCode: 405, headers: headers2, body: `Method ${method} Not Allowed` };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: headers2,
      body: "server error occured"
    };
  }
}
var CreateProject = class {
  constructor(request) {
    const reqbody = request.body;
    this.name = reqbody.name;
    this.category = reqbody.category;
    this.description = reqbody.description;
    this.tech_stack = reqbody.tech_stack;
    this.repository = reqbody.repository;
    this.url = reqbody.url;
    this.image = reqbody.image;
  }
};
async function getProjects() {
  const collection = await connection_default.collection("projects");
  const projects = await collection.find({}).toArray();
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(projects)
  };
}
async function getProject(project_id) {
  const collection = await connection_default.collection("projects");
  const query = { _id: new ObjectId(project_id) };
  const project = await collection.findOne(query);
  if (!project) {
    return { statusCode: 404, headers, body: "Project not found" };
  }
  return { statusCode: 200, headers, body: JSON.stringify(project) };
}
async function createProject(body2) {
  try {
    const reqbody = JSON.parse(body2);
    const newProject = new CreateProject(reqbody);
    const collection = await db.collection("projects");
    const project = await collection.insertOne(newProject);
    return {
      statusCode: 204,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(project)
    };
  } catch (error) {
    console.error("Error adding new project:", error);
    return {
      statusCode: 500,
      // Internal Server Error
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ message: "Error adding new project" })
    };
  }
}
async function updateProject(project_id, body2) {
  const collection = await connection_default.collection("projects");
  const reqbody = JSON.parse(body2);
  const query = { _id: new ObjectId(project_id) };
  const newProject = new CreateProject(reqbody);
  const projectUpdates = { $set: newProject };
  const project = await collection.updateOne(query, projectUpdates);
  if (project.matchedCount === 0) {
    return {
      statusCode: 404,
      headers,
      body: `Project with ${project_id} dooesn't exist`
    };
  }
  return { statusCode: 200, headers, body: JSON.stringify(project) };
}
async function deleteProject(project_id) {
  const collection = await connection_default.collection("projects");
  const reqbody = JSON.parse(body);
  const query = { _id: new ObjectId(project_id) };
  const project = await collection.deleteOne(query);
  if (project.deletedCount === 0) {
    return {
      statusCode: 404,
      headers,
      body: `Project with ${project_id} dooesn't exist`
    };
  }
  return { statusCode: 200, headers, body: JSON.stringify(project) };
}
var project_default = router;
export {
  project_default as default,
  handler
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnVuY3Rpb25zL2RhdGFiYXNlL2Nvbm5lY3Rpb24uanMiLCAiZnVuY3Rpb25zL3Byb2plY3QubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBNb25nb0NsaWVudCwgU2VydmVyQXBpVmVyc2lvbiB9IGZyb20gXCJtb25nb2RiXCI7IC8vIGltcG9ydCAgTW9uZ29DbGllbnQgYW5kIFNlcnZlckFwaVZlcnNpb24gY2xhc3NlcyBmcm9tIG1vbmdvZGJcclxuY29uc3QgdXJpID0gcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkk7IC8vIGdldCBBdGxhcyBVUkkgZnJvbSBlbnYgZmlsZVxyXG5cclxuaWYgKCF1cmkpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IodXJpKTtcclxufVxyXG4vKlxyXG5jcmVhdGUgYSB2YXJpYWJsZSB0aGF0IHN0b3JlcyB0aGUgTW9uZ29EQiBjbGllbnQgaW5zdGFuY2UgYWZ0ZXIgaXQgY29ubmVjdHMgdG8gdGhlIGRhdGFiYXNlXHJcbmluIFNlcnZlcmxlc3MgZnVuY3Rpb25hbGl0eSBldmVyeSBmdW5jdGlvbiBjYWxsIGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGZ1bmN0aW9uLiBcclxuTm8gY2FjaGluZyBNb25nb0RCIGNsaWVudCAtPiBuZXcgTW9uZ29EQiBjb25uZWN0aW9uIGVzdGFibGlzaGVkIGZvciBlYWNoIHJlcXVlc3RcclxuLSBpbmNyZWFzZWQgTGF0ZW5jeVxyXG4tIHBhcmFsbGVsIG9wZW5lZCBtdWx0aXBsZSBjb25uZWN0aW9ucyBmaWxsIGRhdGFiYXNlJ3MgY29ubmVjdGlvbiBwb29sLlxyXG5DYWNoaW5nIE1vbmdvREIgY2xpZW50XHJcbklmIHRoZSBjbGllbnQgaGFzIGFscmVhZHkgYmVlbiBjcmVhdGVkIC0+IHJlYWR5IHRvIGJlIHJldXNlZC5cclxuSWYgdGhlIGNsaWVudCBpcyBudWxsIC0+ICBjcmVhdGUgYSBuZXcgY29ubmVjdGlvbiBhbmQgYXNzaWduIGl0IHRvIGNhY2hlZCBjbGllbnQgdmFyaWFibGUuXHJcblxyXG5odHRwczovL3d3dy5tb25nb2RiLmNvbS9ibG9nL3Bvc3Qvb3B0aW1pemluZy1hd3MtbGFtYmRhLXBlcmZvcm1hbmNlLXdpdGgtbW9uZ29kYi1hdGxhcy1hbmQtbm9kZWpzXHJcbmh0dHBzOi8vYWtoaWxhYXJpeWFjaGFuZHJhLmNvbS9ibG9nL3VzaW5nLW1vbmdvZGItaW4tYS1zZXJ2ZXJsZXNzLWFwcFxyXG5odHRwczovL21lZGl1bS5jb20vQGpnY21hcmlucy9ub2RlLWpzLXNlcnZlcmxlc3MtYXdzLWxhbWJkYS1mdW5jdGlvbi1ob3ctdG8tY2FjaGUtbW9uZ29kYi1jb25uZWN0aW9uLWFuZC1yZXVzZS1pdC1iZXR3ZWVuLTZlYzJmZWEwZjQ2NVxyXG5cclxuKi9cclxubGV0IGNhY2hlZENsaWVudCA9IG51bGw7IC8vIGZvciBzZXJ2ZXJsZXNzIC0gY29tbWVudCBpZiBub3RcclxuXHJcbi8vIGNyZWF0ZSBjbGllbnQgaW5zdGFuY2UgdXNpbmcgbmV3IE1vbmdvQ2xpZW50IGNvbnN0cnVjdG9yXHJcbmNvbnN0IGNsaWVudCA9IG5ldyBNb25nb0NsaWVudCh1cmksIHtcclxuICAvL3NlcnZlckFQSSBvYmplY3QgdXNlcyBNb25nb0RCIGRyaXZlciBjb25maWd1cmF0aW9uIHRvIHVzZSB0aGUgU2VydmVyIEFQSSBmb3Igc3BlY2lmaWMgTW9uZ29EQiB2ZXJzaW9ucyBjb21wYXRpYmlsaXR5LlxyXG4gIHNlcnZlckFQSToge1xyXG4gICAgdmVyc2lvbjogU2VydmVyQXBpVmVyc2lvbi52MSwgLy8gdmVyc2lvbiAxIG9mIHRoZSBNb25nb0RCIFNlcnZlciBBUEkgZm9yIGNvbXBhdGliaWxpdHkuXHJcbiAgICBzdHJpY3Q6IHRydWUsIC8vICBNb25nb0RCIGRyaXZlciB0aHJvd3MgZXJyb3IgZm9yIFNlcnZlciBBUEkgdmVyc2lvbiB1bnN1cHBvcnRlZCBtZXRob2RzLWZlYXR1cmVzLlxyXG4gICAgZGVwcmVjYXRpb25FcnJvcnM6IHRydWUsIC8vIE1vbmdvREIgZHJpdmVyIHRocm93cyBlcnJvciBmb3IgU2VydmVyIEFQSSB2ZXJzaW9uIGRlcHJlY2F0ZWQgbWV0aG9kcy1mZWF0dXJlcy5cclxuICB9LFxyXG59KTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldERhdGFiYXNlKCkge1xyXG4gIGlmIChjYWNoZWRDbGllbnQpIHtcclxuICAgIC8vIFJldHVybiBjYWNoZWQgY2xpZW50IGlmIGl0IGV4aXN0c1xyXG4gICAgcmV0dXJuIGNhY2hlZENsaWVudC5kYihcInByb2plY3RzXCIpO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IGNsaWVudC5jb25uZWN0KCk7IC8vIENvbm5lY3QgdG8gdGhlIE1vbmdvREIgZGF0YWJhc2VcclxuICAgIGNhY2hlZENsaWVudCA9IGNsaWVudDsgLy8gQ2FjaGUgdGhlIGNsaWVudCBmb3IgcmV1c2VcclxuICAgIGNvbnNvbGUubG9nKFwiTW9uZ29EQiBjb25uZWN0aW9uIGVzdGFibGlzaGVkIHN1Y2Nlc3NmdWxseVwiKTtcclxuICAgIHJldHVybiBjbGllbnQuZGIoXCJwcm9qZWN0c1wiKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBjb25uZWN0IHRvIE1vbmdvREI6XCIsIGVycm9yKTtcclxuICAgIHRocm93IGVycm9yOyAvLyBSZXRocm93IHRoZSBlcnJvciB0byBoYW5kbGUgaXQgYXBwcm9wcmlhdGVseSBpbiB0aGUgY2FsbGluZyBmdW5jdGlvblxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcHJvamVjdHNfZGIgPSBhd2FpdCBnZXREYXRhYmFzZSgpOyAvLyBnZXQgcHJvamVjdHMgZGF0YWJhc2VcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHByb2plY3RzX2RiOyAvLyBleHBvcnQgcHJvamVjdHMgZGF0YWJhc2VcclxuIiwgImltcG9ydCBwcm9qZWN0c19kYiBmcm9tIFwiLi9kYXRhYmFzZS9jb25uZWN0aW9uLmpzXCI7IC8vIGltcG9ydCBwcm9qZWN0cyBkYXRhYmFzZSBmcm9tIGNvbm5lY3Rpb25cclxuXHJcbmltcG9ydCB7IE9iamVjdElkIH0gZnJvbSBcIm1vbmdvZGJcIjsgLy8gaW1wb3J0IE9iamVjdElkIG1ldGhvZCB0byBjb252ZXJ0IHRoZSBfaWQgZmllbGQgdmFsdWUgdG8gc3RyaW5nIFsgaHR0cHM6Ly93d3cubW9uZ29kYi5jb20vZG9jcy9tYW51YWwvcmVmZXJlbmNlL21ldGhvZC9PYmplY3RJZC8gXVxyXG5cclxuLypcclxuaHR0cHM6Ly93d3cubmV0bGlmeS5jb20vYmxvZy9pbnRyby10by1zZXJ2ZXJsZXNzLWZ1bmN0aW9ucy9cclxuXHJcblRoZSBmdW5jdGlvbiBoYW5kbGVyIHJlY2VpdmVzIEhUVFAgcmVxdWVzdCBkYXRhIHRocm91Z2ggZXZlbnQuXHJcbkl0IHByb2Nlc3NlcyB0aGUgcmVxdWVzdCB1c2luZyB0aGUgaHR0cE1ldGhvZCB0byBkZXRlcm1pbmUgdGhlIHR5cGUgb2Ygb3BlcmF0aW9uIChHRVQsIFBPU1QsIGV0Yy4pLlxyXG5CYXNlZCBvbiB0aGUgcmVxdWVzdCBwYXRoLCBpdCBpbnRlcmFjdHMgd2l0aCBhIE1vbmdvREIgY29sbGVjdGlvbiAocHJvamVjdHNfZGIuY29sbGVjdGlvbihcInByb2plY3RzXCIpKSB0bzpcclxuUmV0cmlldmUgYWxsIHByb2plY3RzIG9yIGEgc2luZ2xlIHByb2plY3QgYnkgSUQgKEdFVCkuXHJcbkluc2VydCBhIG5ldyBwcm9qZWN0IChQT1NUKS5cclxuSXQgcmV0dXJucyBhIHJlc3BvbnNlIG9iamVjdCBjb250YWluaW5nIGFuIGFwcHJvcHJpYXRlIHN0YXR1c0NvZGUsIGhlYWRlcnMsIGFuZCBib2R5LlxyXG5XaGVuIEl0XHUyMDE5cyBJbnZva2VkXHJcblRoZSBzZXJ2ZXJsZXNzIHBsYXRmb3JtIGF1dG9tYXRpY2FsbHkgaW52b2tlcyB0aGUgaGFuZGxlciBmdW5jdGlvbiB3aGVuZXZlciB0aGUgY29ycmVzcG9uZGluZyBBUEkgcm91dGUgaXMgYWNjZXNzZWQgYnkgYW4gSFRUUCByZXF1ZXN0LiBGb3IgZXhhbXBsZTpcclxuXHJcbkEgR0VUIHJlcXVlc3QgdG8gL2FwaS9wcm9qZWN0LzEyMyBjYWxscyBoYW5kbGVyIHdpdGggdGhlIGV2ZW50IGNvbnRhaW5pbmcgdGhlIHBhdGggL3Byb2plY3QvMTIzLlxyXG5BIFBPU1QgcmVxdWVzdCB0byAvYXBpL3Byb2plY3Qgd2l0aCBhIGJvZHkgcGF5bG9hZCB0cmlnZ2VycyB0aGUgUE9TVCBsb2dpYyB3aXRoaW4gaGFuZGxlci5cclxuXHJcblxyXG5TZXJ2ZXJsZXNzIGZ1bmN0aW9uIGhhbmRsZXIgWyBodHRwczovL2RvY3MuZGlnaXRhbG9jZWFuLmNvbS9wcm9kdWN0cy9mdW5jdGlvbnMvcmVmZXJlbmNlL3J1bnRpbWVzL25vZGUtanMvIF1cclxuVGhlIGhhbmRsZXIgZnVuY3Rpb24gcGFzc2VzIHR3byBwYXJhbWV0ZXJzLCBldmVudCBhbmQgY29udGV4dC5cclxuZXZlbnQgLT4gaW5wdXQgZXZlbnQgaW5pdGlhdGluZyB0aGUgZnVuY3Rpb24uIEhUVFAgZXZlbnQgLT4gd2ViIGV2ZW50LlxyXG5jb250ZXh0IC0+ICBmdW5jdGlvblx1MjAxOXMgZXhlY3V0aW9uIGVudmlyb25tZW50IGRhdGEodGltZW91dCwgbWVtb3J5KVxyXG5cclxuKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQsIGNvbnRleHQpIHtcclxuICBjb25zdCB7IG1ldGhvZCwgcGF0aCwgcXVlcnksIGJvZHkgfSA9IGV2ZW50OyAvLyBkZXN0cnVjdHVyaW5nIGV2ZW50IG9iamVjdFxyXG4gIGNvbnN0IGlkID0gcGF0aC5zcGxpdChcIi9cIikucG9wKCk7IC8vIGdldCBpZCBmcm9tIHRoZSBwYXRoXHJcbiAgLypcclxuICAgY29uc3QgbWV0aG9kID0gZXZlbnQubWV0aG9kO1xyXG4gICBjb25zdCBwYXRoID0gZXZlbnQucGF0aDtcclxuICAgY29uc3QgcXVlcnkgPSBldmVudC5xdWVyeTtcclxuICAgY29uc3QgYm9keSA9IGV2ZW50LmJvZHk7XHJcbiAgKi9cclxuXHJcbiAgLy8gc2V0IGhlYWRlcnMgZm9yIHRoZSByZXNwb25zZVxyXG4gIGNvbnN0IGhlYWRlcnMgPSB7XHJcbiAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIixcclxuICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiOiBcIkdFVCwgUE9TVCwgUEFUQ0gsIERFTEVURSwgT1BUSU9OU1wiLFxyXG4gICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6IFwiQ29udGVudC1UeXBlXCIsXHJcbiAgfTtcclxuXHJcbiAgLy8gaWYgbWV0aG9kIGlzIG9wdGlvbnMgcmV0dXJuIHN0YXR1cyBvayBhbmQgdGhlIGhlYWRlcnMgWyBodHRwczovL2ZyZWVkaXVtLmNmZC9odHRwczovL21lZGl1bS5jb20vQGFyc2gxMjA3L3doYXQtYXJlLWh0dHAtb3B0aW9ucy1tZXRob2RzLTJkYzczNjE1ZWNhZCBdXHJcbiAgaWYgKG1ldGhvZCA9PT0gXCJPUFRJT05TXCIpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgICAgaGVhZGVycyxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgaWYgKG1ldGhvZCA9PT0gXCJHRVRcIiAmJiBwYXRoID09PSBcIi9cIikge1xyXG4gICAgICByZXR1cm4gYXdhaXQgZ2V0UHJvamVjdHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0aG9kID09PSBcIkdFVFwiICYmIHBhdGggPT09IFwiL3Byb2plY3QvXCIpIHtcclxuICAgICAgcmV0dXJuIGF3YWl0IGdldFByb2plY3QoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRob2QgPT09IFwiUE9TVFwiKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCBjcmVhdGVQcm9qZWN0KGJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRob2QgPT09IFwiUEFUQ0hcIikge1xyXG4gICAgICByZXR1cm4gYXdhaXQgdXBkYXRlUHJvamVjdChpZCwgYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGhvZCA9PT0gXCJERUxFVEVcIikge1xyXG4gICAgICByZXR1cm4gYXdhaXQgZGVsZXRlUHJvamVjdChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgdGhlIG1ldGhvZCBpcyBub3Qgc3VwcG9ydGVkXHJcbiAgICByZXR1cm4geyBzdGF0dXNDb2RlOiA0MDUsIGhlYWRlcnMsIGJvZHk6IGBNZXRob2QgJHttZXRob2R9IE5vdCBBbGxvd2VkYCB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgaGVhZGVycyxcclxuICAgICAgYm9keTogXCJzZXJ2ZXIgZXJyb3Igb2NjdXJlZFwiLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbi8vICoqKioqKioqKiogQXBwbGljYXRpb24gcm91dGVzICoqKioqKioqKipcclxuLy8gWyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0xlYXJuX3dlYl9kZXZlbG9wbWVudC9FeHRlbnNpb25zL1NlcnZlci1zaWRlL0V4cHJlc3NfTm9kZWpzL3JvdXRlcyBdXHJcblxyXG4vLyAjIyMjIyMjIyBHZXQgYWxsIHByb2plY3RzICMjIyMjIyMjXHJcblxyXG4vLyBpZiBzZXJ2ZXJsZXNzXHJcblxyXG4vLyBDcmVhdGVQcm9qZWN0IGNsYXNzXHJcbmNsYXNzIENyZWF0ZVByb2plY3Qge1xyXG4gIGNvbnN0cnVjdG9yKHJlcXVlc3QpIHtcclxuICAgIGNvbnN0IHJlcWJvZHkgPSByZXF1ZXN0LmJvZHk7IC8vIGVhc2llciBhY2Nlc3MgdG8gcmVxdWVzdC5ib2R5XHJcbiAgICB0aGlzLm5hbWUgPSByZXFib2R5Lm5hbWU7XHJcbiAgICB0aGlzLmNhdGVnb3J5ID0gcmVxYm9keS5jYXRlZ29yeTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSByZXFib2R5LmRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy50ZWNoX3N0YWNrID0gcmVxYm9keS50ZWNoX3N0YWNrO1xyXG4gICAgdGhpcy5yZXBvc2l0b3J5ID0gcmVxYm9keS5yZXBvc2l0b3J5O1xyXG4gICAgdGhpcy51cmwgPSByZXFib2R5LnVybDtcclxuICAgIHRoaXMuaW1hZ2UgPSByZXFib2R5LmltYWdlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gR0VUIHJlcXVlc3QgaGFuZGxlciBmb3IgYWxsIHByb2plY3RzXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFByb2plY3RzKCkge1xyXG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBhd2FpdCBwcm9qZWN0c19kYi5jb2xsZWN0aW9uKFwicHJvamVjdHNcIik7XHJcbiAgY29uc3QgcHJvamVjdHMgPSBhd2FpdCBjb2xsZWN0aW9uLmZpbmQoe30pLnRvQXJyYXkoKTtcclxuICByZXR1cm4ge1xyXG4gICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgaGVhZGVycyxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByb2plY3RzKSxcclxuICB9O1xyXG59XHJcblxyXG4vLyBHRVQgcmVxdWVzdCBoYW5kbGVyIGZvciBwcm9qZWN0IHdpdGggaWRcclxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJvamVjdChwcm9qZWN0X2lkKSB7XHJcbiAgY29uc3QgY29sbGVjdGlvbiA9IGF3YWl0IHByb2plY3RzX2RiLmNvbGxlY3Rpb24oXCJwcm9qZWN0c1wiKTtcclxuICBjb25zdCBxdWVyeSA9IHsgX2lkOiBuZXcgT2JqZWN0SWQocHJvamVjdF9pZCkgfTsgLy8gc2V0IG5ldyBxdWVyeSBvYmplY3QgaWQgYmFzZWQgb24gZW50cnkgaW4gdGhlIGRhdGFiYXNlIGhhdmluZyB0aGUgX2lkIGZpZWxkXHJcbiAgLyogWyBodHRwczovL3d3dy5tb25nb2RiLmNvbS9kb2NzL21hbnVhbC9yZWZlcmVuY2UvbWV0aG9kL2RiLmNvbGxlY3Rpb24uZmluZE9uZS8gXVxyXG4gICAgZmluZE9uZShxdWVyeSkgbG9va3MgZm9yIGEgc2luZ2xlIGRvY3VtZW50IGluIHRoZSBjb2xsZWN0aW9uIHRoYXQgbWF0Y2hlcyB0aGUgY3JpdGVyaWEgaW4gcXVlcnkgKF9pZCkuXHJcbiAgICovXHJcbiAgY29uc3QgcHJvamVjdCA9IGF3YWl0IGNvbGxlY3Rpb24uZmluZE9uZShxdWVyeSk7XHJcblxyXG4gIGlmICghcHJvamVjdCkge1xyXG4gICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNDA0LCBoZWFkZXJzLCBib2R5OiBcIlByb2plY3Qgbm90IGZvdW5kXCIgfTtcclxuICB9XHJcbiAgcmV0dXJuIHsgc3RhdHVzQ29kZTogMjAwLCBoZWFkZXJzLCBib2R5OiBKU09OLnN0cmluZ2lmeShwcm9qZWN0KSB9O1xyXG59XHJcblxyXG4vLyBQT1NUIHJlcXVlc3QgaGFuZGxlciB0byBjcmVhdGUgcHJvamVjdFxyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVQcm9qZWN0KGJvZHkpIHtcclxuICB0cnkge1xyXG4gICAgLy8gUGFyc2UgdGhlIGJvZHkgYW5kIGluc3RhbnRpYXRlIENyZWF0ZVByb2plY3RcclxuICAgIGNvbnN0IHJlcWJvZHkgPSBKU09OLnBhcnNlKGJvZHkpOyAvLyBQYXJzZSBKU09OIHN0cmluZyBpbnRvIGFuIG9iamVjdFxyXG4gICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBDcmVhdGVQcm9qZWN0KHJlcWJvZHkpOyAvLyB1c2UgQ3JlYXRlUHJvamVjdCBjbGFzcyB0byBjcmVhdGUgbmV3IG9iamVjdFxyXG5cclxuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBhd2FpdCBkYi5jb2xsZWN0aW9uKFwicHJvamVjdHNcIik7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdCA9IGF3YWl0IGNvbGxlY3Rpb24uaW5zZXJ0T25lKG5ld1Byb2plY3QpO1xyXG5cclxuICAgIC8vIFJldHVybiBzdWNjZXNzIHJlc3BvbnNlXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXNDb2RlOiAyMDQsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIixcclxuICAgICAgfSxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJvamVjdCksXHJcbiAgICB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgYWRkaW5nIG5ldyBwcm9qZWN0OlwiLCBlcnJvcik7XHJcblxyXG4gICAgLy8gUmV0dXJuIGVycm9yIHJlc3BvbnNlXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXNDb2RlOiA1MDAsIC8vIEludGVybmFsIFNlcnZlciBFcnJvclxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogXCJFcnJvciBhZGRpbmcgbmV3IHByb2plY3RcIiB9KSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vLyBQQVRDSCByZXF1ZXN0IGhhbmRsZXIgZm9yIHByb2plY3Qgd2l0aCBpZFxyXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVQcm9qZWN0KHByb2plY3RfaWQsIGJvZHkpIHtcclxuICBjb25zdCBjb2xsZWN0aW9uID0gYXdhaXQgcHJvamVjdHNfZGIuY29sbGVjdGlvbihcInByb2plY3RzXCIpO1xyXG4gIGNvbnN0IHJlcWJvZHkgPSBKU09OLnBhcnNlKGJvZHkpOyAvLyBQYXJzZSBKU09OIHN0cmluZyBpbnRvIGFuIG9iamVjdFxyXG5cclxuICBjb25zdCBxdWVyeSA9IHsgX2lkOiBuZXcgT2JqZWN0SWQocHJvamVjdF9pZCkgfTtcclxuICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IENyZWF0ZVByb2plY3QocmVxYm9keSk7XHJcbiAgY29uc3QgcHJvamVjdFVwZGF0ZXMgPSB7ICRzZXQ6IG5ld1Byb2plY3QgfTtcclxuICBjb25zdCBwcm9qZWN0ID0gYXdhaXQgY29sbGVjdGlvbi51cGRhdGVPbmUocXVlcnksIHByb2plY3RVcGRhdGVzKTtcclxuXHJcbiAgLy8gbWF0Y2hlZENvdW50ID0gMCAtPiBjaGVjayBpZiB0aGUgcHJvamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgX2lkIGRvZXNudCBleGlzdCBpbiB0aGUgZGF0YWJhc2UgWyBodHRwczovL3d3dy5tb25nb2RiLmNvbS9kb2NzL21hbnVhbC9yZWZlcmVuY2UvbWV0aG9kL2RiLmNvbGxlY3Rpb24udXBkYXRlT25lL11cclxuICBpZiAocHJvamVjdC5tYXRjaGVkQ291bnQgPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0YXR1c0NvZGU6IDQwNCxcclxuICAgICAgaGVhZGVycyxcclxuICAgICAgYm9keTogYFByb2plY3Qgd2l0aCAke3Byb2plY3RfaWR9IGRvb2Vzbid0IGV4aXN0YCxcclxuICAgIH07XHJcbiAgfVxyXG4gIHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgaGVhZGVycywgYm9keTogSlNPTi5zdHJpbmdpZnkocHJvamVjdCkgfTtcclxufVxyXG5cclxuLy8gREVMRVRFIHJlcXVlc3QgaGFuZGxlciBmb3IgcHJvamVjdCB3aXRoIGlkXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QocHJvamVjdF9pZCkge1xyXG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBhd2FpdCBwcm9qZWN0c19kYi5jb2xsZWN0aW9uKFwicHJvamVjdHNcIik7XHJcbiAgY29uc3QgcmVxYm9keSA9IEpTT04ucGFyc2UoYm9keSk7IC8vIFBhcnNlIEpTT04gc3RyaW5nIGludG8gYW4gb2JqZWN0XHJcbiAgY29uc3QgcXVlcnkgPSB7IF9pZDogbmV3IE9iamVjdElkKHByb2plY3RfaWQpIH07XHJcbiAgY29uc3QgcHJvamVjdCA9IGF3YWl0IGNvbGxlY3Rpb24uZGVsZXRlT25lKHF1ZXJ5KTtcclxuXHJcbiAgLyogICBjaGVjayBob3cgbWFueSBwcm9qZWN0cyBkZWxldGVkXHJcbiAgICAgIGRlbGV0ZWRDb3VudCAtPiBwcm9wZXJ0eSBvZiB0aGUgcmVzdWx0IG9iamVjdCByZXR1cm5lZCBieSBNb25nb0RCXHUyMDE5cyBkZWxldGVPbmUoKSBtZXRob2QuICBcclxuICAgICovXHJcbiAgaWYgKHByb2plY3QuZGVsZXRlZENvdW50ID09PSAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXNDb2RlOiA0MDQsXHJcbiAgICAgIGhlYWRlcnMsXHJcbiAgICAgIGJvZHk6IGBQcm9qZWN0IHdpdGggJHtwcm9qZWN0X2lkfSBkb29lc24ndCBleGlzdGAsXHJcbiAgICB9O1xyXG4gIH1cclxuICByZXR1cm4geyBzdGF0dXNDb2RlOiAyMDAsIGhlYWRlcnMsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByb2plY3QpIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsgLy8gZXhwb3J0IHJvdXRlciBtb2R1bGVcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBLFNBQVMsYUFBYSx3QkFBd0I7QUFDOUMsSUFBTSxNQUFNLFFBQVEsSUFBSTtBQUV4QixJQUFJLENBQUMsS0FBSztBQUNSLFFBQU0sSUFBSSxNQUFNLEdBQUc7QUFDckI7QUFnQkEsSUFBSSxlQUFlO0FBR25CLElBQU0sU0FBUyxJQUFJLFlBQVksS0FBSztBQUFBO0FBQUEsRUFFbEMsV0FBVztBQUFBLElBQ1QsU0FBUyxpQkFBaUI7QUFBQTtBQUFBLElBQzFCLFFBQVE7QUFBQTtBQUFBLElBQ1IsbUJBQW1CO0FBQUE7QUFBQSxFQUNyQjtBQUNGLENBQUM7QUFFRCxlQUFlLGNBQWM7QUFDM0IsTUFBSSxjQUFjO0FBRWhC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QWEsSUFBSSxjQUFjLE9BQU87QUFFNUMsVUFBTSxhQUFhLE1BQU0sR0FBRyxXQUFXLFVBQVU7QUFFakQsVUFBTSxVQUFVLE1BQU0sV0FBVyxVQUFVLFVBQVU7QUFHckQsV0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1AsZ0JBQWdCO0FBQUEsUUFDaEIsK0JBQStCO0FBQUEsTUFDakM7QUFBQSxNQUNBLE1BQU0sS0FBSyxVQUFVLE9BQU87QUFBQSxJQUM5QjtBQUFBLEVBQ0YsU0FBUyxPQUFPO0FBQ2QsWUFBUSxNQUFNLDZCQUE2QixLQUFLO0FBR2hELFdBQU87QUFBQSxNQUNMLFlBQVk7QUFBQTtBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1AsZ0JBQWdCO0FBQUEsUUFDaEIsK0JBQStCO0FBQUEsTUFDakM7QUFBQSxNQUNBLE1BQU0sS0FBSyxVQUFVLEVBQUUsU0FBUywyQkFBMkIsQ0FBQztBQUFBLElBQzlEO0FBQUEsRUFDRjtBQUNGO0FBR0EsZUFBZSxjQUFjLFlBQVlBLE9BQU07QUFDN0MsUUFBTSxhQUFhLE1BQU0sbUJBQVksV0FBVyxVQUFVO0FBQzFELFFBQU0sVUFBVSxLQUFLLE1BQU1BLEtBQUk7QUFFL0IsUUFBTSxRQUFRLEVBQUUsS0FBSyxJQUFJLFNBQVMsVUFBVSxFQUFFO0FBQzlDLFFBQU0sYUFBYSxJQUFJLGNBQWMsT0FBTztBQUM1QyxRQUFNLGlCQUFpQixFQUFFLE1BQU0sV0FBVztBQUMxQyxRQUFNLFVBQVUsTUFBTSxXQUFXLFVBQVUsT0FBTyxjQUFjO0FBR2hFLE1BQUksUUFBUSxpQkFBaUIsR0FBRztBQUM5QixXQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUEsTUFDWjtBQUFBLE1BQ0EsTUFBTSxnQkFBZ0IsVUFBVTtBQUFBLElBQ2xDO0FBQUEsRUFDRjtBQUNBLFNBQU8sRUFBRSxZQUFZLEtBQUssU0FBUyxNQUFNLEtBQUssVUFBVSxPQUFPLEVBQUU7QUFDbkU7QUFHQSxlQUFlLGNBQWMsWUFBWTtBQUN2QyxRQUFNLGFBQWEsTUFBTSxtQkFBWSxXQUFXLFVBQVU7QUFDMUQsUUFBTSxVQUFVLEtBQUssTUFBTSxJQUFJO0FBQy9CLFFBQU0sUUFBUSxFQUFFLEtBQUssSUFBSSxTQUFTLFVBQVUsRUFBRTtBQUM5QyxRQUFNLFVBQVUsTUFBTSxXQUFXLFVBQVUsS0FBSztBQUtoRCxNQUFJLFFBQVEsaUJBQWlCLEdBQUc7QUFDOUIsV0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1o7QUFBQSxNQUNBLE1BQU0sZ0JBQWdCLFVBQVU7QUFBQSxJQUNsQztBQUFBLEVBQ0Y7QUFDQSxTQUFPLEVBQUUsWUFBWSxLQUFLLFNBQVMsTUFBTSxLQUFLLFVBQVUsT0FBTyxFQUFFO0FBQ25FO0FBRUEsSUFBTyxrQkFBUTsiLAogICJuYW1lcyI6IFsiYm9keSIsICJoZWFkZXJzIl0KfQo=