var chai = require('chai');
var expect = chai.expect;
var Page = require('../models').Page;
var User = require('../models').User;
var supertest = require('supertest-as-promised');
var app = require('../app');
var agent = supertest.agent(app);

describe('http requests', function () {

  before(function beforeFn () {
    return User.sync({force: true})
    .then(function () {
      return Page.sync({force: true});
    });
  });

  beforeEach(function () {
    return Page.truncate();
  });

  describe('GET /wiki', function () {
    
    it('responds with 200', function () {
      return agent.get('/').expect(200);
    });

  });

  describe('GET /wiki/add', function () {
    
    it('responds with 200', function () {
      return agent.get('/wiki/add').expect(200);
    });

  });

  describe('GET /wiki/:urlTitle', function () {
    
    it('responds with 404 on page that does not exist', function () {
      return agent.get('/wiki/there_is_not_something_in_the_db_with_this_title').expect(404);
    });
    
    it('responds with 200 on page that does exist', function () {
      return Page.create({
        title: 'Example Page',
        content: 'This text does not really matter'
      })
      .then(function () {
        return agent.get('/wiki/Example_Page').expect(200);
      });
    });

  });

  describe('GET /wiki/search', function () {
    
    it('responds with 200', function () {
      return agent.get('/wiki/search').expect(200);
    });

  });

  describe('GET /wiki/:urlTitle/similar', function () {
    
    it('responds with 404 for page that does not exist', function () {
      return agent.get('/wiki/there_is_not_something_in_the_db_with_this_title/similar').expect(404);
    });
    
    it('responds with 200 for similar page', function () {
      return Page.create({
        title: 'Example Page',
        content: 'This text does not really matter'
      })
      .then(function () {
        return agent.get('/wiki/Example_Page/similar').expect(200);
      });
    });

  });

  describe('POST /wiki', function () {
    
    it('responds with 302', function () {
      return agent
      .post('/wiki/')
      .send({
        name: 'Omri',
        email: 'secret@omri.com',
        title: 'The page',
        content: 'Some facts about life'
      })
      .expect(302);
    });
    
    it('creates a page in the database', function () {
      return agent
      .post('/wiki/')
      .send({
        name: 'Omri',
        email: 'secret@omri.com',
        title: 'The page',
        content: 'Some facts about life'
      })
      .then(function () {
        return Page.findAll();
      })
      .then(function (pages) {
        expect(pages).to.have.length(1);
        expect(pages[0].title).to.equal('The page');
      });
    });

  });

});