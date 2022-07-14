import evaluate from './evaluate.mjs';

export class Expression {
  constructor(tokens, parser) {
    this.tokens = tokens;
    this.parser = parser;
    this.unaryOps = parser.unaryOps;
    this.binaryOps = parser.binaryOps;
    this.functions = parser.functions;
  }
  evaluate() {
    return evaluate(this.tokens, this);
  }
}