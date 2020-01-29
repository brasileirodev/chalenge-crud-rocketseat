const express = require("express");
const server = express();

server.use(express.json());

projects = [];
requisitionCounter = 0;
server.use((req, res, next) => {
  requisitionCounter++;
  console.log(
    `-------------------\nRequest Number:${requisitionCounter} \nRequest type: ${req.method} \nURL:${req.url}`
  );
  next();
});

function checkProjectExist(req, res, next) {
  const project = projects[req.params.id];
  if (!project) {
    console.log({ error: "400 Bad request" });
    return res.status(400).json({ error: "Projeto inexistente" });
  }
  return next();
}

server.get("/", (req, res) => {
  return res.json({ message: "Ok" });
});

server.post("/projects", (req, res, next) => {
  const { id, title, tasks } = req.body;
  projects.push({ id, title, tasks });

  return res.json(projects);
});
server.get("/projects", (req, res, next) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExist, (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  projects[id].title = title;
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExist, (req, res, next) => {
  const { id } = req.params;
  projects.splice(id, 1);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  projects[id].tasks.push(title);
  return res.json(projects[id]);
});

server.listen(3000);
