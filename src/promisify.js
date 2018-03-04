function promisify(functionToPromisify, passedArgs) {
  const args = Array.prototype.slice.call(passedArgs)

  const isCallbackPresent = typeof args[args.length-1] === 'function'

  if (isCallbackPresent) {
    return functionToPromisify.apply(this, args)
  }

  return new Promise((resolve, reject) => {
    args.push((error, response) => {
      if (error) return reject(error)
      return resolve(response)
    })

    functionToPromisify.apply(this, args)
  })
}

module.exports = promisify
