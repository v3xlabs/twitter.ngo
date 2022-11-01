# *.twitter.ngo

This code resolves `*.twitter.ngo` subdomains to make twitter names into valid ENS names and more.

## How does name resolution work?

So here is how I propose this code resolves names (that doesn't mean i've successfully built it, this is just the idea for the strategy).

- Get the twitter profile and check if the user accepts donations through ETH. If so, grab their ETH Address and return this.
- Get their twitter name and see if it includes an ENS name. If so, resolve the address and return it.

The above should make twitter.ngo subdomains available for anyone that is on the [ETHLeaderboard](https://ethleaderboard.xyz/) site, aswell as all users who have Ethereum donations setup.

## So why not twitter.eth or twitter.com?

Yes, yes, its not `twitter.eth`. Its not `twitter.com`... because I don't have access to twitter's DNS records.. duhh.

So why not `twitter.eth`? Well I'm a stubborn an impatient developer (duhh) so I bought another domain (cuz domains r cool lol) and am running it off of here for the time being. But hey, if you own `twitter.eth`, know the fella, or run `twitter.com` (hi sir 😊👉👈), please reach out [to me here](https://luc.contact/) and lets talk.
