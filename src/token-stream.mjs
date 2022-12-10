import { Token, TEOF, TOP, TNUMBER, TPAREN, TCOMMA, TNAME } from './token.mjs';

export class TokenStream {
  constructor(expression, reject) {
    this.pos = 0;
    this.current = null;
    this.expression = expression;
    this.savedPosition = 0;
    this.savedCurrent = null;
    this.reject=reject
  }
  newToken(type, value, pos) {
    return new Token(type, value, pos != null ? pos : this.pos);
  }
  save() {
    this.savedPosition = this.pos;
    this.savedCurrent = this.current;
  }
  restore() {
    this.pos = this.savedPosition;
    this.current = this.savedCurrent;
  }
  next() {
    if (this.pos >= this.expression.length) {
      return this.newToken(TEOF, 'EOF');
    }

    if (this.isRadixInteger() ||
      this.isNumber() ||
      this.isOperator() ||
      this.isString() ||
      this.isParen() ||
      this.isComma() ||
      this.isName()) {
      return this.current;
    } else {
      this.reject(this.expression);
    }
  }
  isString() {
    const quote = this.expression.charAt(this.pos);

    return quote === '\'' || quote === '"'
  }
  isParen() {
    const c = this.expression.charAt(this.pos);
    if (c === '(' || c === ')') {
      this.current = this.newToken(TPAREN, c);
      this.pos++;
      return true;
    }
    return false;
  }
  isComma() {
    const c = this.expression.charAt(this.pos);
    if (c === ',') {
      this.current = this.newToken(TCOMMA, ',');
      this.pos++;
      return true;
    }
    return false;
  }
  isName() {
    const startPos = this.pos;
    let i = startPos;
    let hasLetter = false;
    for (; i < this.expression.length; i++) {
      const c = this.expression.charAt(i);
      if (c.toUpperCase() === c.toLowerCase()) {
        if (i === this.pos && (c === '$' || c === '_')) {
          if (c === '_') {
            hasLetter = true;
          }
          continue;
        } else if (i === this.pos || !hasLetter || (c !== '_' && (c < '0' || c > '9'))) {
          break;
        }
      } else {
        hasLetter = true;
      }
    }
    if (hasLetter) {
      const str = this.expression.substring(startPos, i);
      this.current = this.newToken(TNAME, str);
      this.pos += str.length;
      return true;
    }
    return false;
  }
  isRadixInteger() {
    let pos = this.pos;

    if (pos >= this.expression.length - 2 || this.expression.charAt(pos) !== '0') {
      return false;
    }
    ++pos;

    let radix;
    let validDigit;
    if (this.expression.charAt(pos) === 'x') {
      radix = 16;
      validDigit = /^[0-9a-f]$/i;
      ++pos;
    } else if (this.expression.charAt(pos) === 'b') {
      radix = 2;
      validDigit = /^[01]$/i;
      ++pos;
    } else {
      return false;
    }

    let valid = false;
    const startPos = pos;

    while (pos < this.expression.length) {
      const c = this.expression.charAt(pos);
      if (validDigit.test(c)) {
        pos++;
        valid = true;
      } else {
        break;
      }
    }

    if (valid) {
      this.current = this.newToken(TNUMBER, parseInt(this.expression.substring(startPos, pos), radix));
      this.pos = pos;
    }
    return valid;
  }
  isNumber() {
    let valid = false;
    let pos = this.pos;
    const startPos = pos;
    let resetPos = pos;
    let foundDot = false;
    let foundDigits = false;
    let c;

    while (pos < this.expression.length) {
      c = this.expression.charAt(pos);
      if ((c >= '0' && c <= '9') || (!foundDot && c === '.')) {
        if (c === '.') {
          foundDot = true;
        } else {
          foundDigits = true;
        }
        pos++;
        valid = foundDigits;
      } else {
        break;
      }
    }

    if (valid) {
      resetPos = pos;
      this.current = this.newToken(TNUMBER, parseFloat(this.expression.substring(startPos, pos)));
      this.pos = pos;
    } else {
      this.pos = resetPos;
    }
    
    return valid;
  }
  isOperator() {
    const c = this.expression.charAt(this.pos);

    if (c === '+' || c === '-' || c === '*' || c === '/' || c === '%' || c === '^' || c === '.') {
      this.current = this.newToken(TOP, c);
    } else if (c === '∙' || c === '•') {
      this.current = this.newToken(TOP, '*');
    } else {
      return false;
    }
    this.pos++;

    return true;
  }
}