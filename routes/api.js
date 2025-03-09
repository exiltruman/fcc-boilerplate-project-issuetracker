'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

  const projects = [];

  const requiredFieldsForProjectIssue = ['issue_title', 'issue_text', 'created_by'];
  const optionalFieldsFroProjectIssue = ['assigned_to', 'status_text'];
  const otherValidFieldsForProjectIssue = ['_id', 'created_on', 'updated_on', 'open']

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let queryParams = [];

      if(req.query) {
        queryParams = Object.keys(req.query).filter((queryParam) => {
          return [...requiredFieldsForProjectIssue, ...optionalFieldsFroProjectIssue, ...otherValidFieldsForProjectIssue].includes(queryParam);
        })
      }

      const result = projects[project]?.issues.filter((issue) => {
        return queryParams.length ? queryParams.every((queryParam) => {
          return String(issue[queryParam]) === String(req.query[queryParam])
        }) : true
      })

      res.json(result)
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
      res.json(issue);
    })
    
    .put(function (req, res){
      let project = req.params.project;

      if(!req.body._id) res.json({ error: 'missing _id' })

      const reqId = req.body._id;
      let issue = projects[project].issues.find((issue) => issue._id === reqId);
      if(issue) {
        Object.keys(req.body).map((key) => {
          issue[key] = req.body[key];
        })
        issue.updated_on = new Date();
      }

      res.json({  result: 'successfully updated', '_id': req.body._id })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
      const reqId = req.body._id;
      if(!reqId) res.json({ error: 'missing _id' })

      if(projects[project].issues.find(({_id}) => _id === reqId)) {
        projects[project].issues = projects[project].issues.filter(({_id}) => _id !== reqId)
        res.json({ result: 'successfully deleted', '_id': reqId })
      } else {
        res.json({ error: 'could not delete', '_id': reqId })
      }
    });
    
};
