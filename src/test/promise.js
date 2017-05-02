Promise.resolve(1)
  .then(increment)
    .then(increment)
      .then(increment)
        .then(increment)
          .then(increment)
            .then(increment);

function increment(data)
{
  console.log(data);
  return data + 1;
}
