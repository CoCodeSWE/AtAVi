import Rx from "rxjs/Rx";

export default class EventObservable extends Rx.Observable
{
  constructor(ev, id)
  {
    super(function(observer)
    {
      let element = document.getElementById(id);
      if(element === null)
        observer.error(new Error('no element with id ' + id + ' found.'));
      else
      {
        element.addEventListener(ev, (event) => {observer.next(event); return false;});
      }
    });
  }
}
