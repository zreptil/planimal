import {Injectable} from '@angular/core';
import {Oauth2pkce, oauth2SyncType} from '@/_services/sync/oauth2pkce';
import {DropboxService, oauthStatus} from '@/_services/sync/dropbox.service';
import {GLOBALS} from '@/_services/globals.service';
import {DialogParams, DialogResultButton} from '@/_model/dialog-data';
import {MessageService} from '@/_services/message.service';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  /**
   * is called when the credentials are set to storage. Can be overwritten
   * to execute custom code instead of the default code that is executed
   * by the specialized sync-service.
   */
  onSetCredentialsToStorage: (value: string, isRefreshing: boolean) => void;

  /**
   * is called when the credentials should be retrieved from storage. Can be
   * overwritten to execute custom code instead of the default code that is
   * executed by the specialized sync-service.
   *
   * @return credentials read from storage
   */
  onGetCredentialsFromStorage: () => string;

  constructor(public dbs: DropboxService,
              public ms: MessageService) {
    dbs.onSetCredentialsToStorage = this._onSetCredentialsToStorage.bind(this);
    dbs.onGetCredentialsFromStorage = this._onGetCredentialsFromStorage.bind(this);
    dbs.startOauth2Workflow = this.startOauth2Workflow.bind(this);
    dbs.isSameContent = this.isSameContent.bind(this);
  }

  _syncType: oauth2SyncType = oauth2SyncType.none;

  get syncType(): oauth2SyncType {
    return this._syncType;
  }

  set syncType(value: oauth2SyncType) {
    this._syncType = value ?? oauth2SyncType.none;
    // GLOBALS.saveWebData();
    if (this._syncType === oauth2SyncType.none) {
      // GLOBALS.saveWebData();
    } else {
      this.dbs.connect();
      // this.gds.oauth2Check();
    }
  }

  get hasSync(): boolean {
    return this.syncType !== oauth2SyncType.none;
  }

  init(): void {
    this.dbs.init();
    if (this.dbs.status === oauthStatus.hasAccessToken) {
      this._syncType = oauth2SyncType.dropbox;
    }
  }

  /**
   * get information for the start of the oauth2 workflow.
   */
  startOauth2Workflow(): Observable<Oauth2pkce> {
    const msg = this.msgOauth2Workflow($localize`Dropbox`);
    return this.ms.confirm(msg,
      new DialogParams({image: 'assets/images/dropbox.png'})).pipe(map(result => {
      const ret = new Oauth2pkce();
      ret.doSignin = result.btn === DialogResultButton.yes;
      ret.isDebug = GLOBALS.mayDebug;
      if (ret.doSignin) {
        this._syncType = oauth2SyncType.dropbox;
        // GLOBALS.saveWebData();
      }
      return ret;
    }));
  }

  isSameContent(src: any, dst: any): boolean {
    return JSON.stringify(src) === JSON.stringify(dst);
  }

  msgOauth2Workflow(serviceName: string): string {
    return $localize`The connection to ${serviceName} requires a confirmation
                      that ${GLOBALS.appTitle} can read and write the data from
                       ${serviceName}. This confirmation is requested with special
                        dialogs from ${serviceName}. Everything that has to be
                        confirmed there is beyond ${GLOBALS.appTitle}'s control.
                         Should the confirmation process be started?`;
  }

  toggleSyncDropbox() {
    if (this.syncType === oauth2SyncType.dropbox) {
      const params = new DialogParams();
      params.image = 'assets/images/dropbox.png';
      this.ms.confirm($localize`Do you want to unsync with Dropbox?`, params).subscribe(result => {
        if (result.btn == DialogResultButton.yes) {
          this.dbs.disconnect();
          this.syncType = oauth2SyncType.none;
        }
      });
    } else {
      this.dbs.connect();
    }
  }

  // async uploadFile(filename: string, content: string) {
  //   switch (GLOBALS.syncType) {
  //     case oauth2SyncType.dropbox:
  //       return this.dbs.uploadFile(filename, content);
  //   }
  // }

  /**
   * download a file.
   *
   * @param filename name of the file to upload (containig path)   */
  async downloadFile(filename: string) {
    switch (this.syncType) {
      case oauth2SyncType.dropbox:
        return this.dbs.downloadFile(filename);
    }
    return null;
  }

  async uploadFile(filename: string, content: string) {
    switch (this.syncType) {
      case oauth2SyncType.dropbox:
        return this.dbs.uploadFile(filename, content);
    }
    return null;
  }

  private _onSetCredentialsToStorage(value: string, isRefreshing: boolean): void {
    if (this.onSetCredentialsToStorage != null) {
      this.onSetCredentialsToStorage(value, isRefreshing);
    }
  }

  private _onGetCredentialsFromStorage(): string {
    if (this.onGetCredentialsFromStorage != null) {
      return this.onGetCredentialsFromStorage();
    }
    return '';
  }
}

