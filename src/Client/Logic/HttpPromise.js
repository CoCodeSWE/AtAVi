/**
* Constructor, si occupa di creare la promessa relativa ad una richiesta HTTP fatta con metodo, headers e URL specificati.
* @param method {String} - Metodo della richiesta HTTP.
* @param url {String} - URL a cui fare la richiesta.
* @param headers {StringAssocArray} - Array associativo contenente gli headers. La chiave rappresenta il nome dell'header.
* @param data {Object} - Dati da mandare con la richiesta.
*/

var HttpPromise = function(method, url, headers, data)
{
  return new Promise(function(resolve, reject)
  {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() //funzione eventhandler invocata ogni volta  che l'attributo readyState cambia
    {
      if (xhr.readyState === 4) //se l'attributo readyState = 4 l'operazione è completata (complete).
      {
        if (xhr.status === 200) //se l'attributo status = 200 la richiesta è avvenuta con successo(complete).
          resolve(xhr.responseText);
        else
          reject(
          {
            status: xhr.status,
            status_text: xhr.statusText
          });
      }
    }
    xhr.open(method, url, true); // inizializzazione della richiesta, true equivale a richiesta asincrona
    xhr.send(data); //invio della richiesta
  });
}
