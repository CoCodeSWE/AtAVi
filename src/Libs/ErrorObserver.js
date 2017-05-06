/**
* @desc Questa classe si occupa di riprodurre la risposta, fornita dal sistema, all'ospite.
* @author Mattia Bottaro
* @version 0.0.5
* @since 0.0.3-alpha
*/
const ObserverAdapter =  require('./ObserverAdapter');

class ErrorObserver extends ObserverAdapter
{
  next()
  {
    throw("Errore, l'observer non si aspetta la chiamata al metodo next.");
  }
}

module.exports = ErrorObserver;
