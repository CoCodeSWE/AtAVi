const RulesService = require('../Back-end/Rules/RulesService');
const chai = require('chai');
const expect = chai.expect;
const Rx = require('rxjs');
const sinon = require('sinon');
const taskDAO = require('./stubs/TasksDAO');
const rulesDAO = require('./stubs/RulesDAO');
const context = require('./stubs/LambdaContext');

describe('Back-end', function()
{
  describe('Rules', function()
  {
    describe('RulesService', function()
    {
      beforeEach(function()
      {
        rules = new RulesService(rulesDAO,taskDAO);
        context.succeed = sinon.stub();
      });
			
      describe('addRule', function()
      {
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo statusCode della risposta deve essere impostato a 400.", function()
        {
          rulesDAO.addRule.returns(Rx.Observable.throw(new Error()));
          let ev = {body: ""};
          rules.addRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Bad Request' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 400);
        });
				
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
          rulesDAO.addRule.returns(Rx.Observable.throw(new Error()));
          let ev = {body: JSON.stringify(rule)};
          rules.addRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });
				
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo statusCode della risposta deve essere impostato a 200.", function()
        {
          rulesDAO.addRule.returns(Rx.Observable.empty());
          let ev = {body: JSON.stringify(rule)};
          rules.addRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'success' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });
				
				it("Nel caso in cui sia passato un oggetto la cui chiave primaria è uguale a quella di un oggetto già esistente, il campo statusCode della risposta deve essere impostato a 409", function()
        {
          rulesDAO.addRule.returns(Rx.Observable.throw({ code: 'ConditionalCheckFailedException' }));
          let ev = { body: JSON.stringify(rule) };
          rules.addRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Conflict' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 409);
				});
      });
			
      describe('deleteRule', function()
      {
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
          rulesDAO.removeRule.returns(Rx.Observable.throw(new Error()));
          let ev = {pathParameters: { id: 1 }};
          rules.deleteRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });
				
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo statusCode della risposta deve essere impostato a 200.", function()
        {
          rulesDAO.removeRule.returns(Rx.Observable.empty());
          let ev = {pathParameters: { id: 1 }};
          rules.deleteRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'success' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });
				
        it("Nel caso in cui la Rule richiesta non sia disponibile, il campo statusCode della risposta deve essere impostato a 404.", function()
        {
          {
            rulesDAO.removeRule.returns(Rx.Observable.throw({ code: 'ConditionalCheckFailedException' }));
            let ev = {pathParameters: { id: 1 }};
            rules.deleteRule(ev, context);
            let call = context.succeed.getCall(0);
            expect(context.succeed.calledOnce).to.be.true;
            expect(call.args[0]).not.to.be.null;
  					expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Not found' }));
  					expect(call.args[0]).to.have.deep.property('statusCode', 404);
          };
        });
      });
			
      describe('getRule', function()
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo statusCode della risposta deve essere impostato a 200 e il campo body deve contenere la Rule cercata.", function()
        {
          rulesDAO.getRule.returns(Rx.Observable.of(rule));
          let ev = {pathParameters: { id: 1 }};
          rules.getRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify(rule));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });
				
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
          rulesDAO.getRule.returns(Rx.Observable.throw(new Error()));
          let ev = {pathParameters: { id: 1 }};
          rules.getRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });
				
        it("Nel caso in cui la Rule richiesta non sia disponibile, il campo statusCode della risposta deve essere impostato a 404.", function()
        {
          rulesDAO.getRule.returns(Rx.Observable.throw({ code: 'Not found' }));
          let ev = {pathParameters: { id: 1 }};
          rules.getRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Not found' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 404);

        });
      });
			
      describe('getRuleList', function()
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo statusCode della risposta deve essere impostato a 200 e il campo body deve contenere la lista delle Rule.", function()
        {
          rulesDAO.getRuleList.returns(Rx.Observable.of(rule_1, rule_2));
          let ev = {};
          rules.getRuleList(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ rules: [rule_1, rule_2] }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });
				
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
          rulesDAO.getRuleList.returns(Rx.Observable.throw(new Error()));
          let ev = {};
          rules.getRuleList(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });
      });
			
      describe('getTaskList', function()
      {
				it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo statusCode della risposta deve essere impostato a 200 e il campo body deve contenere la lista dei Task.", function()
        {
          taskDAO.getTaskList.returns(Rx.Observable.of(task_1));
          let ev = {};
          rules.getTaskList(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ tasks: [task_1] }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });
				
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
          taskDAO.getTaskList.returns(Rx.Observable.throw(new Error()));
          let ev = {};
          rules.getTaskList(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });
      });
			
      describe('updateRule', function()
      {
        it("Nel caso in cui la chiamata al metodo vada a buon fine, il campo statusCode della risposta deve essere impostato a 200.", function()
        {
          rulesDAO.updateRule.returns(Rx.Observable.empty());
          let ev = {pathParameters: { id: 1 }, body: JSON.stringify(rule)};
          rules.updateRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'success' }));
					expect(call.args[0]).to.have.deep.property('statusCode', 200);
        });
				
        it("Nel caso in cui la chiamata al metodo venga fatta con un parametro non atteso, il campo statusCode della risposta deve essere impostato a 400.", function()
        {
          rulesDAO.updateRule.returns(Rx.Observable.throw(new Error));
          let ev = {pathParameters: "" , body: ""};
          rules.updateRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Bad Request' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 400);
        });
				
        it("Nel caso in cui la chiamata al metodo generi un errore del microservizio, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
          rulesDAO.updateRule.returns(Rx.Observable.throw(new Error));
          let ev = {pathParameters: { id: 1 }, body: JSON.stringify(rule)};
          rules.updateRule(ev, context);
          let call = context.succeed.getCall(0);
          expect(context.succeed.calledOnce).to.be.true;
          expect(call.args[0]).not.to.be.null;
          expect(call.args[0]).to.have.deep.property('body', JSON.stringify({ message: 'Internal server error' }));
          expect(call.args[0]).to.have.deep.property('statusCode', 500);
        });
      });
    });
  });
});

let rule = 
{
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

let rule_1 =
{
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

let rule_2 =
{
	"enabled": false,
	"id": 2,
	"name": "testRule2",
	"targets": [
	{
		"company": "testCompany2",
		"member": "testMember2",
		"name": "testName2"
	}],
	"task":
	{
		"params":
		{
			"param": "testParam2"
		},
		"task": "testTask2"
	}
};

let task_1 =
{
	type: 'send_to_slack'
};