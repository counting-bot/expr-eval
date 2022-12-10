import { Instruction } from './instruction.mjs';
import { unaryOps } from './functions.mjs';

const ADD_SUB_OPERATORS = ['+', '-'];

const TERM_OPERATORS = ['*', '/', '%'];

export class ParserState {
  constructor(tokenStream, reject) {
    this.tokens = tokenStream;
    this.current = null;
    this.nextToken = null;
    this.next();
    this.savedCurrent = null;
    this.savedNextToken = null;
    this.reject=reject

    this.instr = []
  }
  next() {
    this.current = this.nextToken;
    return (this.nextToken = this.tokens.next());
  }
  tokenMatches(token, value) {
    if (typeof value === 'undefined') {
      return true;
    } else if (Array.isArray(value)) {
      return value.includes(token.value)
    } else if (typeof value === 'function') {
      return value(token);
    } else {
      return token.value === value;
    }
  }
  save() {
    this.savedCurrent = this.current;
    this.savedNextToken = this.nextToken;
    this.tokens.save();
  }
  restore() {
    this.tokens.restore();
    this.current = this.savedCurrent;
    this.nextToken = this.savedNextToken;
  }
  accept(type, value) {
    if (this.nextToken.type === type && this.tokenMatches(this.nextToken, value)) {
      this.next();
      return true;
    }
    return false;
  }
  expect(type, value) {
    if (!this.accept(type, value)) {
      this.reject(this.tokens.expression);
    }
  }
  parseAtom(instr) {
    function isPrefixOperator(token) {
      return token.value in unaryOps;
    }

    if (this.accept("TNAME") || this.accept("TOP", isPrefixOperator)) {
      instr.push(new Instruction("IVAR", this.current.value));
    } else if (this.accept("TNUMBER")) {
      instr.push(new Instruction("INUMBER", this.current.value));
    } else if (this.accept("TSTRING")) {
      instr.push(new Instruction("INUMBER", this.current.value));
    } else if (this.accept("TPAREN", '(')) {
      this.parseAddSub(instr);
      this.expect("TPAREN", ')');
    } else {
      this.reject(this.tokens.expression);
    }
  }
  parseAddSub(instr) {
    this.parseTerm(instr);
    while (this.accept("TOP", ADD_SUB_OPERATORS)) {
      const op = this.current;
      this.parseTerm(instr);
      instr.push(new Instruction("IOP2", op.value));
    }
  }
  parseTerm(instr) {
    this.parseFactor(instr);
    while (this.accept("TOP", TERM_OPERATORS)) {
      const op = this.current;
      this.parseFactor(instr);
      instr.push(new Instruction("IOP2", op.value));
    }
  }
  parseFactor(instr) {
    function isPrefixOperator(token) {
      return token.value in unaryOps;
    }

    this.save();
    if (this.accept("TOP", isPrefixOperator)) {
      if (this.current.value !== '-' && this.current.value !== '+') {
        if (this.nextToken.type === "TPAREN" && this.nextToken.value === '(') {
          this.restore();
          this.parseExponential(instr);
          return;
        } else if (this.nextToken.type === "TSEMICOLON" || this.nextToken.type === "TCOMMA" || this.nextToken.type === "TEOF" || (this.nextToken.type === "TPAREN" && this.nextToken.value === ')')) {
          this.restore();
          this.parseAtom(instr);
          return;
        }
      }

      const op = this.current;
      this.parseFactor(instr);
      instr.push(new Instruction("IOP1", op.value));
    } else {
      this.parseExponential(instr);
    }
  }
  parseExponential(instr) {
    this.parseFunctionCall(instr);
    while (this.accept("TOP", '^')) {
      this.parseFactor(instr);
      instr.push(new Instruction("IOP2", "^"));
    }
  }
  parseFunctionCall(instr) {
    function isPrefixOperator(token) {
      return token.value in unaryOps;
    }

    if (this.accept("TOP", isPrefixOperator)) {
      const op = this.current;
      this.parseAtom(instr);
      instr.push(new Instruction("IOP1", op.value));
    } else {
      this.parseAtom(instr)
      while (this.accept("TPAREN", '(')) {
        if (this.accept("TPAREN", ')')) {
          instr.push(new Instruction("IFUNCALL", 0));
        } else {
          const argCount = this.parseArgumentList(instr);
          instr.push(new Instruction("IFUNCALL", argCount));
        }
      }
    }
  }
  parseArgumentList(instr) {
    let argCount = 0;

    while (!this.accept("TPAREN", ')')) {
      this.parseAddSub(instr);
      ++argCount;
      while (this.accept("TCOMMA")) {
        this.parseAddSub(instr);
        ++argCount;
      }
    }

    return argCount;
  }
}