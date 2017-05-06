/**
* @desc Questa classe si occupa di gestire il cambio delle applicazioni nel client.
* @author Mauro Carlin
* @version 0.0.4
* @since 0.0.3-alpha
*/
class Dispatcher
{
  constructor() {
    this.subject = new Rx.Subject();
  }

  getObservable()
  {
    return this.subject.asObservable();
  }

  dispatch(cmd, params)
  {
    this.subject.next({ cmd: cmd, params: params });
  }
}
