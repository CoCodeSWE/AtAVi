let promise = Promise.reject('Error');
promise
  .catch((err) => {console.log(1)})
  .then((data) => {console.log(2)})
    .catch((err) => {console.log(2)})
    .then((data) => {console.log(2)})
      .catch((err) => {console.log(3)})
      .then((data) => {console.log(2)})
        .catch((err) => {console.log(4)})
        .then((data) => {console.log(2)})
