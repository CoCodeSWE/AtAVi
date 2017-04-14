
const VAMessageListener = require('../Back-end/Events/VAMessageListener');
const chai = require('chai');
const expect = chai.expect;

describe('Back-end', function(done)
{
  describe('Events', function(done)
  {
    describe('VAMessageListener', function(done)
    {
      describe('onMessage', function(done)
      {
        it("Nel caso in cui la chiamata al microservizio \\file{Notification} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null");
        it("Nel caso in cui la chiamata al microservizio \\file{Rules} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null");
        it("Nel caso in cui la chiamata ai metodi di\\file{GuestsDAO} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null");
        it("Nel caso in cui la chiamata ai metodi di\\file{ConversationsDAO} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null");
        it("Nel caso in cui non ci siano errori, la funzione di callback deve essere chiamata con due parametri, il primo dei quali uguale a null");
      });
    });
  });
});
