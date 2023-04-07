import {Injectable} from '@angular/core';
import {Log, LogService} from '@/_services/log.service';
import {Utils} from '@/classes/utils';
import {GLOBALS, GlobalsService} from '@/_services/globals.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(globals: GlobalsService) {
    LogService.create(localStorage.getItem(GLOBALS.debugFlag) === GLOBALS.debugActive,
      localStorage.getItem('iamdev') === 'true',
      true);
  }

  read(key: string, asJson = true): any {
    let ret = null;
    try {
      ret = localStorage.getItem(key);
      if (ret === 'null' || ret == null) {
        ret = asJson ? '{}' : '';
      }
      if (asJson) {
        ret = JSON.parse(ret);
      }
    } catch (ex) {
      Log.devError(ex, `Fehler bei StorageService.read(${key}) => ${ret}`);
    }
    return ret;
  }

  write(key: string, data: any, cvt = true): void {
    let value = data;
    if (cvt) {
      value = JSON.stringify(data);
      if (value.startsWith('"')) {
        value = value.substring(1);
      }
      if (value.endsWith('"')) {
        value = value.substring(0, value.length - 1);
      }
    }
    if (Utils.isEmpty(value)) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  }

  clearStorage(): void {
    if (GLOBALS.skipStorageClear) {
      return;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      let doKill = true;
      if (key === GLOBALS.debugFlag) {
        doKill = false;
      }
      if (doKill) {
        window.localStorage.removeItem(key);
      }
    }
  }

  // writeCrypt(key: string, src: string) {
  //   const dst = Settings.doit(src);
  //   this.write(key, dst, dst !== src);
  // }
}
