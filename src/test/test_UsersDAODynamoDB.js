const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Users/UsersDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

let next, error, complete;
beforeEach(function()
{
	next = sinon.stub();
	error = sinon.stub();
	complete = sinon.stub();
  dynamo_client._reset();
});

describe('Back-end', function()
{
  describe('Users', function()
  {
    describe('UsersDAODynamoDB', function()
		{
      let users = new dao(dynamo_client);
      describe('addUser', function()
      {
        it("Nel caso in cui l'utente non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          users.addUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

					//TableName: [nome tabella che non esiste]
					dynamo_client.put.yield({statusCode: 400, message:"Requested resource not found"});

					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(400);

					expect(next.callCount).to.equal(0);

					expect(complete.callCount).to.equal(0);
        });

				it("Nel caso in cui l'utente sia aggiunto correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					users.addUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield(null, {});
					expect(error.callCount).to.equal(0);
					expect(complete.callCount).to.equal(1);
				});
      });

      describe('getUser', function()
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					users.getUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

					dynamo_client.get.yield({statusCode: 500, message:"error getting data"});

					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);

					expect(next.callCount).to.equal(0);

					expect(complete.callCount).to.equal(0);
				});

				it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
        {
          let observable = users.getUser('mou');
          observable.subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });

					dynamo_client.get.yield(null, {Item: {name: "mauro", username: "mou"}});

					expect(error.callCount).to.equal(0);

					expect(next.callCount).to.equal(1);
					let callNext = next.getCall(0);
					expect(callNext.args[0].name).to.equal('mauro');
					expect(callNext.args[0].username).to.equal('mou');

					expect(complete.callCount).to.equal(1);
        });
      });

      describe('getUserList', function()
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					users.getUserList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

					dynamo_client.scan.yield(null, {Items: [{name: "mauro", username: "mou"}], LastEvaluatedKey: 'piero'});
					dynamo_client.scan.yield(null, {Items: [{name: "piero", username: "sun"}], LastEvaluatedKey: 'marco'});
					dynamo_client.scan.yield({statusCode: 500});

					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);

          expect(next.callCount).to.equal(2);

					let callNext = next.getCall(0);
					expect(callNext.args[0].name).to.equal('mauro');
					expect(callNext.args[0].username).to.equal('mou');

					callNext = next.getCall(1);
					expect(callNext.args[0].name).to.equal('piero');
					expect(callNext.args[0].username).to.equal('sun');

					expect(complete.callCount).to.equal(0);
				});

				it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
				{
					users.getUserList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

					dynamo_client.scan.yield(null, {Items: [{name: "mauro", username: "mou"}], LastEvaluatedKey: 'piero'});
					dynamo_client.scan.yield(null, {Items: [{name: "piero", username: "sun"}]}); // Ultimo elemento da ottenere

					expect(error.callCount).to.equal(0);

					expect(next.callCount).to.equal(2);

					let callNext = next.getCall(0);
					expect(callNext.args[0].name).to.equal('mauro');
					expect(callNext.args[0].username).to.equal('mou');

					callNext = next.getCall(1);
					expect(callNext.args[0].name).to.equal('piero');
					expect(callNext.args[0].username).to.equal('sun');

					expect(complete.callCount).to.equal(1);
				});

				it("Nel caso in cui il metodo venga chiamato con queryStringParameters con un solo attributo, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati filtrati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
				{
					let query =
					{
						name: 'mauro'
					};

					users.getUserList(query).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

					dynamo_client.scan.yield(null, {Items: [{name: "mauro", username: "mou"}], LastEvaluatedKey: 'sun'});
					dynamo_client.scan.yield(null, {Items: [{name: "mauro", username: "sun"}]}); // Ultimo elemento da ottenere

					let callScan = dynamo_client.scan.getCall(0);
          expect(callScan.args[0]).to.have.deep.property('FilterExpression', 'full_name = :full_name');
					expect(callScan.args[0]).to.have.deep.property('ExpressionAttributeValues.:full_name', 'mauro' );

					expect(error.callCount).to.equal(0);

					expect(next.callCount).to.equal(2);

					let callNext = next.getCall(0);
					expect(callNext.args[0].name).to.equal('mauro');
					expect(callNext.args[0].username).to.equal('mou');

					callNext = next.getCall(1);
					expect(callNext.args[0].name).to.equal('mauro');
					expect(callNext.args[0].username).to.equal('sun');
				});

				it("Nel caso in cui il metodo venga chiamato con queryStringParameters con due attributi, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati filtrati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
				{
					let query =
					{
						name: 'mauro',
						slack_channel: 'channel'
					};

					users.getUserList(query).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

					dynamo_client.scan.yield(null, {Items: [{name: "mauro", username: "mou"}], LastEvaluatedKey: 'sun'});
					dynamo_client.scan.yield(null, {Items: [{name: "mauro", username: "sun"}]}); // Ultimo elemento da ottenere

					let callScan = dynamo_client.scan.getCall(0);
          expect(callScan.args[0]).to.have.deep.property('FilterExpression', 'full_name = :full_name and slack_channel = :slack_channel');
					expect(callScan.args[0]).to.have.deep.property('ExpressionAttributeValues.:full_name', 'mauro' );
					expect(callScan.args[0]).to.have.deep.property('ExpressionAttributeValues.:slack_channel', 'channel' );

					expect(error.callCount).to.equal(0);

					expect(next.callCount).to.equal(2);

					let callNext = next.getCall(0);
					expect(callNext.args[0].name).to.equal('mauro');
					expect(callNext.args[0].username).to.equal('mou');

					callNext = next.getCall(1);
					expect(callNext.args[0].name).to.equal('mauro');
					expect(callNext.args[0].username).to.equal('sun');
				});
      });

      describe('removeUser', function()
      {
        it("Nel caso in cui l'utente non venga rimosso a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          users.removeUser('mou').subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });

					dynamo_client.delete.yield({statusCode: 500, message: "error removing user"});

					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);

					expect(next.callCount).to.equal(0);

					expect(complete.callCount).to.equal(0);
        });

				it("Nel caso in cui l'utente sia rimosso correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta", function()
        {
          users.removeUser('mou').subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.delete.yield(null, {});
					expect(error.callCount).to.equal(0);
					expect(complete.callCount).to.equal(1);
        });
      });

      describe('updateUser', function()
      {
        it("Nel caso in cui l'utente non venga modificato a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					users.updateUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

					dynamo_client.put.yield({statusCode: 500, message: "error updating user"});

					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);

					expect(next.callCount).to.equal(0);

					expect(complete.callCount).to.equal(0);
				});

				it("Nel caso in cui l'utente sia modificato correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					users.updateUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield(null, {});
					expect(error.callCount).to.equal(0);
					expect(complete.callCount).to.equal(1);
				});
      });
		});
	});
});
