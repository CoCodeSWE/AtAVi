/*
File temporaneo di esempio sull'utilizzo delle librerie di testing.
*/

const chai = require('chai');
const expect = chai.expect;
const VocalAPI = require('../Back-end/APIGateway/VocalAPI');
const sinon = require('sinon');

describe('VocalAPI', function()
{
    var api = new VocalAPI();
    describe('getInt()', function()
    {
        it('quando viene chiamato, deve restituire un numero', function()
        {
            expect(api.getInt()).to.be.a('number');
        });
    });
    describe('setInt()', function()
    {
       it('quando non viene chiamato con esattamente un parametro, solleva un\'eccezione', function()
       {
           expect(api.setInt.bind(api, 1)).to.not.throw();
           expect(api.setInt.bind(api)).to.throw();
           expect(api.setInt.bind(api, 1, 2, 3)).to.throw();
       });
       it('quando il parametro passato non è un numero, solleva un\'eccezione', function()
       {
           expect(api.setInt.bind(api, 1)).to.not.throw();
           expect(api.setInt.bind(api, 'mauro')).to.throw();
           expect(api.setInt.bind(api, {mauro: 'bocciofilo'})).to.throw();
       });
    });
});
