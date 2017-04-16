class ObserverAdapter
{
  constructor()
  {
    this.next_cb = null;
    this.error_cb = null;
    this.complete_cb = null;
    this.paused = false;
    this.err = null;
    this.completed = false;
  }

  next(data)
  {
    if(!this.paused && this.next_cb)
      this.next_cb(data);
  }

  error(err)
  {
    if(this.paused)
      this.err = err;
    else if(this.error_cb)
      this.error_cb(err);
  }

  complete()
  {
    if(this.paused)
      this.completed = true;
    else if(this.complete_cb)
      this.complete_cb();
  }

  pause()
  {
    this.paused = true;
  }

  resume()
  {
    this.paused = false;
    if(this.completed)
      this.complete_cb();
    if(this.err)
      this.error_cb(this.err);
  }

  onNext(cb)
  {
    this.next_cb = cb;
  }

  onError(cb)
  {
    this.error_cb = cb;
  }

  onComplete(cb)
  {
    this.complete_cb = cb;
  }
}

module.exports = ObserverAdapter;
