// https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki
// bitcoin:<address>[?amount=<amount>][?label=<label>][?message=<message>]

var bs58check = require('bs58check')
var qs = require('qs')

function decode (uri) {
  if (!/bitcoin:/.test(uri)) throw new Error('Invalid BIP21 encoded URI: ' + uri)

  var qsplit = uri.slice(8).split('?')
  var address = qsplit[0]

  // throws if invalid
  bs58check.decode(address)

  var query = qsplit[1]
  var parsed = qs.parse(query)

  parsed.address = address

  if (parsed.amount) {
    parsed.amount = parseFloat(parsed.amount)

    if (!isFinite(parsed.amount)) throw new Error('Invalid amount')
    if (parsed.amount < 0) throw new Error('Invalid amount')
  }

  return parsed
}

function encode (address, options) {
  // throws if invalid
  bs58check.decode(address)

  options = options || {}

  if (options.amount) {
    if (!isFinite(options.amount)) throw new TypeError('Invalid amount')
    if (options.amount < 0) throw new TypeError('Invalid amount')
  }

  var query = qs.stringify(options)

  return "bitcoin:" + address + (query ? '?' : '') + query
}

module.exports = {
  decode: decode,
  encode: encode
}
