
// Break a numbers array into non-decreasing fragments
// (i.e. arrays where `x[i+1] >= x[i]`).

import * as p from '../src/core';


// Build up the parser from smaller, simpler parts

const number_: p.Parser<number,unknown,number> = p.any;

// Cutting corners here by using the fact `p.map` exposes indices before and after a match.
// If everything were hidden it would've required to rely on accumulator instead.
const nonDecSequence_ = p.map(
  p.chain(
    number_,
    (v1) => p.chainReduce(
      v1,
      (maxValue) => p.satisfy((t) => t >= maxValue)
    )
  ),
  (v, data, i, j) => data.tokens.slice(i, j)
);

const nonDecSequences_ = p.many(nonDecSequence_);


// Complete parser

function breakApart (xs: number[]): number[][] {
  return p.parse(nonDecSequences_, xs, undefined);
}


// Sample data

// Pseudo-random number generator to get the same random array.
const nextInt = (function () {
  // LCG using GCC's constants
  const m = 0x80000000; // 2**31;
  const a = 1103515245;
  const c = 12345;
  let state = 1;
  return function () {
    state = (a * state + c) % m;
    return state;
  };
})();

const randomArray = Array.from({length: 1_000_000}, () => nextInt());

const increasingArray = Array.from({length: 1_000_000}, (e,i) => i);

const arrayWithRepetitions = [1, 1, 2, 2, 3, 3, 4, 5, -6, 5, 4, 3, 3, 2, 7, 8, 8, 9];


// Usage

const orderedResult = breakApart(increasingArray);
console.log(`\`increasingArray\` is broken into ${orderedResult.length} part(s).`);
console.log(`First part is of length ${orderedResult[0].length}.`);
console.log('');

const repetitiveResult = breakApart(arrayWithRepetitions);
console.log(`\`arrayWithRepetitions\` is broken into ${repetitiveResult.length} part(s).`);
console.log('Parts:');
repetitiveResult.forEach((xs) => {
  console.log(
    '[ ' + xs.join(', ') + ' ]'
  );
});
console.log('');

const pseudorandomResult = breakApart(randomArray);
console.log(`\`randomArray\` is broken into ${pseudorandomResult.length} part(s).`);
console.log('First 16 parts:');
pseudorandomResult.slice(0, 16).forEach((xs) => {
  console.log(
    '[ ' + xs.map((x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '_')).join(', ') + ' ]'
  );
});


// Output

// `increasingArray` is broken into 1 part(s).
// First part is of length 1000000.
//
// `arrayWithRepetitions` is broken into 5 part(s).
// Parts:
// [ 1, 1, 2, 2, 3, 3, 4, 5 ]
// [ -6, 5 ]
// [ 4 ]
// [ 3, 3 ]
// [ 2, 7, 8, 8, 9 ]
//
// `randomArray` is broken into 498177 part(s).
// First 16 parts:
// [ 1_103_527_590 ]
// [ 377_401_600 ]
// [ 333_417_792 ]
// [ 314_102_912, 611_429_056, 1_995_203_584 ]
// [ 18_793_472, 1_909_564_472 ]
// [ 295_447_552, 484_895_808, 600_721_280, 1_704_829_312 ]
// [ 877_851_648, 1_168_774_144, 1_937_945_600 ]
// [ 964_613_120 ]
// [ 395_867_136, 927_044_672, 1_805_111_040 ]
// [ 716_526_336 ]
// [ 545_163_008, 1_291_954_944 ]
// [ 231_735_040, 2_067_907_392 ]
// [ 1_207_816_704, 1_762_564_608 ]
// [ 1_243_857_408 ]
// [ 39_176_704, 1_578_316_344, 1_992_925_696 ]
// [ 1_328_949_760 ]
