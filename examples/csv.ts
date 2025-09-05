
// https://datatracker.ietf.org/doc/html/rfc4180
// https://www.w3.org/TR/tabular-data-model/

// This example is actually overcomplicated so it can parse
// tabular data separated by different characters.


import { inspect } from 'util';
import * as p from '../src/core.ts';
import * as pc from '../src/char.ts';


// Types

type Options = {
  fieldSeparator: string;
  whitespaces: string;
  headerRow: boolean;
  trimUnquotedFields: boolean;
};

type Csv = {
  header?: string[];
  records: string[][];
};


// Build up the CSV parser from smaller, simpler parsers

const whitespace_: p.Parser<string, Options, string> = p.satisfy(
  (c, data) => data.options.whitespaces.includes(c),
);

const optionalWhitespaces_ = p.many(whitespace_);

function possiblyCaptureWhitespace (
  p1: p.Parser<string, Options, string>,
) {
  return p.condition(
    data => data.options.trimUnquotedFields,
    pc.concat(
      optionalWhitespaces_,
      p1,
      optionalWhitespaces_,
    ),
    p1,
  );
}

const linebreak_ = possiblyCaptureWhitespace(
  pc.concat(
    p.option(pc.char('\r'), ''),
    pc.char('\n'),
  ),
);

const sep_ = possiblyCaptureWhitespace(
  p.satisfy(
    (c, data) => c === data.options.fieldSeparator,
  ),
);

const qchar_ = p.or(
  p.map(
    pc.str('""'),
    () => '"' as const,
  ),
  pc.noneOf('"'),
);

const qstr_ = p.middle(
  p.right(optionalWhitespaces_, pc.char('"')),
  pc.concat(p.many(qchar_)),
  p.left(pc.char('"'), optionalWhitespaces_),
);

const schar_: p.Parser<string, Options, string> = p.satisfy(
  (c, data) => !'"\r\n'.includes(c) && c != data.options.fieldSeparator,
);

const sstr_ = pc.concat(p.takeUntilP(
  schar_,
  p.or(sep_, linebreak_),
));

const field_ = p.or(qstr_, sstr_);

const record_ = p.sepBy(field_, sep_);

const csv_: p.Parser<string, Options, Csv> = p.condition(
  data => data.options.headerRow,
  p.map(
    p.sepBy1(record_, linebreak_),
    rs => ({ header: rs[0], records: rs.slice(1) }),
  ),
  p.map(
    p.sepBy(record_, linebreak_),
    rs => ({ records: rs }),
  ),
);


// Complete parser

function parseCsv (str: string, options: Options): Csv {
  return pc.parse(csv_, str, options);
}


// Usage

const sampleCsv = `
foo, bar   , baz  
111, 222222, 33333
",",       ,   \t 
 \\,   ""  ," "" "
`.trim();

console.log('Commas, with header, trim spaces:');
console.log(inspect(parseCsv(sampleCsv, {
  fieldSeparator: ',',
  whitespaces: ' \t',
  headerRow: true,
  trimUnquotedFields: true,
})));

console.log('Commas, no header, keep spaces:');
console.log(inspect(parseCsv(sampleCsv, {
  fieldSeparator: ',',
  whitespaces: ' \t',
  headerRow: false,
  trimUnquotedFields: false,
})));

const sampleTsv = `
foo\t bar   \t baz  
111\t 222222\t 33333
","\t       \t  \\t 
 \\\t   ""  \t" "" "
`.trim();

console.log('Tabs, header, keep spaces:');
console.log(inspect(parseCsv(sampleTsv, {
  fieldSeparator: '\t',
  whitespaces: ' ',
  headerRow: true,
  trimUnquotedFields: false,
})));


// Output

// Commas, with header, trim spaces:
// {
//   header: [ 'foo', 'bar', 'baz' ],
//   records: [
//     [ '111', '222222', '33333' ],
//     [ ',', '', '' ],
//     [ '\\', '', ' " ' ]
//   ]
// }
// Commas, no header, keep spaces:
// {
//   records: [
//     [ 'foo', ' bar   ', ' baz  ' ],
//     [ '111', ' 222222', ' 33333' ],
//     [ ',', '       ', '   \t ' ],
//     [ ' \\', '', ' " ' ]
//   ]
// }
// Tabs, header, keep spaces:
// {
//   header: [ 'foo', ' bar   ', ' baz  ' ],
//   records: [
//     [ '111', ' 222222', ' 33333' ],
//     [ ',', '       ', '  \\t ' ],
//     [ ' \\', '', ' " ' ]
//   ]
// }
