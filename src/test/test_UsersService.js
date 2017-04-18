const users_service = require('../Back-end/Users/UsersService');
const chai = require('chai');
const expect = chai.expect;
const users_DAO = require('./stubs/UsersDAO');
const context = require('./stubs/LambdaContext');

beforeEach(function()
{
  service = new users_service(users_DAO);
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
          let ev = { body: JSON.stringfy(user); }
          service.addUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{}, statusCode: 500});

        });
        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200", function()
        {
          users_DAO.addUser.returns(Rx.Observable.empty());
          let user=
          {
            name: "Mauro",
            username: "mou"
          };
          let ev = { body: JSON.stringfy(user); }
          service.addUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{}, statusCode: 200});
        });
        it("Nel caso in cui sia passato un parametro non atteso, il campo \\file{statusCode} della risposta deve essere impostato a 400",function()
        {
	        users_DAO.addUser.returns(Rx.Observable.throw(new Error()));
          let ev = { body: "" };
          service.addUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({ body:{}, statusCode: 400 });
        });
      });
      describe('deleteUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.removeUser.returns(Rx.Observable.throw(new Error()));
          let ev = { pathParameters: 'mou' };
          service.deleteUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : {}, statusCode : 500});
        });
        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200", function()
        {
          users_DAO.removeUser.returns(Rx.Observable.empty());
          let ev = { pathParameters: 'mou' }
          service.deleteUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : {}, statusCode : 200});
        });
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400", function()
        {
          let ev = {pathParameters: ""};
          service.deleteUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : {}, statusCode : 200});
        });
      });
      describe('getUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.getUser.returns(Rx.Observable.throw(new Error()));
          let ev = { pathParameters: 'mou' };
          service.getUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : {}, statusCode : 500});
        });
        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere l'utente richiesto", function()
        {
          users_DAO.getUser.returns(Rx.Observable.of({ name : 'Mauro', username : 'mou' }));
          let ev = { pathParameters: 'mou' };
          service.getUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : { name : 'Mauro', username : 'mou' }, statusCode : 200});
        });
        it("Nel caso in cui sia passato un parametro non atteso, il campo \\file{statusCode} della risposta deve essere impostato a 400", function()
        {
          let ev = {pathParameters: ""};
          service.getUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{}, statusCode: 400});
        });
      });
      describe('getUserList', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.getUserList.returns(Rx.Observable.throw(new Error()));
          let ev = {};
          service.getUserList(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : {}, statusCode : 500});
        });
        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere la lista degli utenti", function()
        {
          users_DAO.getUserList.returns(Rx.Observable.of({ name : 'Mauro', username : 'mou' }, { name : 'Nicola', username : 'tinto' }));
          let ev = {};
          service.getUserList(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : [{ name : 'Mauro', username : 'mou' }, { name : 'Nicola', username : 'tinto' }], statusCode : 200});
        });
        it("Nel caso in cui sia passato un parametro non atteso, il campo \\file{statusCode} della risposta deve essere impostato a 400", function()
        {
          let ev = {pathParameters: ""};
          service.getUserList(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({ body : JSON.stringfy(user) }, statusCode: 400 });
        });
      });
      describe('updateUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \\file{statusCode} della risposta deve essere impostato a 500", function()
        {
          users_DAO.updateUser.returns(Rx.Observable.throw(new Error()));
          let user =
          {
            name: "gianluca"
          };
          let ev = {pathParameters: "mou", body: JSON.stringfy(user)};
          service.updateUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : {}, statusCode : 500});
        });
        it("Nel caso in cui non si verifichino errori, il campo \\file{statusCode} della risposta deve essere impostato a 200", function()
        {
          users_DAO.updateUser.returns(Rx.Observable.empty());
          let user =
          {
            name: "gianluca"
          };
          let ev = { pathParameters: "mou", body: JSON.stringfy(user) };
          service.updateUser(ev, context);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body : { name : 'gianluca' }, statusCode : 200});
        });
        it("Nel caso in cui sia passato un parametro non atteso, il campo \\file{statusCode} della risposta deve essere impostato a 400", function()
        {
          let ev = {pathParameters: "", body: ""};
          service.updateUser(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({ body : ""}, statusCode: 400 });
        });
      });
    });
  });
});
