class HttpPromise
{
  constructor(method, url, headers, data)
  {
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.data = data;
  }

  then(fulfill,reject)
  {
    var xhr = new XMLHttpRequest();
    return new Promise(function(resolve, rej)
    {
      xhr.onreadystatechange = function()
      {
        if (xhr.readyState == XMLHttpRequest.DONE)
        { resolve(); }
        else
        { rej(); }
      }
      xhr.open(this.method, this.url, true);
      xhr.send(this.data);

    });
  }
}
