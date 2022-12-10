import { INUMBER, IOP1, IOP2, IVAR, IFUNCALL, IEXPREVAL } from './instruction.mjs';
import { unaryOps, binaryOps } from './functions.mjs';

export default function evaluate(tokens, expr, resolve, reject) {
  if (tokens && tokens.type === IEXPREVAL) {
    return tokens;
  }
  
  let nstack = [];
  let n1, n2;
  let f, args, argCount;

  const numTokens = tokens.length;

  for (let i = 0; i < numTokens; i++) {
    const item = tokens[i];

    switch (item.type){
      case INUMBER:
        nstack.push(item.value);
      break;
      case IOP2:
        n2 = nstack.pop();
        n1 = nstack.pop();
        f = binaryOps[item.value];
        nstack.push(f(n1, n2));
      break;
      case IVAR:
        if (/^__proto__|prototype|constructor$/.test(item.value)) {
          reject(expr);
        }

        if (item.value in unaryOps) {
          nstack.push(unaryOps[item.value]);
        } else {
          reject(expr);
        }
      break;
      case IOP1:
        n1 = nstack.pop();
        f = unaryOps[item.value];
        nstack.push(f(n1));
      break;
      case IFUNCALL:
        argCount = item.value;
        args = [];
        while (argCount-- > 0) {
          args.unshift(nstack.pop());
        }
        f = nstack.pop();
        if (f.apply && f.call) {
          nstack.push(f.apply(undefined, args));
        } else {
          reject(expr);
        }
      break;
      default:
        reject(expr);
      break;
    }
  }
  if (nstack.length > 1) {
    reject(expr);
  }
  // Explicitly return zero to avoid test issues caused by -0
  resolve(nstack[0] === 0 ? 0 : nstack[0]);
}
