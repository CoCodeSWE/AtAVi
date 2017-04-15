const VocalAPI = require('../Back-end/APIGateway/VocalAPI');
const chai = require('chai');

describe('Back-end', function()
{
	describe('APIGateway', function()
	{
		describe('VocalAPI', function() 
		{
			describe('addRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('addUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('addUserEnrollment', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('getRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('getRuleList', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allroa il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('getUser', function () 
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('getUserList', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('loginUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('queryLambda', function ()
			{
				it('Se la chiamata al servizio di STT non va a buon fine allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse avente statusCode pari a 500.');
				it('Se lo status della risposta ricevuta dall\'assistente virtuale è diverso da 200 allora il metodo deve chiamare il metodo succeed di context con un oggetto di tipo LambdaResponse come parametro avente il campo statusCode uguale a quello ricevuto e corpo del messaggio "Errore nel contattare l\'assistente virtuale".');
				it('Se l\'action del body della risposta è uguale a "rule.add" allora il metodo deve chiamare il metodo privato addRule.');
				it('Se l\'action del body della risposta è uguale a "user.add" allora il metodo deve chiamare il metodo privato addUser.');
				it('Se l\'action del body della risposta è uguale a "user.addEnrollment" allora il metodo deve chiamare il metodo privato addUserEnrollment.');
				it('Se l\'action del body della risposta è uguale a "rule.get" allora il metodo deve chiamare il metodo privato getRule.');
				it('Se l\'action del body della risposta è uguale a "rule.getList" allora il metodo deve chiamare il metodo privato getRuleList.');
				it('Se l\'action del body della risposta è uguale a "user.get" allora il metodo deve chiamare il metodo privato getUser.');
				it('Se l\'action del body della risposta è uguale a "user.getList" allora il metodo deve chiamare il metodo privato getUserList.');
				it('Se l\'action del body della risposta è uguale a "user.login" allora il metodo deve chiamare il metodo privato loginUser.');
				it('Se l\'action del body della risposta è uguale a "rule.remove" allora il metodo deve chiamare il metodo privato removeRule.');
				it('Se l\'action del body della risposta è uguale a "user.remove" allora il metodo deve chiamare il metodo privato removeUser.');
				it('Se l\'action del body della risposta è uguale a "user.resetEnrollment" allora il metodo deve chiamare il metodo privato resetUserEnrollment.');
				it('Se l\'action del body della risposta è uguale a "rule.update" allora il metodo deve chiamare il metodo privato updateRule.');
				it('Se l\'action del body della risposta è uguale a "user.update" allora il metodo deve chiamare il metodo privato updateUser.');
				it('Se durante la chiamata al metodo privato addRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato addUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato addUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato getRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato getRuleList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato getUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato getUserList si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato loginUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato removeRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato removeUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato resetUserEnrollment si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato updateRule si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se durante la chiamata al metodo privato updateUser si verifica un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se la chiamata al metodo sns.publish genera un errore allora il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse avente campo statusCode pari allo status dell\'errore.');
				it('Se lo status code della risposta di un microservizio è pari a 200 e l\'action contenuta nel suo body non corrisponde a nessuna action supportata dal back-end allora il metodo deve rielabolare la risposta e inoltrarla.');
			});
			
			describe('removeRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('removeUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('resetUserEnrollment', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('updateRule', function ()
			{
				it('Se la risposta ricevuta dal microservizio Rules ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
			
			describe('updateUser', function ()
			{
				it('Se la risposta ricevuta dal microservizio Users ha uno status code diverso da 200 allora il metodo deve sollevare un\'eccezione di tipo Exception con campo code pari allo status code della risposta.');
			});
		});
	});
});