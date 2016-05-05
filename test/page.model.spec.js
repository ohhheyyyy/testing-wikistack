var expect = require('chai').expect;
var chai = require('chai');
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
        afterEach(function(done){
           Page.sync({ force: true })
            .then(function() {
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

                done();

            });
        });
    });

    describe('Instance methods', function() {
        describe('findSimilar', function() {
            it('never gets itself');
            it('gets other pages with any common tags');
            it('does not get other pages without any common tags');
        });
    });

    describe('Validations', function() {
        it('errors without title');
        it('errors without content');
        it('errors given an invalid status');
    });

    describe('Hooks', function() {
        it('it sets urlTitle based on title before validating');
    });

});





// describe("Page.title", function() {
//     it("return", function() {
//         expect(2 + 2).to.be.equal(4);
//     });
// });
// describe("Page.urlTitle", function() {

// });
// describe("Page.content", function() {

// });
// describe("Page.status", function() {

// });
// describe("Page.date", function() {

// });
// describe("Page.tags", function() {

// });
