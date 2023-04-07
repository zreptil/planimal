import {Injectable} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import enUS from '@angular/common/locales/en';
import enGB from '@angular/common/locales/en-GB';
import de from '@angular/common/locales/de';
import {loadTranslations} from '@angular/localize';
import {LangData} from '@/_model/lang-data';
import {CrowdinData} from '@/_model/crowdin-data';
import * as messages from '../../assets/messages.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  languageList: LangData[] = [
    new LangData('en-GB', `English (GB)`, 'gb', null, 0),
    new LangData('en-US', `English (USA)`, 'us', null, 1),
    new LangData('de-DE', `Deutsch`, 'de', CrowdinData.factoryEnglish(), 2),
  ];

  constructor() {
  }

  activate(langCode?: string) {
    // const messages: any = {default: [{'id': 'en-GB', 'data': {}}]}
    if (langCode == null) {
      langCode = JSON.parse(localStorage.getItem('webData'))?.w0 ?? 'en-GB';
    }
    let lng = (messages as any).default.find((lang: any) => lang.id === langCode);
    if (lng == null) {
      lng = (messages as any).default[0];
    }
    loadTranslations(lng.data);
    console.log('languages', lng);
    registerLocaleData(({
      'en-US': enUS,
      'en-GB': enGB,
      'de-DE': de,
    } as any)[lng.id]);
  }
}
