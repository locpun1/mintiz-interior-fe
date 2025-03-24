import round from 'lodash/round';
import numeral from 'numeral';

import 'numeral/locales/vi';
import 'numeral/locales/en-gb';
import 'numeral/locales/ja';

import Regexs from './Regexs';

class Numeral {
  private locales = localStorage.getItem('i18nConfig');
  private langBrowser = navigator.language;
  private langCode = this.locales ? JSON.parse(this.locales) : this.langBrowser.split('-')[0];

  constructor() {
    // numeral.locale(this.langCode);
    numeral.locale('ja');
  }

  public price(value: string | number) {
    let currencySymbol = '';
    let format = '0,0[.]000';

    switch (this.langCode) {
      case 'vi':
        currencySymbol = '₫';
        format = '0,0[.]000 $';
        break;
      case 'ja':
        currencySymbol = '¥';
        format = '$ 0,0[.]000';
        break;
      default:
        currencySymbol = '$';
        format = '$ 0,0[.]000';
    }

    const formattedValue = numeral(value).format(format);
    return formattedValue.replace('$', currencySymbol);
  }

  public round(value: any, precision: number = 2) {
    const valueAsString = String(value);
    if (!Regexs.decimal.test(valueAsString)) return null;
    return round(parseFloat(valueAsString), precision);
  }
}

export default new Numeral();
