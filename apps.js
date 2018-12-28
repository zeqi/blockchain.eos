const Eos = require('eosjs')
// Default configuration
config = {
  chainId: '3751dd4b431557c3dcd345746829b2d3a8e9aaef4c3dcf2b65200f871a631264', // 32 byte (64 char) hex string
  keyProvider: ['5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr'], // WIF string or array of keys..
  httpEndpoint: 'http://10.140.40.16:8888',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

eos = Eos(config)

// console.log(eos)

// Connect to a testnet or mainnet
// eos.getBlock()

// eos.getInfo((error, result) => { console.log(error, result) })

// eos.getKeyAccounts('EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s').then(console.log)

eos.getAccount('usera').then(data => {
  return eos.transfer('usera', 'userb', '3.0000 SYS', '中国美好时光');
}).then(console.log)

// eos.getCurrencyBalance('eosio.token', 'userb', 'SYS').then(console.log)

// eos.getActions('usera').then(console.log)

// eos.transfer('usera', 'userb', '1.0000 SYS', '中国美好时光', (error, result) => {
//   console.log(error, result)
// })

// const balance = await eos.getCurrencyBalance('eosio.token', 'usera', 'SYS')
// console.log('Currency Balance', balance)
// Cold-storage
// eos = Eos({httpEndpoint: null, chainId, keyProvider})

// Add support for non-EOS public key prefixes, such as PUB, etc
// eos = Eos({keyPrefix: 'PUB'})

// const ecc = require('eosjs-ecc')

// ecc.randomKey().then(privateKey => {
//   console.log('Private Key:\t', privateKey) // wif
//   console.log('Public Key:\t', ecc.privateToPublic(privateKey)) // EOSkey...
// })

// const EosApi = require('eosjs-api')

// var options = {
//   httpEndpoint: 'http://10.140.40.17:8888', // default, null for cold-storage
//   verbose: true, // API logging
//   logger: { // Default logging functions
//     log: config.verbose ? console.log : null,
//     error: config.verbose ? console.error : null
//   },
//   fetchConfiguration: {}
// }

// eosapi = EosApi(options)

// console.log(eosapi)
// eosapi.getBlock({block_num_or_id: 1}).then(result => console.log(result))
