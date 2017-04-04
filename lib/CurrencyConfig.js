// @flow
import ConfigNOK from '../config/config_NOK'
import ConfigDKK from '../config/config_DKK'
import ConfigAUD from '../config/config_AUD'
import ConfigCAD from '../config/config_CAD'
import ConfigEUR from '../config/config_EUR'
import ConfigGBP from '../config/config_GBP'
import ConfigINR from '../config/config_INR'
import ConfigNZD from '../config/config_NZD'
import ConfigSEK from '../config/config_SEK'
import ConfigUSD from '../config/config_USD'
import ConfigISK from '../config/config_ISK'

export let getCurrencyConfig = (currencyCode: ?string) => {
  switch (currencyCode) {
    case 'NOK': return {...ConfigNOK, currencyCode}
    case 'DKK': return {...ConfigDKK, currencyCode}
    case 'SEK': return {...ConfigSEK, currencyCode}
    case 'GBP': return {...ConfigGBP, currencyCode}
    case 'USD': return {...ConfigUSD, currencyCode}
    case 'AUD': return {...ConfigAUD, currencyCode}
    case 'CAD': return {...ConfigCAD, currencyCode}
    case 'NZD': return {...ConfigNZD, currencyCode}
    case 'INR': return {...ConfigINR, currencyCode}
    case 'ISK': return {...ConfigISK, currencyCode}
    default : return {...ConfigEUR, currencyCode: 'EUR'}
  }
}
