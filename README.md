![Sendeo logo](/src/images/sendeo-logo-inline-black.png?raw=true "Sendeo")

[![CircleCI](https://circleci.com/gh/slipo/sendeo.svg?style=shield&circle-token=31624fa895986003936913d87ba9af77879fd2bf)](https://circleci.com/gh/slipo/sendeo) [![codecov](https://codecov.io/gh/slipo/sendeo/branch/master/graph/badge.svg?token=FjzTRoGTrg)](https://codecov.io/gh/slipo/sendeo)

----

# Overview

**sendeo** is a dApp designed to help people share NEO and GAS with others unfamiliar with cryptocurrencies. If you've ever wanted to send a crypto gift to somebody who doesn't even know what a wallet is, this dApp's for you.

When you use **sendeo**, you send NEO or GAS into the [smart contract](/contract/sendeo.py). A temporary escrow account is generated and a link with the key is given to you. You then can send that link to the recipient. When they click the link, they're told how cryptocurrencies work and how to securely create an account with [neon-wallet](https://github.com/CityOfZion/neon-wallet) or [NeoLink](https://github.com/slipo/neolink/tree/dapp). They then send the money out of the contract using the dApp.

What if they don't bother to get their gift? After one week everything is automatically returned to the sender's address (Side note: this functionality requires some code to run occaisionally on a server to sweep the assets to the origin accounts. If we ever turn this functionality off, the dApp still has a button for you to manually retrieve your assets).

The dApp website is run client side and NeoLink is used so you never have to enter your private key.

# Usage

Download [this version of NeoLink](https://github.com/slipo/neolink/tree/dapp) to be sure it works and follow the installation instructions.

Visit [Sendeo](http://sendeo.surge.sh/) and watch the video or [watch it on YouTube](https://www.youtube.com/watch?v=jMUIxWVXYdw)

# History

We created this as part of the [second City of Zion dApp contest](https://cityofzion.io/dapps/2). More info on our submission can be found in the [CONTEST.md file](/CONTEST.md).

# Authors

* [slipo](https://github.com/slipo)
* [l0c0luke](https://github.com/l0c0luke)
