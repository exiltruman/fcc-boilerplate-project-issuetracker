'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

  const projects = [];

  const requiredFieldsForProjectIssue = ['issue_title', 'issue_text', 'created_by'];
  const optionalFieldsFroProjectIssue = ['assigned_to', 'status_text'];

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      res.json(projects[project]?.issues)
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const b = req.body;

      requiredFieldsForProjectIssue.map((field) => {
        if(!b[field]) res.json({ error: 'required field(s) missing' })
      })

      if (!projects[project]) {
        projects[project] = {issues: []}
      }

      const issue = {
        _id: uuidv4(),
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        ...b
      }

      optionalFieldsFroProjectIssue.map((field) => {
        if (!b[field]) issue[field] = '';
      })

      projects[project].issues.push(issue);
      console.log(JSON.stringify(issue));
      res.json(issue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
