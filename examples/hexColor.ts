
// Parser for hexadecimal color codes - like CSS colors,
// except there are few more options.

import * as p from '../src/core';
import * as pc from '../src/char';


// Options

type FourNumbersFormat = 'rgba' | 'argb' | 'off';
type HashFormat = 'on' | 'off' | 'either';

type Options = {
  allowShortNonation: boolean,
  fourNumbersFormat: FourNumbersFormat,
  hashFormat: HashFormat
};


// Result value types

type Color = {
  r: number,
  g: number,
  b: number
};

type ColorAlpha = Color & { a: number };


// Build up the color parser from smaller, simpler parsers

const hexDigit_ = pc.charTest(/[0-9a-f]/i);

const shortHexNumber_ = p.map(
  hexDigit_,
  (c) => parseInt(c + c, 16)
);

const longHexNumber_ = p.map(
  pc.concat(
    hexDigit_,
    hexDigit_
  ),
  (c) => parseInt(c, 16)
);

function parseColorNumbers(
  parseHexNumber: p.Parser<string,Options,number>
): p.Parser<string,Options,Color> {
  return p.abc(
    parseHexNumber,
    parseHexNumber,
    parseHexNumber,
    (v1, v2, v3) => ({
      r: v1,
      g: v2,
      b: v3
    })
  );
}

function parseColorAlphaNumbers(
  parseHexNumber: p.Parser<string,Options,number>
): p.Parser<string,Options,ColorAlpha> {
  return p.condition(
    (data) => data.options.fourNumbersFormat === 'off',
    p.fail,
    p.condition(
      (data) => data.options.fourNumbersFormat === 'rgba',
      p.ab(
        parseColorNumbers(parseHexNumber),
        parseHexNumber,
        (color, alpha) => ({ ... color, a: alpha })
      ),
      p.ab(
        parseHexNumber,
        parseColorNumbers(parseHexNumber),
        (alpha, color) => ({ ... color, a: alpha })
      ),
    )
  );
}

const hashSign_: p.Parser<string,Options,true> = p.chain(
  p.option(pc.char('#'), ''),
  (v1, data) =>
    (v1 === '' && data.options.hashFormat === 'on') ? p.fail
      : (v1 === '#' && data.options.hashFormat === 'off') ? p.fail
        : p.emit(true)
);

const numberOfHexDigits_ = p.map(
  p.many(hexDigit_),
  (cs) => cs.length
);

const parseColor_ = p.middle(
  hashSign_,
  p.chain(
    p.ahead(numberOfHexDigits_),
    (n, data: p.Data<string,Options>) => {
      switch (n) {
        case 3:
          if (data.options.allowShortNonation) {
            return parseColorNumbers(shortHexNumber_);
          }
          break;
        case 4:
          if (data.options.allowShortNonation) {
            return parseColorAlphaNumbers(shortHexNumber_);
          }
          break;
        case 6:
          return parseColorNumbers(longHexNumber_);
        case 8:
          return parseColorAlphaNumbers(longHexNumber_);
      }
      return p.fail;
    }
  ),
  p.end // You may not need this when combining into bigger grammar.
);


// Usage

const samples = [
  '#00f',
  '#00F0',
  '#ff0000',
  '#ff000000',
  '039',
  '3069',
  '339900',
  '33669900',
  '#aabbc',
  'aabbccdde',
  '#aabbcc#'
];

for (const sample of samples) {
  const maybeColor = pc.tryParse(parseColor_, sample, {
    allowShortNonation: true,
    fourNumbersFormat: 'rgba',
    hashFormat: 'either'
  });
  console.log(
    sample.padStart(12).padEnd(15) +
    (maybeColor ? JSON.stringify(maybeColor) : 'didn\'t match')
  );
}


// Output

//       #00f   {"r":0,"g":0,"b":255}
//      #00F0   {"r":0,"g":0,"b":255,"a":0}
//    #ff0000   {"r":255,"g":0,"b":0}
//  #ff000000   {"r":255,"g":0,"b":0,"a":0}
//        039   {"r":0,"g":51,"b":153}
//       3069   {"r":51,"g":0,"b":102,"a":153}
//     339900   {"r":51,"g":153,"b":0}
//   33669900   {"r":51,"g":102,"b":153,"a":0}
//     #aabbc   didn't match
//  aabbccdde   didn't match
//   #aabbcc#   didn't match
