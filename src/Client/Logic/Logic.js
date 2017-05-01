const URL = 'www.google.it'

class Logic
{
  /**
  * Costruttore della parte logica del sistema che si occupa di comunicare con l'API Gateway.
  */
  constructor()
  {
    this.subject = new Rx.Subject();
  }

  /**
  * Metodo utilizzato per ottenere un Observable per l'arrivo dei dati dall'API Gateway.-
  */
  getObservable()
  {
    return this.subject.asObservable();
  }

  /**
  * Metodo che permette di inviare l'audio all'API Gateway.
  * @param audio {Blob} - Parametro contenente l'audio da inviare all'APIGateway.
  */
  sendData(audio)
  {
    return new HttpPromise('POST', URL, 'test', audio);
  }
}
