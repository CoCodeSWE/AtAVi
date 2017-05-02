const users_service = require('../Back-end/Users/UsersService');
const chai = require('chai');
const expect = chai.expect;
const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const users_DAO = require('./stubs/UsersDAO');
const context = require('./stubs/LambdaContext');

beforeEach(function()
{
  service = new users_service(users_DAO);
	context.succeed = sinon.stub();
});

describe('Back-end', function()
{
  describe('Users', function()
  {
    describe('UsersService', function()
    {
      let users = new users_service(users_DAO);
      describe('addUser', function()
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.addUser.returns(Rx.Observable.throw(new Error()));
          let user=
          {
            name: "Mauro",
            username: "mou"
          };
          let ev = { body: JSON.stringify(user) };
          service.addUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });

        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200", function()
        {
          users_DAO.addUser.returns(Rx.Observable.empty());
          let user=
          {
            name: "Mauro",
            username: "mou"
          };
          let ev = { body: JSON.stringify(user) };
          service.addUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'success' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });

        it("Nel caso in cui sia passato un parametro non atteso, il campo \\file{statusCode} della risposta deve essere impostato a 400",function()
        {
	        users_DAO.addUser.returns(Rx.Observable.throw(new Error()));
          let ev = { body: "" };
          service.addUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Bad Request' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 400);
        });
				
				it("Nel caso in cui sia passato un oggetto la cui chiave primaria è uguale a quella di un oggetto già esistente, il campo statusCode della risposta deve essere impostato a 409", function()
        {
          users_DAO.addUser.returns(Rx.Observable.throw({ code: 'ConditionalCheckFailedException' }));
          let user=
          {
            name: "Mauro",
            username: "mou"
          };
          let ev = { body: JSON.stringify(user) };
          service.addUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Conflict' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 409);
        });
      });
      describe('deleteUser', function()
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.removeUser.returns(Rx.Observable.throw(new Error()));
          let ev = { pathParameters: { username: 'mou' }};
          service.deleteUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });

        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200", function()
        {
          users_DAO.removeUser.returns(Rx.Observable.empty());
          let ev = { pathParameters: { username: 'mou' }};
          service.deleteUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'success' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });

				it("Nel caso in cui sia passato uno username non esistente, il campo \\file{statusCode} della risposta deve essere impostato a 404", function()
        {
					users_DAO.removeUser.returns(Rx.Observable.throw({ code: 'ConditionalCheckFailedException' }));
					let ev = { pathParameters: { username: 'pippo' }};
					service.deleteUser(ev, context);
					let call = context.succeed.getCall(0);
					expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
					expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Not found' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 404);
        });
      });
      describe('getUser', function()
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.getUser.returns(Rx.Observable.throw(new Error()));
          let ev = { pathParameters: { username: 'mou'} };
          service.getUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });

        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere l'utente richiesto", function()
        {
          users_DAO.getUser.returns(Rx.Observable.of({ name : 'Mauro', username : 'mou' }));
          let ev = { pathParameters: { username: 'mou'} };
          service.getUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
					expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ name : 'Mauro', username : 'mou' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });

        it("Nel caso in cui sia passato uno username non esistente, il campo \\file{statusCode} della risposta deve essere impostato a 404", function()
        {
					users_DAO.getUser.returns(Rx.Observable.throw({ code: 'Not found' }));
          let ev = { pathParameters: { username: 'pippo'} };
          service.getUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Not found' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 404);
        });
      });
      describe('getUserList', function()
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.getUserList.returns(Rx.Observable.throw(new Error()));
          let ev = { queryStringParameters: {} };
          service.getUserList(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });

        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere la lista degli utenti", function()
        {
          users_DAO.getUserList.returns(Rx.Observable.of({ name : 'Mauro', username : 'mou' }, { name : 'Nicola', username : 'tinto' }));
          let ev = { queryStringParameters: {} };
          service.getUserList(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
					expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ users: [{ name : 'Mauro', username : 'mou' }, { name : 'Nicola', username : 'tinto' }] }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });
      });
      describe('updateUser', function()
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.updateUser.returns(Rx.Observable.throw(new Error()));
          let user =
          {
            name: "gianluca"
          };
          let ev = { pathParameters: "mou", body: JSON.stringify(user) };
          service.updateUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });

        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200", function()
        {
          users_DAO.updateUser.returns(Rx.Observable.empty());
          let user =
          {
            name: "gianluca"
          };
          let ev = { pathParameters: "mou", body: JSON.stringify(user) };
          service.updateUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'success' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });

        it("Nel caso in cui sia passato un parametro non atteso, il campo \\file{statusCode} della risposta deve essere impostato a 400", function()
        {
          let ev = { pathParameters: "", body: "" };
          service.updateUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Bad Request' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 400);
        });
      });
    });
  });
});
