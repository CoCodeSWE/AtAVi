const VocalAPI = require('../Back-end/APIGateway/VocalAPI');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const vocalLogin = require('./stubs/VocalLogin');
let promise = require('./stubs/RequestPromise');
const jwt = require('./stubs/jwt');
const stt = require('./stubs/STT');
const sns = require('./stubs/SNS');
const context = require('./stubs/LambdaContext');
const Rx = require('rxjs');

let next, error, complete, api;
beforeEach(function()
{
	next = sinon.stub();
	error = sinon.stub();
	complete = sinon.stub();
  promise = sinon.stub();
  api = new VocalAPI(vocalLogin, jwt, promise, stt, sns);
	context.succeed = sinon.stub();
});

describe('Back-end', function()
{
	describe('APIGateway', function()
	{
		describe('VocalAPI', function()
		{
			describe('_addRule', function ()
			{
				it("Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					api._getUser = sinon.stub();
					api._getUser.returns(Rx.Observable.empty());
					vocalLogin.addEnrollment.returns(Rx.Observable.throw(errore));
					api._addUserEnrollment(user).subscribe(
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
				it("Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora la Promise deve essere rigettata.", function(done)
				{
					api._getUser = sinon.stub();
					api._getUser.returns(Rx.Observable.empty());
					vocalLogin.doLogin.returns(Rx.Observable.throw(errore));
					api._loginUser(user).subscribe(
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

			describe('queryLambda', function ()
			{
				/*
				it("Se la chiamata al servizio di STT non va a buon fine allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse avente statusCode pari a 500.", function(done)
				{
					// Manca il catch
					stt.speechToText.returns(Promise.reject('Speech to Text Error'));
					context.succeed = function(response)
					{
						expect(response).have.property('statusCode', 500);
						done();
					};
				});
				*/

				/*
				it("Se lo status della risposta ricevuta dall\'assistente virtuale è diverso da 200 allora il metodo deve chiamare il metodo succeed di context con un oggetto di tipo LambdaResponse come parametro avente il campo statusCode uguale a quello ricevuto e corpo del messaggio 'Errore nel contattare l\'assistente virtuale'.", function(done)
				{
					// Manca il catch
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.reject(errore_VA));
					context.succeed = function(response)
					{
						ecpect(response).to.have.property('statusCode', errore_VA.statusCode);
						done();
					};
				});
				*/

				it("Se l\'action del body della risposta è uguale a 'rule.add' allora il metodo deve chiamare il metodo privato _addRule.", function(done)
				{
					api._addRule = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_addRule));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._addRule.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._addRule.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.add' allora il metodo deve chiamare il metodo privato _addUser.", function(done)
				{
					api._addUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_addUser));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._addUser.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._addUser.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.addEnrollment' allora il metodo deve chiamare il metodo privato _addUserEnrollment.", function(done)
				{
					api._addUserEnrollment = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_addUserEnrollment));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._addUserEnrollment.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._addUserEnrollment.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'rule.get' allora il metodo deve chiamare il metodo privato _getRule.", function(done)
				{
					api._getRule = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_getRule));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._getRule.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getRule.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'rule.getList' allora il metodo deve chiamare il metodo privato _getRuleList.", function(done)
				{
					api._getRuleList = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_getRuleList));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._getRuleList.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getRuleList.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.get' allora il metodo deve chiamare il metodo privato _getUser.", function(done)
				{
					api._getUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_getUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._getUser.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getUser.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.getList' allora il metodo deve chiamare il metodo privato _getUserList.", function(done)
				{
					api._getUserList = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_getUserList));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._getUserList.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getUserList.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.login' allora il metodo deve chiamare il metodo privato _loginUser.", function(done)
				{
					api._loginUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_loginUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._loginUser.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._loginUser.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'rule.remove' allora il metodo deve chiamare il metodo privato _removeRule.", function(done)
				{
					api._removeRule = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_removeRule));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._removeRule.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._removeRule.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.remove' allora il metodo deve chiamare il metodo privato _removeUser.", function(done)
				{
					api._removeUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_removeUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._removeUser.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._removeUser.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.resetEnrollment' allora il metodo deve chiamare il metodo privato _resetUserEnrollment.", function(done)
				{
					api._resetUserEnrollment = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_userResetEnrollment));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._resetUserEnrollment.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._resetUserEnrollment.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'rule.update' allora il metodo deve chiamare il metodo privato _updateRule.", function(done)
				{
					api._updateRule = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_updateRule));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._updateRule.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._updateRule.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se l\'action del body della risposta è uguale a 'user.update' allora il metodo deve chiamare il metodo privato _updateUser.", function(done)
				{
					api._updateUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_updateUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._updateUser.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._updateUser.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _addRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Rules.", function(done)
				{
					api._addRule = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_addRule));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._addRule.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
						expect(api._addRule.callCount).to.equal(1);
            done();
          };
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _addUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._addUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_addUser));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._addUser.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._addUser.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _addUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._addUserEnrollment = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_addUserEnrollment));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._addUserEnrollment.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._addUserEnrollment.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _getRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Rules.", function(done)
				{
					api._getRule = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
          promise.onCall(0).returns(Promise.resolve(va_response_getRule));
          promise.onCall(1).returns(Promise.resolve(empty_action_response));
          api._getRule.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getRule.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _getRuleList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Rules.", function(done)
				{
					api._getRuleList = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_getRuleList));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._getRuleList.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getRuleList.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _getUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._getUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_getUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._getUser.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getUser.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _getUserList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._getRuleList = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_getRuleList));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._getRuleList.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._getRuleList.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});
				
				/*
				it("Se durante la chiamata al metodo privato _loginUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._loginUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_loginUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._loginUser.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
						expect(api._loginUser.callCount).to.equal(1);
            done();
          }
          api.queryLambda(event, context);
				});
				*/
				
				it("Se durante la chiamata al metodo privato _removeRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Rules.", function(done)
				{
					api._removeRule = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_removeRule));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._removeRule.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._removeRule.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _removeUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._removeUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_removeUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._removeUser.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._removeUser.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _resetUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._resetUserEnrollment = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_userResetEnrollment));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._resetUserEnrollment.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._resetUserEnrollment.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _updateRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Rules.", function(done)
				{
					api._updateUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_updateUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._updateUser.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._updateUser.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});

				it("Se durante la chiamata al metodo privato _updateUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato ad un valore uguale a quello restituito dal microservizio Users.", function(done)
				{
					api._updateUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_updateUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._updateUser.returns(Rx.Observable.throw(errore_microservizio));
					context.succeed = function(response)
          {
            //controllo che i campi non siano nulli, quindi chiamo done
						expect(api._updateUser.callCount).to.equal(1);
						expect(response).to.have.property('statusCode', errore_microservizio.code);
						expect(response).to.have.property('body', JSON.stringify({ message: errore_microservizio.msg }));
            done();
          }
          api.queryLambda(event, context);
				});
				
				/*
				it("Se la chiamata al metodo sns.publish genera un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse avente campo statusCode pari allo status dell\'errore.", function(done)
				{
					
				});
				*/
				
				it("Se lo status code della risposta di un microservizio è pari a 200 e l\'action contenuta nel suo body non corrisponde a nessuna action supportata dal back-end allora il metodo deve rielabolare la risposta e inoltrarla.", function(done)
				{
					api._updateUser = sinon.stub();
					stt.speechToText.returns(Promise.resolve('Test'));
					promise.onCall(0).returns(Promise.resolve(va_response_updateUser));
					promise.onCall(1).returns(Promise.resolve(empty_action_response));
					api._updateUser.returns(Rx.Observable.empty());
					context.succeed = function(response)
          {
						expect(response).have.property('statusCode', 200);
						done();
					};
					api.queryLambda(event, context);
				});
			});

			describe('_removeRule', function ()
			{
				it("Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
					api._removeRule(rule).subscribe(
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					api._getUser = sinon.stub();
					api._getUser.returns(Rx.Observable.empty());
					vocalLogin.resetEnrollments.returns(Rx.Observable.throw(errore));
					api._resetUserEnrollment(user).subscribe(
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
				it("Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
				it("Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora l\'Observable ritornato deve chiamare il metodo error dell\'Observer iscritto passandogli come parametro un oggetto di tipo Exception con campo code pari allo status code della risposta.", function(done)
				{
					promise.returns(Promise.reject(errore));
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
	statusCode: 404,
	message: 'Bad Request'
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

let body_va =
{
	'app': 'conversation',
	'query':
	{
		'session_id': 1,
		'text': 'Hi'
	}
}

let body_query_lambda =
{
	'app': 'conversation',
	'audio': 'csacascsayucs',
	'data':
	{

	},
	'session_id': '1'
};

let event =
{
	body: JSON.stringify(body_query_lambda)
};

let va_response_addRule =
{
	'action': 'rule.add',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_addUser =
{
	'action': 'user.add',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_addUserEnrollment =
{
	'action': 'user.addEnrollment',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_getRule =
{
	'action': 'rule.get',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_getRuleList =
{
	'action': 'rule.getList',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_getUser =
{
	'action': 'user.get',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_getUserList =
{
	'action': 'user.getList',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_loginUser =
{
	'action': 'user.login',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_removeRule =
{
	'action': 'rule.remove',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_removeUser =
{
	'action': 'user.remove',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_userResetEnrollment =
{
	'action': 'user.resetEnrollment',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_updateRule =
{
	'action': 'rule.update',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let va_response_updateUser =
{
	'action': 'user.update',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let empty_action_response =
{
	'action': '',
	'res':
	{
		text_request: 'Hi',
		text_response: 'Hi'
	},
	'session_id': '1'
};

let errore_microservizio =
{
	code: 500,
	msg: 'Errore'
}
