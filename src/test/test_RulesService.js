const RulesService = require('../Back-end/Rules/RulesService');
const chai = require('chai');
const expect = chai.expect;
const Rx = require('rxjs');
const taskDAO = require('./stubs/TasksDAO');
const rulesDAO = require('./stubs/RulesDAO');
const context = require('./stubs/LambdaContext');



beforeEach(function()
{
  let rules = new RulesService(taskDAO, rulesDAO);
});

describe('Back-end', function()
{
  describe('Rules', function()
  {
    describe('RulesService', function()
    {
      describe('addRule', function()
      {
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.", function()
        {
          rulesDAO.addRule.returns(Rx.Observable.throw(new Error()));
          let ev = {body: ""};
          rules.addRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 400});
        });
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.", function()
        {
          rulesDAO.addRule.returns(Rx.Observable.throw(new Error()));
          let rule = {
            "enabled": false,
            "id": 1,
            "name": "testRule",
            "targets": [
            {
              "company": "testCompany",
              "member": "testMember",
              "name": "testName"
            }],
            "task":
            {
              "params":
              {
                "param": "testParam"
              },
              "task": "testTask"
            }
          };
          let ev = {body: JSON.stringfy(rule)};
          rules.addRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 500});
        });
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200.", function()
        {
          rulesDAO.addRule.returns(Rx.Observable.empty());
          let rule = {
            "enabled": false,
            "id": 1,
            "name": "testRule",
            "targets": [
            {
              "company": "testCompany",
              "member": "testMember",
              "name": "testName"
            }],
            "task":
            {
              "params":
              {
                "param": "testParam"
              },
              "task": "testTask"
            }
          };
          let ev = {body: JSON.stringfy(rule)};
          rules.addRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 200});
        });
        describe('deleteRule', function()
        {
          it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.", function()
          {
            rulesDAO.removeRule.returns(Rx.Observable.throw(new Error()));
            let ev = {pathParameters: ""};
            rules.deleteRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 400});
          });
          it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.", function()
          {
            rulesDAO.removeRule.returns(Rx.Observable.throw(new Error()));
            let ev = {pathParameters: 1};
            rules.deleteRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 500});
          });
          it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200.", function()
          {
            rulesDAO.removeRule.returns(Rx.Observable.empty());
            let ev = {pathParameters: 1};
            rules.deleteRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 200});
          });
          it("Nel caso in cui la \file{Rule} richiesta non sia disponibile, il campo \file{statusCode} della risposta deve essere impostato a 404.", function()
          {
            {
              rulesDAO.removeRule.returns(Rx.Observable.empty());
              let ev = {pathParameters: 1};
              rules.deleteRule(ev, context);
              let call = context.succeed.getCall(0);
              expect(context.succeed.calledOnce).to.be.true;
              expect(call.args[0]).not.to.be.null;
              expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 404});
            };
          });
        });
        describe('getRule', function()
        {
          it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200 e il campo \file{body} deve contenere la \file{Rule} cercata.", function()
          {
            let rule = {
              "enabled": false,
              "id": 1,
              "name": "testRule",
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }],
              "task":
              {
                "params":
                {
                  "param": "testParam"
                },
                "task": "testTask"
              }
            };
            rulesDAO.getRule.returns(Rx.Observable.of(rule));
            let ev = {pathParameters: 1};
            rules.getRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body: JSON.stringfy(rule),statusCode: 200});
          });
          it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.", function()
          {
            rulesDAO.getRule.returns(Rx.Observable.throw(new Error()));
            let ev = {
              pathParameters: ""
            }
            rules.getRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 400});
          });
          it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.", function()
          {
            rulesDAO.getRule.returns(Rx.Observable.throw(new Error()));
            let ev = {pathParameters: 1};
            rules.getRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 500});
          });
          it("Nel caso in cui la \file{Rule} richiesta non sia disponibile, il campo \file{statusCode} della risposta deve essere impostato a 404.", function()
          {
            let rule = {
              "enabled": false,
              "id": 1,
              "name": "testRule",
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }],
              "task":
              {
                "params":
                {
                  "param": "testParam"
                },
                "task": "testTask"
              }
            };
            rulesDAO.getRule.returns(Rx.Observable.of(rule));
            let ev = {pathParameters: 1};
            rules.getRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 404});

          });
        });
        describe('getRuleList', function()
        {
          it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200 e il campo \file{body} deve contenere la lista delle \file{Rule}.", function()
          {
            let rule = {
              "enabled": false,
              "id": 1,
              "name": "testRule",
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }],
              "task":
              {
                "params":
                {
                  "param": "testParam"
                },
                "task": "testTask"
              }
            };
            rulesDAO.getRulesList.returns(Rx.Observable.of(rule));
            let ev = {};
            rules.getRuleList(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body: JSON.stringfy(rule),statusCode: 200});

          });
          it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.", function()
          {
            rulesDAO.getRulesList.returns(Rx.Observable.throw(new Error()));
            let ev = {};
            rules.getRuleList(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 400});
          });
          it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.", function()
          {
            rulesDAO.getRulesList.returns(Rx.Observable.throw(new Error()));
            let ev = {};
            rules.getRuleList(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 500});
          });
        });
        describe('getTaskList', function()
        {
          it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.", function()
          {
            taskDAO.getTaskList.returns(Rx.Observable.throw(new Error()));
            let ev = {};
            rules.getTaskList(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 500});
          });
        });
        describe('queryRule', function()
        {
          it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200 e il campo \file{body} deve contenere la lista delle \file{Rule} da applicare ad un determinato caso.", function()
          {
            let targets = {
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }]
            };
            let rule = {
              "enabled": false,
              "id": 1,
              "name": "testRule",
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }],
              "task":
              {
                "params":
                {
                  "param": "testParam"
                },
                "task": "testTask"
              }
            };
            rulesDAO.query.returns(Rx.Observable.of(rule));
            let ev = {body: JSON.stringfy(targets)};
            rules.queryRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body: JSON.stringfy(rule),statusCode: 200});
          });
          it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.", function()
          {
            let targets = {
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }]
            };
            rulesDAO.query.returns(Rx.Observable.throw(new Error()));
            let ev = {body: JSON.stringfy(targets)};
            rules.queryRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 400});
          });
          it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.", function()
          {
            let targets = {
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }]
            };
            rulesDAO.query.returns(Rx.Observable.throw(new Error()));
            let ev = {body: JSON.stringfy(targets)};
            rules.queryRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 500});
          });
        });
        describe('updateRule', function()
        {
          it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo \file{statusCode} della risposta deve essere impostato a 200.", function()
          {
            rulesDAO.updateRule.returns(Rx.Observable.empty());
            let rule = {
              "enabled": false,
              "id": 1,
              "name": "testRule",
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }],
              "task":
              {
                "params":
                {
                  "param": "testParam"
                },
                "task": "testTask"
              }
            };
            let ev = {body: JSON.stringfy(rule)};
            rules.updateRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 200});
          });
          it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo \file{statusCode} della risposta deve essere impostato a 400.", function()
          {
            rulesDAO.updateRule.returns(Rx.Observable.throw(new Error));
            let rule = {
              "enabled": false,
              "id": 1,
              "name": "testRule",
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }],
              "task":
              {
                "params":
                {
                  "param": "testParam"
                },
                "task": "testTask"
              }
            };
            let ev = {body: JSON.stringfy(rule)};
            rules.updateRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 400});
          });
          it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo \file{statusCode} della risposta deve essere impostato a 500.", function()
          {
            rulesDAO.updateRule.returns(Rx.Observable.throw(new Error));
            let rule = {
              "enabled": false,
              "id": 1,
              "name": "testRule",
              "targets": [
              {
                "company": "testCompany",
                "member": "testMember",
                "name": "testName"
              }],
              "task":
              {
                "params":
                {
                  "param": "testParam"
                },
                "task": "testTask"
              }
            };
            let ev = {body: JSON.stringfy(rule)};
            rules.updateRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
            expect(call.args[0]).to.be.deep.equal({body:{},statusCode: 500});
          });
        });
      });
    });
  });
});
