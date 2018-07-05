const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const _ = require('lodash')
require('colors')

// Change the path to your stats.json here
const pathToStats = '../reports/stats.json'

const toBytes = (bytes, precision = 1) => {
  if (bytes === '0' || bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
    return '-'
  }
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']
  const number = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, Math.floor(number))).toFixed(precision)} ${units[number]}`
}

fs.readFileAsync(path.join(__dirname, pathToStats)).then((data) => {
  const stats = JSON.parse(data)

  const chunkedModules = {}
  stats.modules.forEach((module) => {
    module.chunks.forEach((chunkId) => {
      const alreadyExists = !!chunkedModules[chunkId]
      if (alreadyExists) {
        chunkedModules[chunkId].push(module)
      } else {
        chunkedModules[chunkId] = [module]
      }
    })
  })

  Object.keys(chunkedModules).forEach((chunkId) => {
    const chunk = chunkedModules[chunkId]
    console.log(`\n------------------------------------ Chunk ${chunkId} ------------------------------------`.green)
    const totalSize = _.sum(chunk.map(chunk => chunk.size))
    console.log(`Total Size: ${toBytes(totalSize)}\n`.green)

    const chunkHeirachy = {}

    const orderedChunk = _.orderBy(chunk, ['size', 'name'], ['desc', 'asc'])

    orderedChunk.forEach((module) => {
      const nameReplaced = module.name.replace('./', '').replace('~/', '')
      const nameSplit = nameReplaced.split('/')

      _.set(chunkHeirachy, nameSplit, {
        name: nameReplaced,
        size: module.size,
        chunks: module.chunks,
        level: nameSplit.length - 1,
        baseLevel: true,
      })
    })

    const getSize = items => _.sum(Object.keys(items).map((itemName) => {
      const item = items[itemName]
      if (item.baseLevel) {
        return item.size
      } 
      return getSize(item)
    }))

    const spacing = 3
    const logItems = (items = {}, level) => {
      const spacer = new Array(level * spacing + 1).join(' ')

      Object.keys(items).forEach((itemName) => {
        const item = items[itemName]
        if (!item.baseLevel) {
          const size = getSize(item)
          const sizeString = `${toBytes(size)}          `
          const sizeStringLimited = sizeString.substring(0, 7)
          console.log(`${spacer}${sizeStringLimited}`.red, `${itemName}`)
          logItems(item, level + 1)
        } else {
          const size = item.size
          const sizeString = `${toBytes(size)}          `
          const sizeStringLimited = sizeString.substring(0, 7)
          console.log(`${spacer}${sizeStringLimited}`.red, `${itemName}`)
        }
      })
    }

    logItems(chunkHeirachy, 0)
  })
})
