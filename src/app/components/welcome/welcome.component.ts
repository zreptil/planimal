import {Component} from '@angular/core';
import {GlobalsService} from '@/_services/globals.service';
import {SyncService} from '@/_services/sync/sync.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  constructor(public globals: GlobalsService,
              public sync: SyncService) {

  }

  showMark(id: string) {
    const elem = document.querySelector(`${id}`);
    if (elem == null) {
      return;
    }
    const mark = document.querySelector('#mark');
    if (mark != null) {
      mark.removeAttribute('hidden');
      const off = this.getOffsets(elem);
      let style = '';
      style += `left:${off.x}px`;
      style += `;top:${off.y}px`;
      style += `;background:rgba(255,255,255,0.5)}`;
      style += `;border:var(--markFrame) 3px solid`;
      style += `;width:${elem.clientWidth - 6}px`;
      style += `;height:${elem.clientHeight - 6}px`;
      mark.setAttribute('style', style);
      mark.className = 'animated bounceInLeft';
    }
  }

  hideMark() {
    const mark = document.querySelector('html #mark');
    if (mark != null) {
      mark.className = 'animated zoomOutRight';
      mark.setAttribute('hidden', '');
    }
  }

  getOffsets(elem: any, ret: any = null): any {
    if (ret == null) {
      ret = {x: 0, y: 0};
    }
    if (elem) {
      ret.x += elem.offsetLeft;
      ret.y += elem.offsetTop;
      this.getOffsets(elem.offsetParent, ret);
    }

    return ret;
  }
}
