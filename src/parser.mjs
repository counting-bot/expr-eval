import { TokenStream } from './token-stream.mjs';
import { ParserState } from './parser-state.mjs';
import evaluateFile from './evaluate.mjs';

export const evaluate = expr => {

  return new Promise((resolve, reject) => {
    const tokenStream = new TokenStream(expr, reject)
    const parserState = new ParserState(tokenStream, reject);
  
    parserState.parseAddSub(parserState.instr)
    parserState.expect("TEOF", 'EOF');
  
    evaluateFile(parserState.instr, expr, resolve, reject);
  });
}