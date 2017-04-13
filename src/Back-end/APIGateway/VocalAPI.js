class VocalAPI
{
    constructor()
    {
        this.number = 1;
    }

    getInt()
    {
        return this.number;
    }

    setInt(...number)
    {
        if(number.length !== 1)
            throw new Error();
        if(typeof number[0] !== 'number')
            throw new Error();
        this.number = number[0];
    }
}

module.exports = VocalAPI
