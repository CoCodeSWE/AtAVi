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
    describe('UsersDAODynamoDB', function(done)
		{
      let users = new dao(dynamo_client);
      describe('addUser', function(done)
      {
        it("Nel caso in cui l'utente non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto", function(done)
        {
          users.addUser('mou').subscribe(
					{
						next: (data) => {done(data);},
						error: (err) => {done();},
						complete: () => {done('complete called');}
					});
					//TableName: [nome tabella che non esiste]
					dynamo_client.put.yield({code:400, msg:"Requested resource not found"});
        });

				it("Nel caso in cui l'utente sia aggiunto correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta", function(done)
				{
					users.addUser('mou').subscribe(
					{
						next: function(data)
						{
							expect(data).to.not.be.null;
						},
						error: (err) => {done(err)},
						complete: done
					});
					dynamo_client.put.yield(null, {});
				});
      });

      describe('getUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto", function(done)
				{
					users.getUser('mou').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
				});

				it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
        {
          let observable = users.getUser('mou');
          observable.subscribe(
          {
            next: function(data)
            {
              expect(data).to.not.be.null;
              expect(data.username).to.equal('mou');
              expect(data.name).to.equal('mauro');
            },
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.get.yield(null, {name: "mauro", username: "mou"});
        });
      });

      describe('getUserList', function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");

				it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta");
      });

      describe('removeUser', function(done)
      {
        it("Nel caso in cui l'utente non venga rimosso a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto", function(done)
        {
          users.removeUser('mou').subscribe(
          {
            next: (data) => {done(data);},
            error: done,
            complete: () => {done('complete called');}
          });
          dynamo_client.delete.yield({code: 500, msg:"error removing user"});
        });

				it("Nel caso in cui l'utente sia rimosso correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta", function(done)
        {
          users.removeUser('mou').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done(err);},
            complete: done
          });
          dynamo_client.delete.yield(null, {code: 200, msg:"success"});
        });
      });

      describe('updateUser', function(done)
      {
        it("Nel caso in cui l'utente non venga modificato a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto", function(done)
				{
					users.updateUser('mou').subscribe(
					{
						next: (data) => {done(data);},
						error: done,
						complete: () => {done('complete called');}
					});
					dynamo_client.update.yield({code: 500, msg:"error updating user"});
				});

				it("Nel caso in cui l'utente sia modificato correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta", function(done)
				{
					/* valore di data in caso l'utente sia stato modificato correttamente
					"Attributes": {
						1 parametro modificato: nuovo valore 1 parametro,
						2 parametro modificato: nuovo valore 2 parametro,
						...
						n parametro modificato: nuovo valore n parametro
					}
					*/
					users.updateUser('mou').subscribe(
					{
						next: function(data)
						{
							expect(data).to.not.be.null;
							expect(data.Attributes.name).to.equal('Mauro');
						},
						error: (err) => {done(err);},
						complete: done
					});

					dynamo_client.update.yield(null, {"Attributes": {"name": "Mauro"}});
				});
      });
		});
	});
});
