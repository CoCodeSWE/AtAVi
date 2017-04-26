var HttpPromise = function(method, url, headers, data)
{
  return new Promise(function(resolve, reject)
  {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
      console.log(xhr);
      if (xhr.readyState === 4)
      {
        if (xhr.status === 200)
          resolve(xhr.responseText);
        else
          reject(
          {
            status: xhr.status,
            status_text: xhr.statusText
          });
      }
    }
    xhr.open(method, url, true);
    xhr.send(data);
  });
}
