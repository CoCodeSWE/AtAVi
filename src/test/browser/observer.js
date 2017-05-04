export default class Observer
{
  constructor()
  {
    this.next = sinon.stub();
    this.error = sinon.stub();
    this.complete = sinon.stub();
  }
}
