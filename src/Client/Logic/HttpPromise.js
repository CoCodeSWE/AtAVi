var HttpPromise = function(method, url, headers, data)
{
  return new Promise(function(resolve, reject)
  {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    { alert("ciao");
      if (xhr.readyState === 4)
      {
        if (xhr.readyState == XMLHttpRequest.DONE)
        { resolve();}
        else
        { rej(); }
      }
    xhr.open(method, url, true);
    xhr.send(data);
    }
  });
}
