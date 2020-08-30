const scrapeIt = require('scrape-it')

const URL = 'https://www.dofus.com/es/mmorpg/enciclopedia/recursos?text=&EFFECTMAIN_and_or=AND&object_level_min=1&object_level_max=200&type_id%5B%5D=78&EFFECT_and_or=AND#jt_list'

scrapeIt(URL, {
  runes: {
    listItem: '.ak-linker a',
    data: {
      url: {
        selector: 'a img',
        attr: 'src'
      },
      title: {
        selector: 'a img',
        attr: 'alt'
      }
    }
  }
}).then(({ data }) => {
  const cleanData = cleaner(data.runes)
  console.log(cleanData)
})

/**
 * Clean void objects
 *
 * @param {Array} data
 * @returns Array
 */
function cleaner (data) {
  return data.filter(item => item.url && item.title)
}
