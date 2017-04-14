const NotificationService = require('../Back-end/Notifications/NotificationService');
const chai = require('chai');
const expect = chai.expect;

describe('Back-end', function(done)
{
  describe('Notifications', function(done)
  {
    describe('NotificationService', function(done)
    {
      describe('getChannelList', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo statusCode della risposta deve essere impostato a 500");
        it("Nel caso in cui non si verifichino errori, il campo statusCode della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere la lista dei canali Slack (utenti, canali pubblici e gruppi privati) in formato JSON");
      });
      describe('sendMsg', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo statusCode della risposta deve essere impostato a 500");
        it("Nel caso in cui non si verifichi nessun un errore, il campo statusCode della risposta deve essere impostato a 200");
      });
    });

  });
});
