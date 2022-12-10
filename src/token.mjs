export const TEOF = 'TEOF';
export const TOP = 'TOP';
export const TNUMBER = 'TNUMBER';
export const TSTRING = 'TSTRING';
export const TPAREN = 'TPAREN';
export const TCOMMA = 'TCOMMA';
export const TNAME = 'TNAME';
export const TSEMICOLON = 'TSEMICOLON';

export class Token {
  constructor(type, value, index) {
    this.type = type;
    this.value = value;
    this.index = index;
  }
}