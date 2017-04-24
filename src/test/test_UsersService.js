const UsersService = require('../Back-end/Users/UsersService');
const chai = require('chai');
const expect = chai.expect;

const context = require('./stubs/LambdaContext');

describe('Back-end', function(done)
{
  //service = ... //dependency injection stub
  describe('Users', function(done)
  {
    describe('UsersService', function(done)
    {
      describe('addUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500.");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200.", function()
        {
          let user=
          {
            name: "Mauro",
            username: "mou"
          };
          let ev = { body: JSON.stringfy(user) }
          service.addUser(ev, context);
          let call = context.succeed.getCall(0);

          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{}, statusCode: 200});
        });
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
      });
      describe('deleteUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500.");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200.");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
      });
      describe('getUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500.");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere l'utente richiesto.");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
      });
      describe('getUserList', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500.");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere la lista degli utenti.");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
      });
      describe('updateUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500.");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200.");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
      });
    });
  });
});
