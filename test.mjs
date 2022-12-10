import { evaluate } from '../src/parser.mjs';

const oprators = [
    "+",
    "-",
    "*",
    "/"
]

const genMath = () => {
    let str = '0'
    const randAmount = Math.floor(Math.random() * 100);
    for (let roundNum = 0; roundNum <= randAmount; roundNum++) {
        const randNumber = Math.floor(Math.random() * 100);

        const randOprotor = oprators[Math.floor(Math.random() * oprators.length)];

        str += `${randOprotor}${randNumber}`
    }
    return str
}
const run = async () => {
    let genTime = 0
    console.time("test")
    for (let roundNum = 0; roundNum <= 10090; roundNum++) {
        const equation = genMath()
        
        console.log(equation)
        const genMathStart = performance.now()
        await evaluate(equation).catch(err=>err)
        const genMathEnd = performance.now()
        genTime = genTime + (genMathEnd-genMathStart)
    }
    console.log(`avg time per round: ${genTime/10090} ms`)
    console.timeEnd("test")
}
// console.log(await evaluate("(-1+10)+1"))
// console.log(await evaluate("1-1"))
// console.log(await evaluate("1*1"))
// console.log(await evaluate("1/1"))
// console.log(await evaluate("sqrt(10)"))
// console.log(await evaluate("sqrt(10)+sqrt(10)"))
// console.log(await evaluate(".5+.5"))
// console.log(await evaluate("10%3"))
// console.log(await evaluate("2^2").catch(err=>{}))
// console.log(await evaluate("(3+4)*5-6"))
// console.log(await evaluate(`0`))

// console.log(await evaluate(".5+.6asdfas").catch(err=>err))
// console.log(await evaluate("(1+2").catch(err=>err))

run()

// avg time per round: 0.06208410784159118 ms
// test: 1.355s

// avg time per round: 0.029415139086300838 ms
// test: 715.898ms

// avg time per round: 0.02631251642220202 ms
// test: 634.241ms

// avg time per round: 0.02539793137457255 ms
// test: 633.443ms

// avg time per round: 0.023618258968571604 ms
// test: 603.638ms