const RulesService = require('../Back-end/Rules/RulesService');
const chai = require('chai');
const expect = chai.expect;
const taskDAO = require('./stubs/TasksDAO');
const rulesDAO = require('./stubs/RulesDAO');
const context = require('./stubs/LambdaContext');

describe('Back-end', function(done)
{
  describe('Rules', function(done)
  {
    describe('RulesService', function(done)
    {
      beforeEach(function()
      {
      let rules = new RulesService(taskDAO,rulesDAO);
    });
      describe('addRule', function(done)
      {
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.",function(done)
        {
          let ev =
          {
            body:''
          };

          rules.addUser(ev,context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{}, statusCode: 400; done();});

        });
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.",function(done)
        {
          let rule =
          {
            "enabled": false,
            "id": 1,
            "name" : "testRule",
            "targets":
              [
                {
                  "company": "testCompany",
                  "member": "testMember",
                  "name": "testName"
                }
              ],
            "task":
              {
                "params":
                  {
                    "param":"testParam"
                  },
                "task": "testTask"
            }
          };
          let ev =  { body: JSON.stringfy(rule); }
          rules.addUser(ev,context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{}, statusCode: 500; done();});
      });
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200.",function(done)
        {
          let rule =
          {
            "enabled": false,
            "id": 1,
            "name" : "testRule",
            "targets":
              [
                {
                  "company": "testCompany",
                  "member": "testMember",
                  "name": "testName"
                }
              ],
            "task":
              {
                "params":
                  {
                    "param":"testParam"
                  },
                "task": "testTask"
            }
          };
          let ev =  { body: JSON.stringfy(rule); }
          rules.addUser(ev,context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{}, statusCode: 200; done();});
        });
      describe('deleteRule', function(done)
      {
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.");
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200.");
        it("Nel caso in cui la \file{Rule} richiesta non sia disponibile, il campo \file{statusCode} della risposta deve essere impostato a 404.");
      });
      describe('getRule', function(done)
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200 e il campo \file{body} deve contenere la \file{Rule} cercata.");
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.");
        it("Nel caso in cui la \file{Rule} richiesta non sia disponibile, il campo \file{statusCode} della risposta deve essere impostato a 404.");
      });
      describe('getRuleList', function(done)
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200 e il campo \file{body} deve contenere la lista delle \file{Rule}.");
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.");
      });
      describe('getTask', function(done)
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200 e il campo \file{body} deve contenere la lista dei \file{Task}.");
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
      });
      describe('getTaskList', function(done)
      {
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.");
      });
      describe('queryRule', function(done)
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200 e il campo \file{body} deve contenere la lista delle \file{Rule} da applicare ad un determinato caso.");
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.");
      });
      describe('updateRule', function(done)
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200.");
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.");
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.");
      });

    });
  });
});
