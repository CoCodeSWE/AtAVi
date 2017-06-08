/**
* @desc 	Promise relativa ad una richiesta HTTP.
* @author Pier Paolo Tricomi
* @version 0.0.5
* @since 0.0.3-alpha
*/

/**
* Constructor, si occupa di creare la promessa relativa ad una richiesta HTTP fatta con metodo, headers e URL specificati.
* @param {String} method - Metodo della richiesta HTTP.
* @param {String} url - URL a cui fare la richiesta.
* @param {StringAssocArray} headers - Array associativo contenente gli headers. La chiave rappresenta il nome dell'header.
* @param {Object} data - Dati da mandare con la richiesta.
*/
export var HttpPromise = function(method, url, headers, data)
{
  return new Promise(function(resolve, reject)
  {
    var xhr = new XMLHttpRequest();
    console.log('new request');
    xhr.onreadystatechange = function() //funzione eventhandler invocata ogni volta  che l'attributo readyState cambia
    {
      if (xhr.readyState === XMLHttpRequest.DONE) //se l'attributo readyState = 4 l'operazione è completata (complete).
      {
        console.log(xhr);
        if (xhr.status === 200) //se l'attributo status = 200 la richiesta è avvenuta con successo(complete).
          resolve(xhr.responseText);
        else
          reject(
          {
            status: xhr.status,
            status_text: xhr.responseText
          });
      }
    }
    xhr.open(method, url, true); // inizializzazione della richiesta, true equivale a richiesta asincrona
    for(let name in headers)
      xhr.setRequestHeader(name, headers[name]);
    xhr.send(data); //invio della richiesta
    console.log(xhr);
  });
}
