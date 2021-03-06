
/* eslint no-console:0 */
import {getTextStrings, supportedLanguageCodes} from '../index'
import {compareKeys, compareDollarSigns, checkBirgittaInconsistencies, checkStringLenght} from '../TestUtil'
jest.disableAutomock()

describe('TextStrings', () => {
  it('it should return Text Strings', () => {
    supportedLanguageCodes.forEach(lang => expect(getTextStrings(lang)).not.toEqual(undefined, 'Cant find TextStrings for: ' + lang))
  })

  xit('all textstrings should have a equivalent string in all other languages', () => {
    supportedLanguageCodes.forEach(lang1 => supportedLanguageCodes.forEach(lang2 => compareKeys(getTextStrings(lang1), getTextStrings(lang2), lang1, lang2)))
  })

  it('all textstrings should have right amount of $d and $c and $s signs signs', () => {
    supportedLanguageCodes.forEach(lang1 => {
      if (lang1 === 'sv')
        supportedLanguageCodes.forEach(lang2 => {
          if (lang2 === 'en') compareDollarSigns(getTextStrings(lang1), getTextStrings(lang2), lang1, lang2, '$')
        })
    })
    supportedLanguageCodes.forEach(lang1 => {
      if (lang1 === 'sv')
        supportedLanguageCodes.forEach(lang2 => {
          if (lang2 === 'en') compareDollarSigns(getTextStrings(lang1), getTextStrings(lang2), lang1, lang2, '$d')
        })
    })
    supportedLanguageCodes.forEach(lang1 => {
      if (lang1 === 'sv')
        supportedLanguageCodes.forEach(lang2 => {
          if (lang2 === 'en') compareDollarSigns(getTextStrings(lang1), getTextStrings(lang2), lang1, lang2, '$s')
        })
    })
  })

  it('all languages should have english as default', () => {
    expect(getTextStrings('en')).toEqual(getTextStrings(''))
  })

  xit('Text strings should not be more than 20% longer in other languages', () => {
    supportedLanguageCodes.forEach(lang2 => checkStringLenght(getTextStrings('en'), getTextStrings(lang2), 'en', lang2))
  })

  it('should not have any birgitta inconsistencies', () => {
    var errorMessages = {}
    supportedLanguageCodes.forEach((lang1, i) =>
      supportedLanguageCodes.forEach((lang2, j) => {
        var errorArray = checkBirgittaInconsistencies(getTextStrings(lang1), getTextStrings(lang2), lang1, lang2)
        errorArray.forEach(key => {
          errorMessages[key] = ''
        })
      }))
    console.warn(JSON.stringify(errorMessages, undefined, 2))
  })

  it('should not have unclosed brackers', () => {
    var leftSide = 0
    var rightSide = 0
    var error = []
    supportedLanguageCodes.forEach(languageCode => {
      var textString = JSON.stringify(getTextStrings(languageCode))

      leftSide = textString.split('[').length - 1
      rightSide = textString.split(']').length - 1
      if (leftSide !== rightSide)
        error.push(languageCode)
    })
    if (error.lenght > 0) console.warn(error)
    expect(error).toEqual([])
  })

  it('should have valid html tags', () => {
    var errors = []
    supportedLanguageCodes.forEach(languageCode => {
      var textStrings = getTextStrings(languageCode)
      Object.keys(textStrings).forEach((key) => {
        var text = textStrings[key]
        var valid = validateHTMLTag(text)

        if (!valid)
          errors.push(`No valid tags (<b>, </b> etc) in text: ${text}`)
      })
    })
    // console.warn(JSON.stringify(error[0], undefined, 2))
    // if (error.lenght > 0) console.warn(error, undefined, 2)
    expect(JSON.stringify(errors, undefined, 2)).toEqual('[]')
  })
})

it('should be able to validate tag', () => {
  expect(validateHTMLTag('<b>iodfoi')).toEqual(false)
  expect(validateHTMLTag('iodfoi')).toEqual(true)
  expect(validateHTMLTag('iodfoi</b>')).toEqual(false)
  expect(validateHTMLTag('<b>iodfoi< /b>')).toEqual(false)
  expect(validateHTMLTag('<b >iodfoi</b>')).toEqual(false)
  expect(validateHTMLTag('<underline >iodfoi</underline>')).toEqual(false)
  expect(validateHTMLTag('< b>iodfoi</b>')).toEqual(false)
  expect(validateHTMLTag('<b>iodfoi</b>')).toEqual(true)
})

var validateHTMLTag = (testString): boolean => {
  var htmlTagPairs = [
    ['<b>', '</b>'],
    ['<boldGreen>', '</boldGreen>'],
    ['<boldRed>', '</boldRed>'],
    ['<underline>', '</underline>'],
    ['<boldBlueUnderline>', '</boldBlueUnderline>']
  ]

  return !htmlTagPairs.some(pair =>
    pair.some((tag) => testString.includes(tag)) &&
            !pair.every((tag) => testString.includes(tag)))
}
