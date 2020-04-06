const express = require('express');

const server = express();

server.use(express.json());

const projects = [{
  id: '1',
  title: 'Novo projeto',
  tasks: []
}];

let i = 0;

server.use((req, res, next) => {  
  console.log(`Total de requisições: ${i++}`);
  next();
});

function checkProjectExist(req, res, next) {
  let projectExists = false;
  projects.map(project => {
    if(req.params.id === project.id) {
      projectExists = true;
    }
  })

  if(!projectExists) {
    return res.status(400).json({error: "ID not found"});
  }

  return next();
}

server.post('/projects', (req, res) => {
  const {
    id,
    title,
    tasks
  } = req.body;

  projects.push({
    id,
    title,
    tasks
  });

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExist, (req, res) => {
  const {
    id
  } = req.params;
  const {
    title
  } = req.body;

  projects.map(project => {
    if (id === project.id) {
      project.title = title;
    }
  });

  return res.json(projects);

});

server.delete('/projects/:id', checkProjectExist, (req, res) => {
  const {
    id
  } = req.params;
  let idToBeDeleted;

  projects.map((project, index) => {
    if (id === project.id) {
      idToBeDeleted = index;
    }
  });

  projects.splice(idToBeDeleted, 1);

  return res.json(projects);
})

server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
  const {
    id
  } = req.params;
  const {
    title
  } = req.body;

  let i;

  projects.map((project, index) => {
    if (id === project.id) {
      project.tasks.push(title);
      i = index;
    }
  });

  return res.json(projects[i]);

})

server.listen(3000);