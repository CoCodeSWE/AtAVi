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
			describe('_addRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._addRule(rule).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});	
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_addUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._addUser(user).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_addUserEnrollment', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._addUserEnrollment(enrollment).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_getRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._getRule(5).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_getRuleList', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._getRuleList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_getUser', function () 
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._getUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_getUserList', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._getUserList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_loginUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora la Promise deve essere rigettata.', function(done)
				{
					let promise = api._loginUser(enrollment);
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
				
				it('Se l\'action del body della risposta è uguale a "rule.add" allora il metodo deve chiamare il metodo privato _addRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.add' })));
					api.queryLambda(event, context);
					expect(api._addRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.add" allora il metodo deve chiamare il metodo privato _addUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.add' })));
					api.queryLambda(event, context);
					expect(api._addUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.addEnrollment" allora il metodo deve chiamare il metodo privato _addUserEnrollment.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.addEnrollment' })));
					api.queryLambda(event, context);
					expect(api._addUserEnrollment.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.get" allora il metodo deve chiamare il metodo privato _getRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.get' })));
					api.queryLambda(event, context);
					expect(api._getRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.getList" allora il metodo deve chiamare il metodo privato _getRuleList.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.getList' })));
					api.queryLambda(event, context);
					expect(api._getRuleList.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.get" allora il metodo deve chiamare il metodo privato _getUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.get' })));
					api.queryLambda(event, context);
					expect(api._getUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.getList" allora il metodo deve chiamare il metodo privato _getUserList.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.getList' })));
					api.queryLambda(event, context);
					expect(api._getUserList.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.login" allora il metodo deve chiamare il metodo privato _loginUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.login' })));
					api.queryLambda(event, context);
					expect(api._loginUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.remove" allora il metodo deve chiamare il metodo privato _removeRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.remove' })));
					api.queryLambda(event, context);
					expect(api._removeRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.remove" allora il metodo deve chiamare il metodo privato _removeUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.remove' })));
					api.queryLambda(event, context);
					expect(api._removeUser.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.resetEnrollment" allora il metodo deve chiamare il metodo privato _resetUserEnrollment.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.resetEnrollment' })));
					api.queryLambda(event, context);
					expect(api._resetUserEnrollment.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "rule.update" allora il metodo deve chiamare il metodo privato _updateRule.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.update' })));
					api.queryLambda(event, context);
					expect(api._updateRule.callCount).to.equal(1);
				});
				
				it('Se l\'action del body della risposta è uguale a "user.update" allora il metodo deve chiamare il metodo privato _updateUser.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.update' })));
					api.queryLambda(event, context);
					expect(api._updateUser.callCount).to.equal(1);
				});
				
				it('Se durante la chiamata al metodo privato _addRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.add' })));
					api._addRule = sinon.stub();
					api._addRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _addUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.add' })));
					api._addUser = sinon.stub();
					api._addUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _addUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.addEnrollment' })));
					api._addUserEnrollment = sinon.stub();
					api._addUserEnrollment.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _getRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.get' })));
					api._getRule = sinon.stub();
					api._getRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _getRuleList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.getList' })));
					api._getRuleList = sinon.stub();
					api._getRuleList.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _getUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.get' })));
					api._getUser = sinon.stub();
					api._getUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _getUserList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.getList' })));
					api._getUserList = sinon.stub();
					api._getUserList.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _loginUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.login' })));
					api._loginUser = sinon.stub();
					api._loginUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _removeRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.remove' })));
					api._removeRule = sinon.stub();
					api._removeRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _removeUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.remove' })));
					api._removeUser = sinon.stub();
					api._removeUser.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _resetUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.resetEnrollment' })));
					api._resetUserEnrollment = sinon.stub();
					api._resetUserEnrollment.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _updateRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'rule.update' })));
					api._updateRule = sinon.stub();
					api._updateRule.returns(Promise.reject(JSON.stringify(errore)));
					api.queryLambda(event, context);
					expect(context.succeed.callCount).to.equal(1);
					expect(context.succeed.getCall(0).args[0]).to.have.property('statusCode', 500);
				});
				
				it('Se durante la chiamata al metodo privato _updateUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(stt_ok)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify({ action: 'user.update' })));
					api._updateUser = sinon.stub();
					api._updateUser.returns(Promise.reject(JSON.stringify(errore)));
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
			
			describe('_removeRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._removeRule(5).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_removeUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._removeUser('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_resetUserEnrollment', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._resetUserEnrollment('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_updateRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._updateRule(rule).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
				});
			});
			
			describe('_updateUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.', function(done)
				{
					promise.returns(Promise.reject(JSON.stringify(errore)));
					api._updateUser(user).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					setTimeout(function()
					{
						expect(error.callCount).to.equal(1);
						expect(error.getCall(0).args[0]).to.have.property('code', 500);
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						done();
					});
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