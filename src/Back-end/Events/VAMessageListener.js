class VAMessageListener
{
	constructor(conversations, guests, rp)
	{
		this.conversations = conversations;
		this.guests = guests;
		this.request_promise = rp;
	}
}

module.exports = VAMessageListener;
