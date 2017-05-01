const expect = chai.expect;

let httppromise;
let xhr;

beforeEach(function()
{
  var requests = [];
  httppromise = new HttpPromise('method','url',{},{});
});

before(function()
{
    xhr = sinon.useFakeXMLHttpRequest();
    this.xhr.onCreate = function (xhr)
    {
      requests.push(xhr);
    };
});

after(function()
{
    xhr.restore();
});

describe('Client', function()
{
  describe('Logic', function()
  {
    describe('HttpPromise', function()
    {
      describe('then', function()
      {
        it('Se la richiesta va a buon fine, viene chiamato il metodo then', function(done)
        {
          httppromise.then(function(data)
          {
            done();
          }).catch(done);

          expect(requests.length).to.equal(1);
          requests[0].respond(200,'funziona','prova');
        });

        it('Se la richiesta fallisce, viene chiamato il metodo catch.', function(done)
        {

          httppromise.then(done)
          .catch(function(err)
          {
            done();
          });
          expect(request.length).to.equal(1);
          request[0].error();
        });
      });
    });
  });
});
