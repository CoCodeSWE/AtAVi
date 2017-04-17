const sinon = require('sinon');

class ObserverStub
{
  constructor()
  {
    this.next = sinon.stub();
    this.error = sinon.stub();
    this.complete = sinon.stub();
  }
}

module.exports = ObserverStub
