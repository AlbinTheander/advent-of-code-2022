export function day01(data: string) {
    const elves = data.
        split('\n\n').
        map(elfData => elfData.split('\n').map(Number).reduce((a, b) => a + b)).
        sort((a, b) => b - a)

    const result1 = elves[0];
    const result2 = elves[0] + elves[1] + elves[2];

    console.log('The elf with the most calories is bringing', result1);
    console.log('The top three elves are bringing', result2);
}