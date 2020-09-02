const scrapeIt = require('scrape-it') // scrapper
const FS = require('fs')
const PATH = require('path')
const axios = require('axios')

const PAGES = 4
const url = n => `https://www.dofus.com/es/mmorpg/enciclopedia/recursos?text=&EFFECTMAIN_and_or=AND&object_level_min=1&object_level_max=200&type_id[0]=78&EFFECT_and_or=AND&page=${n}`
const BLUEPRINT = {
  runes: {
    listItem: '.ak-linker a',
    data: {
      url: {
        selector: 'img',
        attr: 'src'
      },
      title: {
        selector: 'a img',
        attr: 'alt',
        convert: x => x.replace(/\s+/g, '-')
      }
    }
  }
}

multiScrap()

async function multiScrap () {
  for (let i = 1; i <= PAGES; i++) {
    const scrape = await scrapeIt(url(i), BLUEPRINT)
    const cleanData = cleaner(scrape.data.runes)
    cleanData.forEach(item => download(item))
  }
}

/**
 * Clean void objects
 *
 * @param {Array} data
 * @returns Array
 */
function cleaner (data) {
  return data.filter(item => item.url && item.title)
}

async function download ({ url, title }) {
  const path = PATH.resolve(__dirname, 'runes', `${title}.png`)
  const writer = FS.createWriteStream(path)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
