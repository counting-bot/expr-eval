export const INUMBER = 'INUMBER';
export const IOP1 = 'IOP1';
export const IOP2 = 'IOP2';
export const IVAR = 'IVAR';
export const IVARNAME = 'IVARNAME';
export const IFUNCALL = 'IFUNCALL';
export const IEXPR = 'IEXPR';
export const IEXPREVAL = 'IEXPREVAL';

export class Instruction {
  constructor(type, value) {
    this.type = type;
    this.value = (value !== undefined && value !== null) ? value : 0;
  }
}

export function unaryInstruction(value) {
  return new Instruction(IOP1, value);
}

export function binaryInstruction(value) {
  return new Instruction(IOP2, value);
}