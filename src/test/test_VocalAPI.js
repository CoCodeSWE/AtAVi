const VocalAPI = require('../Back-end/APIGateway/VocalAPI');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const vocalLogin = require('./stubs/VocalLogin');
const promise = require('./stubs/RequestPromise');
const jwt = require('./stubs/jwt');
const stt = require('./stubs/STT');
const sns = require('./stubs/SNS');
const context = require('./stubs/LambdaContext');

let next, error, complete;
beforeEach(function()
{
	next = sinon.stub();
	error = sinon.stub();
	complete = sinon.stub();
});

describe('Back-end', function()
{
	describe('APIGateway', function()
	{
		describe('VocalAPI', function() 
		{
			let api = new VocalAPI(vocalLogin, jwt, promise, stt, sns);
			describe('addRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.getRule(rule).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('addUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.addUser(user).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('addUserEnrollment', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.addUserEnrollment(enrollment).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('getRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.getRule(5).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('getRuleList', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.getRuleList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('getUser', function () 
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.getUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('getUserList', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.getUserList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('loginUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora la Promise deve essere rigettata.', function(done)
				{
					let promise = api.loginUser(enrollment);
					promise.then(function()
					{
						done(errore);
					})
					.catch(function()
					{
						done();
					});
				});
			});
			
			describe('queryLambda', function ()
			{
				it('Se la chiamata al servizio di STT non va a buon fine allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse avente statusCode pari a 500.', function()
				{
					promise.onCall(0).returns(Promise.reject(JSON.stringify(errore)));
					promise.onCall(1).returns(Promise.reject(JSON.stringify(errore_VA)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se lo status della risposta ricevuta dall\'assistente virtuale è diverso da 200 allora il metodo deve chiamare il metodo succeed di context con un oggetto di tipo LambdaResponse come parametro avente il campo statusCode uguale a quello ricevuto e corpo del messaggio "Errore nel contattare l\'assistente virtuale".', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.reject(JSON.stringify(errore_VA)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
					expect(context.succeed.getCall(0).args[0]).to.have.property('message', 'Errore nel contattare l\'assistente virtuale');
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.add" allora il metodo deve chiamare il metodo privato addRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.add' })));
					api.queryLambda(event, context);
					expect(api.addRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.add" allora il metodo deve chiamare il metodo privato addUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.add' })));
					api.queryLambda(event, context);
					expect(api.addUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.addEnrollment" allora il metodo deve chiamare il metodo privato addUserEnrollment.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.addEnrollment' })));
					api.queryLambda(event, context);
					expect(api.addUserEnrollment.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.get" allora il metodo deve chiamare il metodo privato getRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.get' })));
					api.queryLambda(event, context);
					expect(api.getRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.getList" allora il metodo deve chiamare il metodo privato getRuleList.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.getList' })));
					api.queryLambda(event, context);
					expect(api.getRuleList.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.get" allora il metodo deve chiamare il metodo privato getUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.get' })));
					api.queryLambda(event, context);
					expect(api.getUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.getList" allora il metodo deve chiamare il metodo privato getUserList.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.getList' })));
					api.queryLambda(event, context);
					expect(api.getUserList.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.login" allora il metodo deve chiamare il metodo privato loginUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.login' })));
					api.queryLambda(event, context);
					expect(api.loginUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.remove" allora il metodo deve chiamare il metodo privato removeRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.remove' })));
					api.queryLambda(event, context);
					expect(api.removeRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.remove" allora il metodo deve chiamare il metodo privato removeUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.remove' })));
					api.queryLambda(event, context);
					expect(api.removeUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.resetEnrollment" allora il metodo deve chiamare il metodo privato resetUserEnrollment.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.resetEnrollment' })));
					api.queryLambda(event, context);
					expect(api.resetUserEnrollment.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.update" allora il metodo deve chiamare il metodo privato updateRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.update' })));
					api.queryLambda(event, context);
					expect(api.updateRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.update" allora il metodo deve chiamare il metodo privato updateUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.update' })));
					api.queryLambda(event, context);
					expect(api.updateUser.callCount).to.equal(1);
				});
				
				it('Se durante la chiamata al metodo privato addRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.add' })));
					api.addRule = sinon.stub();
					api.addRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato addUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.add' })));
					api.addUser = sinon.stub();
					api.addUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato addUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.addEnrollment' })));
					api.addUserEnrollment = sinon.stub();
					api.addUserEnrollment.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato getRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.get' })));
					api.getRule = sinon.stub();
					api.getRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato getRuleList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.getList' })));
					api.getRuleList = sinon.stub();
					api.addRuleList.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato getUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.get' })));
					api.getUser = sinon.stub();
					api.getUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato getUserList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.getList' })));
					api.getUserList = sinon.stub();
					api.getUserList.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato loginUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.login' })));
					api.loginUser = sinon.stub();
					api.loginUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato removeRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.remove' })));
					api.removeRule = sinon.stub();
					api.removeRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato removeUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.remove' })));
					api.removeUser = sinon.stub();
					api.removeUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato resetUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.resetEnrollment' })));
					api.resetUserEnrollment = sinon.stub();
					api.resetUserEnrollment.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato updateRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.update' })));
					api.updateRule = sinon.stub();
					api.updateRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato updateUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.update' })));
					api.updateUser = sinon.stub();
					api.updateUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se la chiamata al metodo sns.publish genera un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse avente campo statusCode pari allo status dell\'errore.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'mou' })));
					api.queryLambda(event, context);
					sns.publish.yield(errore);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se lo status code della risposta di un microservizio è pari a 200 e l\'action contenuta nel suo body non corrisponde a nessuna action supportata dal back-end allora il metodo deve rielabolare la risposta e inoltrarla.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'mou', response: 'risposta' })));
					api.queryLambda(event, context);
					sns.publish.yield(null, { statusCode: 200 });
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property(response, 'riposta');
				});
			});
			
			describe('removeRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.removeRule(5).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('removeUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.addUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('resetUserEnrollment', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.resetUserEnrollment('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('updateRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.updateRule(rule).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
			
			describe('updateUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function()
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api.updateUser(user).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0]).to.have.property('code', 500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
		});
	});
});

let errore =
{ 
	statusCode: 500,
	message: 'Errore' 
}

let errore_VA =
{
	statusCode: 500,
	message: 'Errore nel contattare l\'assistente virtuale'
}

let rule =
{
	enabled: true,
	id: 5,
	name: 'caffe'
}

let user = 
{
	name: 'mauro',
	username: 'mou'
}

let enrollment =
{
	audio: 'audio',
	username: 'mou'
}

let event =
{
	body: ''
}

let stt_ok =
{
	text: 'text ok'
}