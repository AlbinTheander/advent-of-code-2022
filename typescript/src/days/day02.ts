import { sum } from "./utils/utils"

const WIN = 6
const DRAW = 3
const LOSE = 0
const ROCK = 1
const PAPER = 2
const SCISSORS = 3

export function day02(data: string) {
  const matches = data.
    split('\n')
  const result1 = score1(matches);
  const result2 = score2(matches);

  console.log('First result', result1);
  console.log('Second result', result2);
}

function score1(matches: string[]): number {
  return matches.
    map(line => {
      switch(line) {
        case 'A X': return DRAW + ROCK
        case 'A Y': return WIN + PAPER
        case 'A Z': return LOSE + SCISSORS
        case 'B X': return LOSE + ROCK
        case 'B Y': return DRAW + PAPER
        case 'B Z': return WIN + SCISSORS
        case 'C X': return WIN + ROCK
        case 'C Y': return LOSE + PAPER
        case 'C Z': return DRAW + SCISSORS
      }
    }).
    reduce(sum);
}

function score2(matches: string[]): number {
  return matches.map(line => {
    switch(line) {
      case 'A X': return LOSE + SCISSORS
      case 'A Y': return DRAW + ROCK
      case 'A Z': return WIN + PAPER
      case 'B X': return LOSE + ROCK
      case 'B Y': return DRAW + PAPER
      case 'B Z': return WIN + SCISSORS
      case 'C X': return LOSE + PAPER
      case 'C Y': return DRAW + SCISSORS
      case 'C Z': return WIN + ROCK
    }
  }).reduce(sum);
}
