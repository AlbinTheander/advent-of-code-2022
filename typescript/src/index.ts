import { readdirSync, readFileSync } from "fs";

main()

async function main() {
    const requestedDay = process.argv[2];
    let dayFiles = readdirSync('./src/days', 'utf-8')
        .filter(file => file.startsWith('day'))
        .sort();
    
    if (requestedDay) {
        const data = process.argv[3];
        runOneDay(requestedDay, data);
    } else {
        for (const dayFile of dayFiles) {
            await runOneDay(dayFile);
        }
    }

}

async function runOneDay(day: string, data?: string) {
    const fileName = day.length === 1 ? `day0${day}.ts` :
                     day.length === 2 ? `day${day}.ts`  :
                     day;
    const name = fileName.split('.')[0];
    const module = await import(`./days/${fileName}`);

    const dataFile = data || `../data/${name}.txt`;
    const rawData = readFileSync(dataFile, 'utf-8');

    const start = Date.now()
    console.log('\n=====', prettyName(name), '=====');
    module[name](rawData);
    const time = Date.now() - start
    console.log(`(${time}ms)`)
}

function prettyName(name: string): string {
    const num = +name.replace(/day0?/, '');
    return 'Day ' + num + (num < 10 ? ' ': '');
}