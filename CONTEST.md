# 2nd City Of Zion dApp contest

This is our entry into the dApp contest. Information on our project in terms of the contest's four evaluation topics follows.

## Smart contract application novelty and technical impressiveness

This project contains three main parts, each in separate directories in the repository.

### Contract

The [smart contract](/contract/) was painstakingly crafted.

Originally it followed the two step withdrawal method. This method was deemed to be less than secure as the verification could pass allowing the assets to leave and the invocation could fail, meaning the user's balance would stay the same.

The contract was completely rewritten to give the escrow account ownership to the specified incoming txId when the sender deposits. The beauty of this approach is that the NEO nodes handle security 100%. The escrow account can withdraw specifying the original vin txid. Once this is used it can never be used again, by definition. Change is not allowed to go back to the contract, ensuring that all assets are withdrawn.

### Autorescinder

The [autorescind code](/autorescinder/) is an optional addon to the contract. It runs on cron and sends out any deposits that have sat in the contract for at least 7 days. The contract allows any address to make these withdrawals but the destination address must be the original sender's address. We think this is a nice technical feature to showcase because generally with blockchain a user must initiate any action. We, of course, take advantage of NEO's zero fee (under 10 GAS) for invocations. If this changes this feature could break. However, we have a manual rescind button in the dApp website as well.

### dApp website

The [dApp website](/src/) features a variety of interesting ways to use neon-js to interact with storage, transactions and the contract itself. Additionally it integrates with the new, in-development React version of NeoLink.

## Overall impact and importance to ecosystem

The idea of this dApp is to bring more people into the NEO community and get them to feel comfortable with crypto in general. Also, at the bottom of this document is a list of community contributions.

## Quality of documentation (english required)

There's this, the readme, the dApp website itself and the comments in the contract and the React code. We've made an effort to write automated tests which is, of course, a form of documentation.

## Community presence

Effort has been made to interact in the community, both in the Discord channel as well as the open source contributions below.

The following work was done for or inspired by this project:

### neon-js

* [Support sending assets from contract](https://github.com/CityOfZion/neon-js/pull/158)

### NeoLink

* [Move to react, first round ](https://github.com/CityOfZion/NeoLink/pull/11)
* [Send invoke implementation](https://github.com/CityOfZion/NeoLink/pull/21)
* [Allow for send invoke calls from websites the user visits](https://github.com/CityOfZion/NeoLink/pull/27)
* [Put login screen in front of auth-required panes](https://github.com/CityOfZion/NeoLink/pull/34)
* [Implement testing with jest/enzyme and move from Preact to React](https://github.com/CityOfZion/NeoLink/pull/40)
* [Private network support](https://github.com/CityOfZion/NeoLink/pull/49)
* [Prepush runs lint + tests](https://github.com/CityOfZion/NeoLink/pull/54)
* [Properly validate send form](https://github.com/CityOfZion/NeoLink/pull/55)

### neoscan

* [Separate out seed configuration](https://github.com/CityOfZion/neo-scan/pull/118)

### NeonDB on privnet

* Into ixje's branch: [Syncing code updates to work without lastTrustedBlock preset](https://github.com/ixje/neon-wallet-db/pull/1)

### New projects to aide in privnet setups

* [Neoscan docker-compose for easy privnet setup](https://github.com/slipo/neo-scan-docker)
* [Neoscan Docker Hub image](https://hub.docker.com/r/slipoh/neo-scan/)
* [NeonDB + privnet with gas docker compose](https://gist.github.com/slipo/f18f1a0b5e6adb7b0bf172b93379d891)
* [NeonDB Docker Hub Image](https://hub.docker.com/r/slipoh/neon-wallet-db/) from [slipo's neon-wallet-db repo](https://github.com/CityOfZion/neon-wallet-db)
* [neo-kube](https://github.com/slipo/neo-kube)

### awesome-neo

* [Info for neoscan privnet + NeonDB docker compose option](https://github.com/CityOfZion/awesome-neo/pull/48)

### neo-boa
* [Fix Attribute class naming so methods work in VM ](https://github.com/CityOfZion/neo-boa/pull/33)
