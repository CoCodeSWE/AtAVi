export default function(blob)
{
  return new Promise(function(resolve, reject)
  {
    console.log('converting blob');
    let reader = new FileReader();
    reader.onerror = reject;  // in caso di errore respingiamo la promise
    reader.onabort = reject;  // stessa cosa in caso di abort
    reader.onload = () => resolve(reader.result.split(',').pop());  // in caso di successo risolvo la promessa
    // utilizzo split perchè il blob all'inizio ha un intestazione che indica il
    // tipo di file, che non fa parte dei dati binari che voglio trasmettere
    reader.readAsDataURL(blob);
  });
}
