import {HttpPromise} from './HttpPromise';
import Rx from 'rxjs/Rx';

export default class Logic
{
  /**
  * Costruttore della parte logica del sistema che si occupa di comunicare con l'API Gateway.
  */
  constructor(url)
  {
    this.subject = new Rx.Subject();
    this.url = url;
  }

  /**
  * Metodo utilizzato per ottenere un Observable per l'arrivo dei dati dall'API Gateway.-
  */
  getObservable()
  {
    return this.subject.asObservable();
  }

  setUrl(url)
  {
    this.url = url;
  }

  /**
  * Metodo che permette di inviare l'audio all'API Gateway.
  * @param {Blob} audio - Parametro contenente l'audio da inviare all'APIGateway.
  */
  sendData(data)
  {
    HttpPromise('POST', this.url, {'content-type': 'application/json'}, JSON.stringify(data))  // faccio la richiesta http e configuro l'observer per notificare quando arrivano i dati o quando si verifica un errore
      .then((data) => this.subject.next(JSON.parse(data)))
      .catch((err) => this.subject.error(err));
  }
}
