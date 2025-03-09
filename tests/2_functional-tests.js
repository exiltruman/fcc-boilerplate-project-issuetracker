const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
            assigned_to: 'd',
            status_text: 'e'
        })
        .end((err, res) => { 
            assert.equal(res.body.issue_title, 'a')
            done();
        })
    })
    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .end((err, res) => { 
            assert.equal(res.body.issue_title, 'a')
            done();
        })
    })
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
        })
        .end((err, res) => { 
            assert.isDefined(res.body.error)
            done();
        })
    })
    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .end((err, res) => { 
            assert.equal(res.body.issue_title, 'a')
        })
        
        chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest')
        .end((err, res) => { 
            assert.isArray(res.body)
            done();
        })
    })
    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .end((err, res) => { 
            assert.equal(res.body.issue_title, 'a')
        })
        
        chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=true')
        .end((err, res) => { 
            assert.isArray(res.body)
            done();
        })
    })
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .end((err, res) => { 
            assert.equal(res.body.issue_title, 'a')
        })
        
        chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=true&issue_title=a')
        .end((err, res) => { 
            assert.isArray(res.body)
            assert.isAtLeast(res.body.length, 1)
            done();
        })
    })
    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .put('/api/issues/apitest')
               .send({
                   _id: issue._id,
                   issue_title: 'new'
               })
               .then((res) => {
                   assert.isDefined(res.body.result)
                   done();
               })
            })
        })
    })
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .put('/api/issues/apitest')
               .send({
                   _id: issue._id,
                   issue_title: 'new',
                   issue_text: 'new'
               })
               .then((res) => {
                   assert.isDefined(res.body.result)
                   done();
               })
            })
        })
    })
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .put('/api/issues/apitest')
               .send({
                   issue_title: 'new',
                   issue_text: 'new'
               })
               .then((res) => {
                   assert.isDefined(res.body.error)
                   done();
               })
            })
        })
    })
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .put('/api/issues/apitest')
               .send({
                    _id: issue._id,
               })
               .then((res) => {
                   assert.isDefined(res.body.error)
                   done();
               })
            })
        })
    })
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .put('/api/issues/apitest')
               .send({
                    _id: '1',
               })
               .then((res) => {
                   assert.isDefined(res.body.error)
                   done();
               })
            })
        })
    })
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .delete('/api/issues/apitest')
               .send({
                    _id: issue._id,
               })
               .then((res) => {
                   assert.isDefined(res.body.result)
                   done();
               })
            })
        })
    })
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .delete('/api/issues/apitest')
               .send({
                    _id: '1',
               })
               .then((res) => {
                   assert.isDefined(res.body.error)
                   done();
               })
            })
        })
    })
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
        let issue;

        chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
            issue_title: 'a',
            issue_text: 'b',
            created_by: 'c',
        })
        .then((res) => {
            return chai
            .request(server)
            .get('/api/issues/apitest')
            .then((res) => { 
               issue = res.body[0]; 
               return chai.request(server)
               .delete('/api/issues/apitest')
               .send({
                   
               })
               .then((res) => {
                   assert.isDefined(res.body.error)
                   done();
               })
            })
        })
    })
});
