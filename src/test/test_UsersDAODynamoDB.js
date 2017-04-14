const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Users/UsersDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

describe('Back-end', function(done)
{
  describe('Users', function(done)
  {
    describe('UsersDAODynamoDB', function(done){
      let users = new dao(dynamo_client);
      describe('addUser', function(done)
      {
        it("Nel caso in cui l'utente non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");
        it("Nel caso in cui l'utente sia aggiunto correttamento, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta");
      });

      describe('getUser',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta");
      });

      describe('getUserList',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta");
      });

      describe('removeUser',function(done)
      {
        it("Nel caso in cui l'utente non venga rimosso a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");
        it("Nel caso in cui l'utente sia rimosso correttamento, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta");

      });

      describe('updateUser',function(done)
      {
        it("Nel caso in cui l'utente non venga modificato a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");
        it("Nel caso in cui l'utente sia modificato correttamento, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta");
      });
  });
});
  /* CODICE VECCHIO TEST
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
});*/
});
