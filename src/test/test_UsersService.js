const users_service = require('../Back-end/Users/UsersService');
const chai = require('chai');
const expect = chai.expect;
const users_DAO = require('/stubs/UsersDAO');

describe('Back-end', function(done)
{
  describe('Users', function(done)
  {
    describe('UsersService', function(done)
    {
      let users = new users_service(users_DAO);
      describe('addUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500",function(done)
        {

        }
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400");
      });
      describe('deleteUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400");
      });
      describe('getUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere l'utente richiesto");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400");
      });
      describe('getUserList', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere la lista degli utenti");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400");
      });
      describe('updateUser', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo \file{statusCode} della risposta deve essere impostato a 500");
        it("Nel caso in cui non si verifichino errori, il campo \file{statusCode} della risposta deve essere impostato a 200");
        it("Nel caso in cui sia passato un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400");
      });
    });
  });
});
