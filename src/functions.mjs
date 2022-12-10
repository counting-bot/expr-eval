export const unaryOps = {
  sqrt: Math.sqrt,
  '-': (a) => {
    return -a;
  },
  '+': Number,
  exp: Math.exp,
};

export const binaryOps = {
  '+': (a, b)  => {
    return Number(a) + Number(b);
  },
  '-': (a, b)  => {
    return a - b;
  }
  ,
  '*': (a, b)  => {
    return a * b;
  },
  '/': (a, b)  => {
    return a / b;
  },
  '%': (a, b)  => {
    return a % b;
  },
  '^': (a, b)  => {
    return a ** b;
  },
};