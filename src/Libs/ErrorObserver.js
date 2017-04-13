const ObserverAdapter =  require('./ObserverAdapter');

class ErrorObserver extends ObserverAdapter
{
  next()
  {
    throw("Errore, l'observer non si aspetta la chiamata al metodo next.");
  }
}

module.exports = ErrorObserver;
