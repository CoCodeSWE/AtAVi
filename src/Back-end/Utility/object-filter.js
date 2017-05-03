/**
  * Funzione che filtra le proprietà di un oggetto rimuovendo quelle superflue.
  * @param {Object} obj - oggetto che verrà filtrato
	* @param {Array} keys - array contenente le chiavi da salvare
  */

function objectFilter(obj, keys)
{
	return Object.keys(obj).reduce(function(filtered, key)
	{
		if(keys.includes(key))
			filtered[key] = obj[key];
		return filtered;
	}, {});
};

module.exports = objectFilter;
