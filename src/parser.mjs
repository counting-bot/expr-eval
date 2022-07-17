import { TEOF } from './token.mjs';
import { TokenStream } from './token-stream.mjs';
import { ParserState } from './parser-state.mjs';
import { Expression } from './expression.mjs';
import { add, sub, mul, div, mod, neg, power } from './functions.mjs';

export class Parser {
  constructor() {
    this.unaryOps = {
      sqrt: Math.sqrt,
      '-': neg,
      '+': Number,
      exp: Math.exp,
    };

    this.binaryOps = {
      '+': add,
      '-': sub,
      '*': mul,
      '/': div,
      '%': mod,
      '^': power,
    };

    this.functions = {
      pow: Math.pow,
    };
  }
  parse(expr) {
    let instr = [];
    const parserState = new ParserState(this, new TokenStream(this, expr));

    parserState.parseAddSub(instr);
    parserState.expect(TEOF, 'EOF');

    return new Expression(instr, this);
  }
  evaluate(expr) {
    return this.parse(expr).evaluate();
  }
}