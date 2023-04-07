import {Component, OnInit} from '@angular/core';
import {LinkDef, Log} from '@/_services/log.service';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@/material.module';
import {FormsModule} from '@angular/forms';
import {LogPipe} from '@/components/log/log.pipe';
import {GLOBALS, GlobalsService} from '@/_services/globals.service';

@Component({
  imports: [CommonModule, MaterialModule, FormsModule, LogPipe],
  standalone: true,
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  constructor(public globals: GlobalsService) {
  }

  get msg(): { [key: string]: any[] } {
    return Log.msg;
  };

  get links(): LinkDef[] {
    return Log.links;
  }

  typeOf(line: any): string {
    if (typeof line === 'string') {
      return 'string';
    }
    return '';
  }

  onClickDelete(event: Event, type: string): void {
    event.preventDefault();
    Log.clear(type);
  }

  ngOnInit(): void {
  }

  showType(type: string) {
    let ret = this.msg[type].length > 0;
    if (ret && ['debug', 'todo'].includes(type) && !GLOBALS.isDebug) {
      return false;
    }
    return ret;
  }

  toBinary(text: string): string {
    const codeUnits = Uint16Array.from(
      {length: text.length},
      (element, index) => text.charCodeAt(index)
    );
    const charCodes = new Uint8Array(codeUnits.buffer);

    let result = '';
    charCodes.forEach((char) => {
      result += String.fromCharCode(char);
    });
    return result;
  }

  openLink(link: LinkDef) {
    window.open(link.url);
  }

  classForLine(line: any): string[] {
    const ret: string[] = [];
    if (line?._ != null) {
      ret.push('nobottomline');
    }
    return ret;

  }
}
