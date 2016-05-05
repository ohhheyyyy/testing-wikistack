var expect = require('chai').expect;
var chai = require('chai');
var Promise = require('bluebird');
chai.should();
chai.use(require('chai-things'));
var spies = require('chai-spies');
chai.use(spies);

var models = require('../models/');

var Page = models.Page;

// Page model test
describe('Page model', function() {
    before(function(done) {
        Page.sync({ force: true })
            .then(function() {
                done();
            })
            .catch(done);
    });

    describe('Virtuals', function() {
        var page;
        beforeEach(function() {
            page = Page.build();
        });
        describe('route', function() {
            it('returns the url_name prepended by "/wiki/"', function() {
                page.urlTitle = 'some_title';
                expect(page.route).to.be.equal('/wiki/some_title');
            });
        });
        describe('renderedContent', function() {
            it('converts the markdown-formatted content into HTML', function() {
                page.content = "I am using __markdown__.";
                expect(page.renderedContent).to.be.equal("<p>I am using <strong>markdown</strong>.</p>\n");
            });
        });
    });

    describe('Class methods', function(done) {
        var page;
        beforeEach(function(done) {
            Page.create({
                    title: 'foo',
                    content: 'bar',
                    tags: ['foo', 'bar']
                })
                .then(function(createdPage) {
                    page = createdPage;
                    done();
                })
                .catch(done);
        });
        describe('findByTag', function() {
            it('gets pages with the search tag', function(done) {
                Page.findByTag('bar')
                    .then(function(pages) {
                        expect(pages).to.have.lengthOf(1);
                        done();
                    })
                    .catch(done);
            });
            it('does not get pages without the search tag', function(done) {
                Page.findByTag('falafel')
                    .then(function(pages) {
                        expect(pages).to.have.lengthOf(0);
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('Instance methods', function() {
        var page1;
        var page2;
        var page3;
        beforeEach(function(done) {
            Promise.all([
                    Page.create({
                        title: 'page1',
                        content: 'page1 content',
                        tags: ['help', 'me']
                    }),

                    Page.create({
                        title: 'page2',
                        content: 'page2 content',
                        tags: ['thank', 'me']
                    }),

                    Page.create({
                        title: 'page3',
                        content: 'page3 content',
                        tags: ['cool']
                    })
                ]).spread(function(p1, p2, p3) {
                    page1 = p1;
                    page2 = p2;
                    page3 = p3;
                    done();
                })
                .catch(done);
        });
        afterEach(function(done) {
            Page.sync({ force: true })
                .then(function() {
                    done();
                })
                .catch(done);
        });

        describe('findSimilar', function() {
            it('never gets itself', function(done) {
                page1.findSimilar()
                    .then(function(foundPages) {
                        expect(foundPages[0].dataValues.title).to.not.equal("page1");
                        done();
                    })
                    .catch(done);
            });
        });
        it('gets other pages with any common tags', function(done) {
            page1.findSimilar()
                .then(function(foundPages) {
                    expect(foundPages).to.have.deep.property("[0].dataValues.title", "page2");
                    done();
                })
                .catch(done);
        });
        it('does not get other pages without any common tags', function(done) {
            page3.findSimilar()
                .then(function(foundPages) {
                    expect(foundPages).to.have.length(0);
                    done();
                });
        });
    });

    describe('Validations', function() {
        var page;
        beforeEach(function() {
            page = Page.build();
        });
        it('errors without title', function(done) {
            page.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.exist;
                    expect(err.errors[0].path).to.equal('title');
                    done();
                });
        });
        it('errors without content', function(done) {
            page.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.exist;
                    expect(err.errors[1].path).to.equal('content');
                    done();
                });
        });

        it('errors given an invalid status', function(done) {
            page.validate()
                .then(function(err) {
                  //console.log("err looks like: ", err);
                    expect(err).to.exist;
                    expect(err.errors).to.exist;
                    expect(err.errors[1].path).to.equal('content');
                    done();
                });
        });
    });

    describe('Hooks', function() {
        it('it sets urlTitle based on title before validating');

    });
});
