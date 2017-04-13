const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Users/UsersDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

describe('UsersDAODynamoDB suite', function(done){
  let users = new dao(dynamo_client);

  it('Should forward data received from DB',function(done){
    users.getUser('mou').subscribe({
      next: (data) => {
        expect(data).to.not.be.null;
        expect(data.username).to.equal('mou');
        expect(data.name).to.equal('mauro');
      },
      error: (err) => {done(err);},
      complete: () => {done();}
    });
    dynamo_client.get.yield(null,{name: "mauro", username: "mou"});
  });

  it('Should notify of error', function(done){
    users.getUser('mou').subscribe({
      next: (data) => {done(data);},
      error: (err) => {done();},
      complete: () => {done('complete called');}
    });
    dynamo_client.get.yield({code:500, msg:"error downloading data"});
  });
})
