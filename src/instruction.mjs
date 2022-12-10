export class Instruction {
  constructor(type, value) {
    this.type = type;
    this.value = (value !== undefined && value !== null) ? value : 0;
  }
}