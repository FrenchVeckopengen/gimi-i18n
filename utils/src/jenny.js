/* eslint flow-header/flow-header: 0 */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
var keysToIgnore = [
  'child_about_data_tracking_title',
  'child_about_data_tracking_content',
  'parent_about_data_tracking_title',
  'parent_about_data_tracking_content',
  'child_advice_title',
  'child_advice_content',
  'parent_advice_title',
  'parent_advice_content',
  'data_knowledge_item_text',
  'knowledge_child_item_content',
  'knowledge_child_item_header',
  'data_tracking_assignment_threshold',
  '_permissions_denied',
  'vp_help_page_title',
  'vp_help_page_content',
  'transactions_help_page_title',
  'transactions_help_page_content',
  'task_editor_title_input_hint_example',
  'task_status',
  'category_name_1',
  'category_name_2',
  'category_name_3',
  'category_name_4',
  'category_name_5',
  'category_name_6',
  'category_name_7',
  'category_name_8',
  'category_name_9',
  'category_name_10',
  'category_name_11',
  'category_name_12',
  'category_name_13',
  'category_name_14',
  'category_name_15',
  'category_name_16',
  'category_name_17',
  'category_name_18',
  'category_name_19',
  'category_name_20',
  'category_name_21',
  'category_name_22',
  'category_name_23',
  'category_name_24',
  'category_name_25',
  'category_name_26',
  'category_name_27',
  'category_name_28',
  'category_name_29',
  'category_name_30',
  'category_name_31',
  'category_name_32',
  'category_name_33',
  'category_name_34',
  'category_name_35',
  'category_name_36',
  'category_name_37',
  'category_name_38',
  'category_name_39',
  'category_name_40',
  'category_name_41',
  'category_name_42',
  'category_name_43',
  'category_name_44',
  'category_name_45',
  'category_name_46',
  'category_name_47',
  'category_name_48'
]

var keysToDelete = []
var fs = require('fs')
var rootDir = '..'
var dirsToCheck = ['components', 'libs', 'hocs', 'i18n', 'config', 'reducers']
let textStringsSvFilePath = './text_strings/client/sv.json'
var TextStrings = fs.readFileSync(textStringsSvFilePath, {encoding: 'utf8'})
TextStrings = JSON.parse(TextStrings)
var foundKeys = 0
var ignoredKeys = 0

let checkFile = (file, key) => {
  var fileContents = fs.readFileSync(file, {encoding: 'utf8'})

  var isOk = false

  if (fileContents.indexOf(key) !== -1) isOk = true

  if (key.indexOf('_parent') !== -1) {
    if (fileContents.indexOf(key.split('_parent')[0]) !== -1) isOk = true
  }

  if (key.indexOf('_child') !== -1) {
    if (fileContents.indexOf(key.split('_child')[0]) !== -1) isOk = true
  }

  return isOk
}
let checkIfTextStringIsObsolete = (key) => {
  var isOk = false
  dirsToCheck.forEach((dirName) => {
    var dir = `${rootDir}/${dirName}/`
    var files = fs.readdirSync(dir)
    files.forEach((file) => {
      try {
        file = `${dir}/${file}`
        // console.log(`Reading file: "${file}"`)
        if (checkFile(file, key)) {
          isOk = true
        }
      } catch (e) {
        // console.log(`Failed reading file: "${file}"`)
        // console.log(e.message)
      }
    })
  })

  // text string is probably obsolete
  if (!isOk) {
    if (keysToIgnore.some(ignoredKey => key.indexOf(ignoredKey) !== -1)) { ignoredKeys++ } else {
      foundKeys++
      keysToDelete.push(key)
      console.log(`${key}\t\t\t\t\t\t${TextStrings[key].replace('\n', '')}`)
    }
  }
}

console.log('****** Begin Scan ********\n')

Object.keys(TextStrings).forEach(key => checkIfTextStringIsObsolete(key))

console.log('****** Scan Complete ********')
console.log(
  `
  Ignored text_strings: ${ignoredKeys}
  Found text_strings to delete: ${foundKeys}`)
if (process.argv.some(x => x === 'f')) {
  /** ****** Deleting TextStrings *******/
  console.log(`
      Removing ${foundKeys} text_strings from ${textStringsSvFilePath} ..
      `)
  keysToDelete.forEach((key) => {
    delete TextStrings[key]
  })

  TextStrings = JSON.stringify(TextStrings, undefined, 2)
  fs.unlinkSync(textStringsSvFilePath)
  fs.writeFileSync(textStringsSvFilePath, TextStrings, {encoding: 'utf8'})

  console.log(`
      Done
      `)
} else {
  console.log(`
  run with f to remove ${foundKeys} text_strings from ${textStringsSvFilePath}
  `)
}
