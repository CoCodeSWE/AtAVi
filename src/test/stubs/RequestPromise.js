module.exports = function()
{
  this.then = sinon.stub();
  this.catch = sinon.stub();
  this.finally = sinon.stub();
  this.cancel = sinon.stub();
  this.promise = sinon.stub();
}
