/**
 * This is the base module of the package.
 *
 * It contains type aliases and generic parsers
 * (not bound to a particular token type).
 *
 * Node:
 * ```ts
 * import * as p from 'peberminta';
 * ```
 *
 * Deno:
 * ```ts
 * import * as p from 'https://deno.land/x/peberminta@.../core.ts';
 * ```
 *
 * @module
 */

import { clamp, escapeWhitespace } from './util.ts';

/**
 * Data that is passed around between composed {@link Parser}s.
 *
 * Intended to be static, although nothing prevents you from
 * accumulating data inside options object if parsed grammar allows to do so.
 *
 * @category Type aliases
 */
export type Data<TToken,TOptions> = {
  /** Tokens array - the subject of parsing. */
  tokens: TToken[],
  /** Parser options object. */
  options: TOptions
};

/**
 * Matched (successful) result from a {@link Parser}/{@link Matcher}.
 *
 * @category Type aliases
 */
export type Match<TValue> = {
  matched: true,
  /** Parser position after this match. */
  position: number,
  /** Matched value. */
  value: TValue
};

/**
 * Unsuccessful result from a {@link Parser}.
 *
 * @category Type aliases
 */
export type NonMatch = {
  matched: false
};

/**
 * Result from a {@link Parser}.
 *
 * @category Type aliases
 */
export type Result<TValue> = Match<TValue> | NonMatch;

/**
 * Parser function.
 * Accepts {@link Data} and token position, returns a {@link Result}.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 *
 * @category Type aliases
 */
export type Parser<TToken,TOptions,TValue> =
  (data: Data<TToken,TOptions>, i: number) => Result<TValue>;

/**
 * Special case of {@link Parser} function.
 * Accepts {@link Data} and token position, always returns a {@link Match}.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 *
 * @category Type aliases
 */
export type Matcher<TToken,TOptions,TValue> =
  (data: Data<TToken,TOptions>, i: number) => Match<TValue>;


//------------------------------------------------------------


/**
 * Make a {@link Matcher} that always succeeds with provided value and doesn't consume input.
 *
 * Use {@link make} if you want to make a value dynamically.
 *
 * @param value - The value that is always returned.
 */
export function emit<TToken,TOptions,TValue> (
  value: TValue
): Matcher<TToken,TOptions,TValue> {
  return (data, i) => ({
    matched: true,
    position: i,
    value: value
  });
}

export { emit as of };

/**
 * Make a {@link Matcher} that always succeeds
 * and makes a value with provided function without consuming input.
 *
 * Use {@link emit} if you want to emit the same value every time.
 *
 * Use {@link action} if you only need a side effect.
 *
 * Use {@link token} if you want to make a value based on an input token.
 *
 * @param f - A function to get the value.
 */
export function make<TToken,TOptions,TValue> (
  /**
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array.
   */
  f: (data: Data<TToken,TOptions>, i: number) => TValue
): Matcher<TToken,TOptions,TValue> {
  return (data, i) => ({
    matched: true,
    position: i,
    value: f(data, i)
  });
}

/**
 * Make a {@link Matcher} that always succeeds with `null` value,
 * and performs an action / side effect without consuming input.
 *
 * Use {@link emit} or {@link make} if you want to produce a result.
 *
 * Use {@link peek} if you want to wrap another parser.
 *
 * @param f - A function to produce a side effect (logging, etc).
 */
export function action<TToken,TOptions> (
  /**
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array.
   */
  f: (data: Data<TToken,TOptions>, i: number) => void
): Matcher<TToken,TOptions,null> {
  return (data, i) => {
    f(data, i);
    return {
      matched: true,
      position: i,
      value: null
    };
  };
}

/**
 * Parser that never matches.
 *
 * Use this as a part of normal flow, when alternative match might still exist.
 *
 * Use {@link error} to interrupt the parsing from unrecoverable situation.
 */
export function fail<TToken,TOptions> (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: Data<TToken,TOptions>, i: number
): NonMatch {
  return { matched: false };
}

/**
 * Make a {@link Matcher} that throws an error if reached.
 *
 * Use with caution!
 *
 * Use {@link fail} if parser can step back and try a different path.
 *
 * For error recovery you can try to encode erroneous state in an output value instead.
 *
 * @param message - The message or a function to construct it from the current parser state.
 */
export function error<TToken,TOptions> (
  message: string | ((data: Data<TToken,TOptions>, i: number) => string)
): Matcher<TToken,TOptions,never> {
  return (data, i) => {
    throw new Error((message instanceof Function) ? message(data, i) : message);
  };
}

/**
 * Make a parser based on a token-to-value function.
 *
 * Nonmatch is produced if `undefined` value is returned by a function.
 *
 * Use {@link make} if you want to produce a value without consuming a token.
 *
 * You can use {@link satisfy} if you just want to test but not transform the value.
 *
 * @param onToken - Function that either transforms a token to a result value
 * or returns `undefined`.
 *
 * @param onEnd - Optional function to be called if there are no tokens left.
 * It can be used to throw an error when required token is missing.
 */
export function token<TToken,TOptions,TValue> (
  /**
   * @param token - A token at the parser position.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (points at the same token).
   */
  onToken: (token: TToken, data: Data<TToken,TOptions>, i: number) => TValue | undefined,
  /**
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (naturally points after the end of array).
   */
  onEnd?: (data: Data<TToken,TOptions>, i: number) => void
): Parser<TToken,TOptions,TValue> {
  return (data, i) => {
    let position = i;
    let value: TValue | undefined = undefined;
    if (i < data.tokens.length) {
      value = onToken(data.tokens[i], data, i);
      if (value !== undefined) { position++; }
    } else {
      onEnd?.(data, i);
    }
    return (value === undefined)
      ? { matched: false }
      : {
        matched: true,
        position: position,
        value: value
      };
  };
}

/**
 * Parser that matches any token value, consumes and returns it.
 *
 * Only fails when there are no more tokens.
 *
 * Use {@link token} instead if you intend to immediately transform the value.
 *
 * Use {@link satisfy} if there is a test condition but no transformation.
 */
export function any<TToken,TOptions> (
  data: Data<TToken,TOptions>, i: number
): Result<TToken> {
  return (i < data.tokens.length)
    ? {
      matched: true,
      position: i + 1,
      value: data.tokens[i]
    }
    : { matched: false };
}

/**
 * Make a parser that tests a token with a given predicate and returns it.
 *
 * Use {@link token} instead if you want to transform the value.
 *
 * @param test - A test condition/predicate.
 */
export function satisfy<TToken,TOptions> (
  /**
   * @param token - A token at the parser position.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (points at the same token).
   */
  test: (token: TToken, data: Data<TToken,TOptions>, i: number) => boolean
): Parser<TToken,TOptions,TToken> {
  return (data, i) => (i < data.tokens.length && test(data.tokens[i], data, i))
    ? {
      matched: true,
      position: i + 1,
      value: data.tokens[i]
    }
    : { matched: false };
}

function mapInner<TValue1,TValue2> (
  r: Result<TValue1>,
  f: (v: TValue1, j: number) => TValue2
): Result<TValue2> {
  return (r.matched) ? ({
    matched: true,
    position: r.position,
    value: f(r.value, r.position)
  }) : r;
}

function mapOuter<TValue1,TValue2> (
  r: Result<TValue1>,
  f: (m: Match<TValue1>) => Result<TValue2>
): Result<TValue2> {
  return (r.matched) ? f(r) : r;
}

/**
 * This overload makes a new {@link Matcher} that
 * transforms the matched value from a given Matcher.
 *
 * Use {@link map1} if some matched values can't be mapped.
 *
 * @param p - A base matcher.
 * @param mapper - A function that modifies the matched value.
 */
export function map<TToken,TOptions,TValue1,TValue2> (
  p: Matcher<TToken,TOptions,TValue1>,
  /**
   * @param v - A value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  mapper: (v: TValue1, data: Data<TToken,TOptions>, i: number, j: number) => TValue2
): Matcher<TToken,TOptions,TValue2>;
/**
 * Make a new parser that transforms the matched value from a given parser.
 *
 * Use {@link map1} if some matched values can't be mapped.
 *
 * @param p - A base parser.
 * @param mapper - A function that modifies the matched value.
 */
export function map<TToken,TOptions,TValue1,TValue2> (
  p: Parser<TToken,TOptions,TValue1>,
  /**
   * @param v - A value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  mapper: (v: TValue1, data: Data<TToken,TOptions>, i: number, j: number) => TValue2
): Parser<TToken,TOptions,TValue2>;
export function map<TToken,TOptions,TValue1,TValue2> (
  p: Parser<TToken,TOptions,TValue1>,
  mapper: (v: TValue1, data: Data<TToken,TOptions>, i: number, j: number) => TValue2
): Parser<TToken,TOptions,TValue2> {
  return (data, i) => mapInner(p(data, i), (v, j) => mapper(v, data, i, j));
}

/**
 * Make a new parser that transforms the match from a given parser.
 *
 * This version can discard a {@link Match} - return a {@link NonMatch} instead.
 *
 * Note: pay attention to the return type and indices.
 *
 * Use {@link map} if mapping exists for all matched values.
 *
 * @param p - A base parser.
 * @param mapper - A function that modifies the match.
 */
export function map1<TToken,TOptions,TValue1,TValue2> (
  p: Parser<TToken,TOptions,TValue1>,
  /**
   * @param m - A {@link Match} object from the base parser (contains the value and the position after the match).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @returns A transformed {@link Result} object - either {@link Match} or {@link NonMatch}.
   */
  mapper: (m: Match<TValue1>, data: Data<TToken,TOptions>, i: number) => Result<TValue2>
): Parser<TToken,TOptions,TValue2> {
  return (data, i) => mapOuter(p(data, i), (m) => mapper(m, data, i));
}

/**
 * Add a side effect to a parser without changing it's result.
 *
 * Use {@link action} if there is nothing to wrap and you need a non-consuming parser instead.
 *
 * @param p - A parser.
 * @param f - A function to produce a side effect (logging, etc).
 */
export function peek<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>,
  /**
   * @param r - A {@link Result} object after running the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   */
  f: (r: Result<TValue>, data: Data<TToken,TOptions>, i: number) => void
): Parser<TToken,TOptions,TValue> {
  return (data, i) => {
    const r = p(data, i);
    f(r, data, i);
    return r;
  };
}

/**
 * Make a {@link Matcher} that returns either a match from a given parser
 * or a match with the default value (without consuming input in that case).
 *
 * Use {@link otherwise} if you want to provide a {@link Matcher}
 * instead of a constant default value.
 *
 * @param p - A parser.
 * @param def - Default value to be returned in case parser didn't match.
 */
export function option<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>,
  def: TValue
): Matcher<TToken,TOptions,TValue> {
  return (data, i) => {
    const r = p(data, i);
    return (r.matched)
      ? r
      : {
        matched: true,
        position: i,
        value: def
      };
  };
}

/**
 * Make a parser that returns a Match without consuming input
 * in case the inner parser didn't match
 * and a NonMatch in case the inner parser matched.
 *
 * @param p - A parser.
 * @param value - A value to be returned in case parser didn't match.
 */
export function not<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,true> {
  return (data, i) => {
    const r = p(data, i);
    return (r.matched)
      ? { matched: false }
      : {
        matched: true,
        position: i,
        value: true
      };
  };
}

/**
 * Make a parser that tries multiple parsers at the same position
 * and returns the first successful match
 * or a nonmatch if there was none.
 *
 * Combine with {@link otherwise} if you want to return a {@link Matcher}.
 *
 * @param ps - Parsers to try.
 */
export function choice<TToken,TOptions,TValue> (
  ...ps: Parser<TToken,TOptions,TValue>[]
): Parser<TToken,TOptions,TValue> {
  return (data, i): Result<TValue> => {
    for (const p of ps) {
      const result = p(data, i);
      if (result.matched) {
        return result;
      }
    }
    return { matched: false };
  };
}

export { choice as or };

/**
 * Make a {@link Matcher} from a parser and a matcher.
 * If the parser matched - return the match,
 * otherwise return the match from the matcher.
 *
 * Can be used to keep the matcher type when you have multiple parsing options
 * and the last one always matches.
 *
 * Combine with {@link choice} if you need multiple alternative parsers.
 *
 * Use {@link option} if you just want a constant alternative value
 * without consuming input.
 *
 * @param p - A parser.
 * @param m - A matcher that is only called if the parser didn't match.
 */
export function otherwise<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>,
  m: Matcher<TToken,TOptions,TValue>
): Matcher<TToken,TOptions,TValue> {
  return (data, i) => {
    const r1 = p(data, i);
    return (r1.matched)
      ? r1
      : m(data,i);
  };
}

/**
 * Make a parser that tries all provided parsers at the same position
 * and returns the longest successful match
 * or a nonmatch if there was none.
 *
 * If there are multiple matches of the same maximum length
 * then the first one of them is returned.
 *
 * Use {@link choice} to take the first match.
 *
 * @param ps - Parsers to try.
 */
export function longest<TToken,TOptions,TValue> (
  ...ps: Parser<TToken,TOptions,TValue>[]
): Parser<TToken,TOptions,TValue> {
  return (data, i): Result<TValue> => {
    let match: Match<TValue> | undefined = undefined;
    for (const p of ps) {
      const result = p(data, i);
      if (result.matched && (!match || match.position < result.position)) {
        match = result;
      }
    }
    return match || { matched: false };
  };
}

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the same given parser *while* the test function
 * equates to `true`.
 *
 * Use {@link many} if there is no stop condition.
 *
 * Use {@link takeWhileP} if the stop condition is expressed as a parser.
 *
 * @param p - A parser.
 * @param test - Matched results are accumulated *while* the result of this function is `true`.
 */
export function takeWhile<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>,
  /**
   * @param value - Current value matched by the parser.
   * @param n - Number of matches so far (including the current value).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the current value matched).
   * @param j - Parser position in the tokens array (after the current value matched).
   */
  test: (value: TValue, n: number, data: Data<TToken,TOptions>, i: number, j: number) => boolean
): Matcher<TToken,TOptions,TValue[]> {
  return (data, i): Match<TValue[]> => {
    const values: TValue[] = [];
    let success = true;
    do {
      const r = p(data, i);
      if (r.matched && test(r.value, values.length+1, data, i, r.position)) {
        values.push(r.value);
        i = r.position;
      } else {
        success = false;
      }
    } while (success);
    return {
      matched: true,
      position: i,
      value: values
    };
  };
}

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the same given parser *while* the test function
 * equates to `false` (that is *until* it equates to `true` for the first time).
 *
 * Use {@link many} if there is no stop condition.
 *
 * Use {@link takeUntilP} if the stop condition is expressed as a parser.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param p - A parser.
 * @param test - Matched results are accumulated *until* the result of this function is `true`.
 */
export function takeUntil<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>,
  /**
   * @param value - Current value matched by the parser.
   * @param n - Number of matches so far (including the current value).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the current value matched).
   * @param j - Parser position in the tokens array (after the current value matched).
   */
  test: (value: TValue, n: number, data: Data<TToken,TOptions>, i: number, j: number) => boolean
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(p, (value, n, data, i, j) => !test(value, n, data, i, j));
}

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the first parser *while* the second parser also matches.
 *
 * Use {@link takeWhile} if the stop condition is based on the parsed value.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param pValue - A parser that produces result values.
 * @param pTest - A parser that serves as a stop condition.
 */
export function takeWhileP<TToken,TOptions,TValue> (
  pValue: Parser<TToken,TOptions,TValue>,
  pTest: Parser<TToken,TOptions,unknown>
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(pValue, (value, n, data, i) => pTest(data, i).matched);
}

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the first parser *while* the second parser does not match
 * (that is *until* the second parser matches).
 *
 * Use {@link takeUntil} if the stop condition is based on the parsed value.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param pValue - A parser that produces result values.
 * @param pTest - A parser that serves as a stop condition.
 */
export function takeUntilP<TToken,TOptions,TValue> (
  pValue: Parser<TToken,TOptions,TValue>,
  pTest: Parser<TToken,TOptions,unknown>
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(pValue, (value, n, data, i) => !pTest(data, i).matched);
}

/**
 * Make a {@link Matcher} that returns all (0 or more) sequential matches of the same given parser.
 *
 * A match with empty array is produced if no single match was found.
 *
 * Use {@link many1} if at least one match is required.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param p - A parser to apply repeatedly.
 */
export function many<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(p, () => true);
}

/**
 * Make a parser that returns all (1 or more) sequential matches of the same parser.
 *
 * A nonmatch is returned if no single match was found.
 *
 * Use {@link many} in case zero matches are allowed.
 *
 * Implementation is based on {@link ab} and {@link many}.
 *
 * @param p - A parser to apply repeatedly.
 */
export function many1<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,[TValue,...TValue[]]> {
  return ab(p, many(p), (head, tail) => [head, ...tail]);
}

export { many1 as some };

/**
 * Make a parser that tries two parsers one after another and joins the results.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Use {@link abc} if you want to join 3 different parsers.
 *
 * Use {@link left} or {@link right} if you want to keep one result and discard another.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 *
 * @param pa - First parser.
 * @param pb - Second parser.
 * @param join - A function to combine matched results from both parsers.
 */
export function ab<TToken,TOptions,TValueA,TValueB,TValue> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>,
  /**
   * @param va - A value matched by the first parser.
   * @param vb - A value matched by the second parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before both parsers matched).
   * @param j - Parser position in the tokens array (after both parsers matched).
   */
  join: (va: TValueA, vb: TValueB, data: Data<TToken,TOptions>, i: number, j: number) => TValue
): Parser<TToken,TOptions,TValue> {
  return (data, i) => mapOuter(
    pa(data, i),
    (ma) => mapInner(
      pb(data, ma.position),
      (vb, j) => join(ma.value, vb, data, i, j)
    )
  );
}

/**
 * Make a parser that tries two parsers one after another
 * and returns the result from the first one if both matched.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First parser (result is returned).
 * @param pb - Second parser (result is discarded).
 */
export function left<TToken,TOptions,TValueA,TValueB> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>
): Parser<TToken,TOptions,TValueA> {
  return ab(pa, pb, (va) => va);
}

/**
 * Make a parser that tries two parsers one after another
 * and returns the result from the second one if both matched.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First parser (result is discarded).
 * @param pb - Second parser (result is returned).
 */
export function right<TToken,TOptions,TValueA,TValueB> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>
): Parser<TToken,TOptions,TValueB> {
  return ab(pa, pb, (va, vb) => vb);
}

/**
 * Make a parser that tries three parsers one after another and joins the results.
 *
 * A nonmatch is returned if any of three parsers did not match.
 *
 * Use {@link ab} if you want to join just 2 different parsers.
 *
 * Use {@link middle} if you want to keep only the middle result and discard two others.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 *
 * @param pa - First parser.
 * @param pb - Second parser.
 * @param pc - Third parser.
 * @param join - A function to combine matched results from all three parsers.
 */
export function abc<TToken,TOptions,TValueA,TValueB,TValueC,TValue> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>,
  pc: Parser<TToken,TOptions,TValueC>,
  /**
   * @param va - A value matched by the first parser.
   * @param vb - A value matched by the second parser.
   * @param vc - A value matched by the third parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before all three parsers matched).
   * @param j - Parser position in the tokens array (after all three parsers matched).
   */
  join: (va: TValueA, vb: TValueB, vc: TValueC, data: Data<TToken,TOptions>, i: number, j: number) => TValue
): Parser<TToken,TOptions,TValue> {
  return (data, i) => mapOuter(
    pa(data, i),
    (ma) => mapOuter(
      pb(data, ma.position),
      (mb) => mapInner(
        pc(data, mb.position),
        (vc, j) => join(ma.value, mb.value, vc, data, i, j)
      )
    )
  );
}

/**
 * Make a parser that tries three parsers one after another
 * and returns the middle result if all three matched.
 *
 * A nonmatch is returned if any of three parsers did not match.
 *
 * Implementation is based on {@link abc}.
 *
 * @param pa - First parser (result is discarded).
 * @param pb - Second parser (result is returned).
 * @param pc - Third parser (result is discarded).
 */
export function middle<TToken,TOptions,TValueA,TValueB,TValueC> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>,
  pc: Parser<TToken,TOptions,TValueC>
): Parser<TToken,TOptions,TValueB> {
  return abc(
    pa,
    pb,
    pc,
    (ra, rb) => rb
  );
}

/**
 * Make a parser that runs all given parsers one after another
 * and returns all results in an array.
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * Use {@link ab} or {@link abc} if you need a limited number of parsers of different types.
 *
 * @param ps - Parsers to run sequentially.
 */
export function all<TToken,TOptions,TValue> (
  ...ps: Parser<TToken,TOptions,TValue>[]
): Parser<TToken,TOptions,TValue[]> {
  return (data, i) => {
    const result: TValue[] = [];
    let position = i;
    for (const p of ps) {
      const r1 = p(data, position);
      if (r1.matched) {
        result.push(r1.value);
        position = r1.position;
      } else {
        return { matched: false };
      }
    }
    return {
      matched: true,
      position: position,
      value: result
    };
  };
}

export { all as and };

/**
 * Make a parser that runs all given parsers in sequence
 * and discards (skips) all results (Returns a match with a single `null` value).
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * Implementation is based on {@link all} and {@link map}.
 *
 * This function only exists to make the intent clear.
 * Use in combination with {@link left}, {@link right} or other combinators
 * to make the `null` result disappear.
 *
 * @param ps - Parsers to run sequentially.
 */
export function skip<TToken,TOptions> (
  ...ps: Parser<TToken,TOptions,unknown>[]
): Parser<TToken,TOptions,unknown> {
  return map(all(...ps), () => null);
}

export { skip as discard };

/**
 * This overload makes a {@link Matcher} that concatenates values
 * from all provided Matchers into a single array while flattening value arrays.
 *
 * Implementation is based on {@link all} and {@link flatten1}.
 *
 * @param ps - Matchers sequence.
 * Each parser can return a match with a value or an array of values.
 */
export function flatten<TToken,TOptions,TValue> (
  ...ps: Matcher<TToken,TOptions,TValue|TValue[]>[]
): Matcher<TToken,TOptions,TValue[]>;
/**
 * Make a parser that concatenates values from all provided parsers
 * into a single array while flattening value arrays.
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * Implementation is based on {@link all} and {@link flatten1}.
 *
 * @param ps - Parsers sequence.
 * Each parser can return a match with a value or an array of values.
 */
export function flatten<TToken,TOptions,TValue> (
  ...ps: Parser<TToken,TOptions,TValue|TValue[]>[]
): Parser<TToken,TOptions,TValue[]>;
export function flatten<TToken,TOptions,TValue> (
  ...ps: Parser<TToken,TOptions,TValue|TValue[]>[]
): Parser<TToken,TOptions,TValue[]> {
  return flatten1(all(...ps));
}

/**
 * This overload makes a {@link Matcher} that flattens an array
 * of values or value arrays returned by a given Matcher.
 *
 * Implementation is based on {@link map}.
 *
 * @param p - A matcher.
 */
export function flatten1<TToken,TOptions,TValue> (
  p: Matcher<TToken,TOptions,(TValue|TValue[])[]>
): Matcher<TToken,TOptions,TValue[]>;
/**
 * Make a parser that flattens an array of values or value arrays
 * returned by a given parser.
 *
 * Implementation is based on {@link map}.
 *
 * @param p - A parser.
 */
export function flatten1<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,(TValue|TValue[])[]>
): Parser<TToken,TOptions,TValue[]>;
export function flatten1<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,(TValue|TValue[])[]>
): Parser<TToken,TOptions,TValue[]> {
  return map(
    p,
    (vs) => vs.flatMap((v) => v)
  );
}

/**
 * Make a parser that matches 1 or more values interleaved with separators.
 *
 * A nonmatch is returned if no single value was matched.
 *
 * Implementation is based on {@link ab}, {@link many} and {@link right}.
 *
 * @param pValue - A parser for values.
 * @param pSep - A parser for separators.
 */
export function sepBy1<TToken,TOptions,TValue,TSep> (
  pValue: Parser<TToken,TOptions,TValue>,
  pSep: Parser<TToken,TOptions,TSep>
): Parser<TToken,TOptions,[TValue,...TValue[]]> {
  return ab(
    pValue,
    many(right(pSep, pValue)),
    (head, tail) => [head, ...tail]
  );
}

/**
 * Make a {@link Matcher} that matches 0 or more values interleaved with separators.
 *
 * A match with an empty array is returned if no single value was matched.
 *
 * Implementation is based on {@link sepBy1}, {@link otherwise} and {@link emit}.
 *
 * @param pValue - A parser for values.
 * @param pSep - A parser for separators.
 */
export function sepBy<TToken,TOptions,TValue,TSep> (
  pValue: Parser<TToken,TOptions,TValue>,
  pSep: Parser<TToken,TOptions,TSep>
): Matcher<TToken,TOptions,TValue[]> {
  return otherwise(
    sepBy1(pValue, pSep),
    emit([] as TValue[])
  );
}

/**
 * Make a {@link Matcher} that takes 0 or more matches from parsers
 * returned by provided parser-generating function.
 *
 * This is like a combination of {@link chain} and {@link reduceLeft}.
 * Each next parser is made based on previously accumulated value,
 * parsing continues from left to right until first nonmatch.
 *
 * @param acc - Initial value for the accumulator.
 * @param f - A function that returns a parser based on previously accumulated value.
 */
export function chainReduce<TToken,TOptions,TAcc> (
  acc: TAcc,
  /**
   * @param acc - Accumulated value.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before each parser called).
   */
  f: (acc: TAcc, data: Data<TToken, TOptions>, i: number) => Parser<TToken, TOptions, TAcc>
): Matcher<TToken,TOptions,TAcc> {
  return (data, i) => {
    let loop = true;
    let acc1 = acc;
    let pos = i;
    do {
      const r = f(acc1, data, pos)(data, pos);
      if (r.matched) {
        acc1 = r.value;
        pos = r.position;
      } else {
        loop = false;
      }
    } while (loop);
    return {
      matched: true,
      position: pos,
      value: acc1
    };
  };
}

/**
 * Make a {@link Matcher} that takes 0 or more matches from the same parser
 * and reduces them into one value in left-to-right (first-to-last) order.
 *
 * Note: accumulator is the left (first) argument.
 *
 * Use {@link leftAssoc1} if you have an initial value to be parsed first.
 *
 * Implementation is based on {@link chainReduce} and {@link map}.
 *
 * @param acc - Initial value for the accumulator.
 * @param p - Parser for each next value.
 * @param reducer - Function to combine the accumulator and each parsed value.
 */
export function reduceLeft<TToken,TOptions,TAcc,TValue> (
  acc: TAcc,
  p: Parser<TToken,TOptions,TValue>,
  /**
   * @param acc - Accumulated value.
   * @param v - Value from each successful parsing.
   * @param data - Data object (tokens and options).
   * @param i - Position before current match.
   * @param j - Position after current match.
   */
  reducer: (acc: TAcc, v: TValue, data: Data<TToken,TOptions>, i: number, j: number) => TAcc
): Matcher<TToken,TOptions,TAcc> {
  return chainReduce(
    acc,
    (acc) => map(p, (v, data, i, j) => reducer(acc, v, data, i, j))
  );
}

/**
 * Make a {@link Matcher} that takes 0 or more matches from the same parser
 * and reduces them into one value in right-to-left (last-to-first) order.
 *
 * Note: accumulator is the right (second) argument.
 *
 * Use {@link rightAssoc1} if you have an initial value to be parsed after all matches.
 *
 * Implementation is based on {@link many} and {@link map}.
 *
 * @param p - Parser for each next value.
 * @param acc - Initial value for the accumulator.
 * @param reducer - Function to combine the accumulator and each parsed value.
 */
export function reduceRight<TToken,TOptions,TValue,TAcc> (
  p: Parser<TToken,TOptions,TValue>,
  acc: TAcc,
  /**
   * @param v - Value from each successful parsing.
   * @param acc - Accumulated value.
   * @param data - Data object (tokens and options).
   * @param i - Position before all successful parsings.
   * @param j - Position after all successful parsings.
   */
  reducer: (v: TValue, acc: TAcc, data: Data<TToken,TOptions>, i: number, j: number) => TAcc
): Matcher<TToken,TOptions,TAcc> {
  return map(
    many(p),
    (vs, data, i, j) => vs.reduceRight(
      (acc, v) => reducer(v, acc, data, i, j),
      acc
    )
  );
}

/**
 * Make a parser that parses one value and any number of following values
 * to combine with the first one in left-to-right (first-to-last) order.
 *
 * Use {@link leftAssoc2} if the grammar has an explicit operator between values.
 *
 * Implementation is based on {@link chain} and {@link reduceLeft}.
 *
 * @param pLeft - A parser for the first value,
 * also defines the result type (accumulator).
 *
 * @param pOper - A parser for each consecutive value.
 * Result type is a transformation operation for the accumulator.
 */
export function leftAssoc1<TToken,TOptions,TLeft> (
  pLeft: Parser<TToken,TOptions,TLeft>,
  pOper: Parser<TToken,TOptions,(x: TLeft) => TLeft>
): Parser<TToken,TOptions,TLeft> {
  return chain(
    pLeft,
    (v0) => reduceLeft(
      v0,
      pOper,
      (acc,f) => f(acc)
    )
  );
}

/**
 * Make a parser that parses any number of values and then one extra value
 * to combine in right-to-left (last-to-first) order.
 *
 * Note: This can fail if `pOper` and `pRight` can consume same tokens.
 * You'll have to make an {@link ahead} guard to prevent it from consuming the last token.
 *
 * Use {@link rightAssoc2} if the grammar has an explicit operator between values.
 *
 * Implementation is based on {@link ab} and {@link reduceRight}.
 *
 * @param pOper - A parser for each consecutive value.
 * Result type is a transformation operation for the accumulator.
 *
 * @param pRight - A parser for the last value,
 * also defines the result type (accumulator).
 */
export function rightAssoc1<TToken,TOptions,TRight> (
  pOper: Parser<TToken,TOptions,(y: TRight) => TRight>,
  pRight: Parser<TToken,TOptions,TRight>
): Parser<TToken,TOptions,TRight> {
  return ab(
    reduceRight(
      pOper,
      (y: TRight) => y,
      (f,acc) => (y) => f(acc(y))
    ),
    pRight,
    (f,v) => f(v)
  );
}

/**
 * Make a parser that parses one value and any number of following operators and values
 * to combine with the first one in left-to-right (first-to-last) order.
 *
 * Use {@link leftAssoc1} if the grammar doesn't have an explicit operator between values.
 *
 * Implementation is based on {@link chain}, {@link reduceLeft} and {@link ab}.
 *
 * @param pLeft - A parser for the first value,
 * also defines the result type (accumulator).
 *
 * @param pOper - A parser for an operator function.
 *
 * @param pRight - A parser for each consecutive value.
 */
export function leftAssoc2<TToken,TOptions,TLeft,TRight> (
  pLeft: Parser<TToken,TOptions,TLeft>,
  pOper: Parser<TToken,TOptions,(x: TLeft, y: TRight) => TLeft>,
  pRight: Parser<TToken,TOptions,TRight>
): Parser<TToken,TOptions,TLeft> {
  return chain(
    pLeft,
    (v0) => reduceLeft(
      v0,
      ab(
        pOper,
        pRight,
        (f,y) => [f,y] as [(x: TLeft, y: TRight) => TLeft, TRight]
      ),
      (acc,[f,y]) => f(acc, y)
    )
  );
}

/**
 * Make a parser that parses any number of values and operators, then one extra value
 * to combine in right-to-left (last-to-first) order.
 *
 * Use {@link rightAssoc1} if the grammar doesn't have an explicit operator between values.
 *
 * Implementation is based on {@link ab} and {@link reduceRight}.
 *
 * @param pLeft - A parser for each consecutive value.
 *
 * @param pOper - A parser for an operator function.
 *
 * @param pRight - A parser for the last value,
 * also defines the result type (accumulator).
 */
export function rightAssoc2<TToken,TOptions,TLeft,TRight> (
  pLeft: Parser<TToken,TOptions,TLeft>,
  pOper: Parser<TToken,TOptions,(x: TLeft, y: TRight) => TRight>,
  pRight: Parser<TToken,TOptions,TRight>
): Parser<TToken,TOptions,TRight> {
  return ab(
    reduceRight(
      ab(
        pLeft,
        pOper,
        (x,f) => [x,f] as [TLeft, (x: TLeft, y: TRight) => TRight]
      ),
      (y: TRight) => y,
      ([x,f],acc) => (y) => f(x, acc(y))
    ),
    pRight,
    (f,v) => f(v)
  );
}

/**
 * Make a parser that chooses between two given parsers based on a condition.
 * This makes possible to allow/disallow a grammar based on context/options.
 *
 * {@link decide} and {@link chain} allow for more complex dynamic rules.
 *
 * @param cond - Condition.
 * @param pTrue - Parser to run when the condition is true.
 * @param pFalse - Parser to run when the condition is false.
 */
export function condition<TToken,TOptions,TValue> (
  /**
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before parsing).
   */
  cond: (data: Data<TToken,TOptions>, i: number) => boolean,
  pTrue: Parser<TToken,TOptions,TValue>,
  pFalse: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue> {
  return (data, i) => (cond(data, i))
    ? pTrue(data, i)
    : pFalse(data, i);
}

/**
 * Make a parser that runs a given parser and then a dynamically returned parser.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Compared to {@link condition} this can have any complex logic inside.
 *
 * {@link chain} allows to reuse the first parser.
 *
 * @param p - A parser that returns another parser as a value.
 * If it consumes the input then the returned parser will be called with the new position.
 */
export function decide<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,Parser<TToken,TOptions,TValue>>
): Parser<TToken,TOptions,TValue> {
  return (data, i) => mapOuter(
    p(data, i),
    (m1) => m1.value(data, m1.position)
  );
}

/**
 * Make a parser that runs a given parser,
 * passes the matched value into a parser-generating function
 * and then runs the returned parser.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Similar to {@link decide} in that it allows for complex logic.
 *
 * Use {@link condition} if there is no dependency on the value of the first parser.
 *
 * Combine with {@link chainReduce} to get a stack-safe chain of arbitrary length.
 *
 * @param p - A parser.
 * @param f - A function that returns a parser based on the input value.
 */
export function chain<TToken,TOptions,TValue1,TValue2> (
  p: Parser<TToken,TOptions,TValue1>,
  /**
   * @param v1 - A value from the first parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  f: (v1: TValue1, data: Data<TToken,TOptions>, i: number, j: number) => Parser<TToken,TOptions,TValue2>
): Parser<TToken,TOptions,TValue2> {
  return (data, i) => mapOuter(
    p(data, i),
    (m1) => f(m1.value, data, i, m1.position)(data, m1.position)
  );
}

/**
 * This overload makes a {@link Matcher} that acts like a given one
 * but doesn't consume input.
 *
 * @param p - A matcher.
 */
export function ahead<TToken,TOptions,TValue> (
  p: Matcher<TToken,TOptions,TValue>
): Matcher<TToken,TOptions,TValue>;
/**
 * Make a parser that acts like a given one but doesn't consume input.
 *
 * @param p - A parser.
 */
export function ahead<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue>;
export function ahead<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue> {
  return (data, i) => mapOuter(
    p(data, i),
    (m1) => ({
      matched: true,
      position: i,
      value: m1.value
    })
  );
}

export { ahead as lookAhead };

/**
 * A wrapper that helps to create recursive parsers -
 * allows to refer to a parser defined later in the code.
 *
 * Alternatively, parsers defined/wrapped as functions
 * (rather than constants obtained by composition)
 * don't need this.
 *
 * This overload is for {@link Matcher}s.
 *
 * @param f - A function that returns a matcher.
 * @returns A parser wrapped into a function.
 */
export function recursive<TToken,TOptions,TValue> (
  f: () => Matcher<TToken,TOptions,TValue>
): Matcher<TToken,TOptions,TValue>;
/**
 * A wrapper that helps to create recursive parsers -
 * allows to refer to a parser defined later in the code.
 *
 * Alternatively, parsers defined/wrapped as functions
 * (rather than constants obtained by composition)
 * don't need this.
 *
 * @param f - A function that returns a parser.
 * @returns A parser wrapped into a function.
 */
export function recursive<TToken,TOptions,TValue> (
  f: () => Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue>;
export function recursive<TToken,TOptions,TValue> (
  f: () => Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue> {
  return function (data, i) {
    return f()(data, i);
  };
}

/**
 * Parser that matches only at the beginning and doesn't consume input.
 */
export function start<TToken,TOptions> (
  data: Data<TToken,TOptions>, i: number
): Result<true> {
  return (i !== 0)
    ? { matched: false }
    : {
      matched: true,
      position: i,
      value: true
    };
}

/**
 * Parser that matches only at the end of input.
 */
export function end<TToken,TOptions> (
  data: Data<TToken,TOptions>, i: number
): Result<true> {
  return (i < data.tokens.length)
    ? { matched: false }
    : {
      matched: true,
      position: i,
      value: true
    };
}

export { end as eof };


//------------------------------------------------------------


/**
 * Utility function returning the number of tokens
 * that are not yet parsed (current token included).
 *
 * Useful when creating custom base parsers.
 *
 * Note: Can return a negative value if the supplied position
 * goes beyond the tokens array length for whatever reason.
 *
 * @param data - Data.
 * @param i - Current position.
 *
 * @category Utility functions
 */
export function remainingTokensNumber<TToken> (
  data: Data<TToken,unknown>, i: number
): number {
  return data.tokens.length - i;
}

/**
 * Utility function to render a given parser position
 * for error reporting and debug purposes.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 * @param formatToken - A function to stringify a token.
 * @param contextTokens - How many tokens around the current one to render.
 * @returns A multiline string.
 *
 * @category Utility functions
 */
export function parserPosition<TToken> (
  data: Data<TToken,unknown>,
  i: number,
  formatToken: (t: TToken) => string,
  contextTokens = 3
): string {
  const len = data.tokens.length;
  const lowIndex = clamp(0, i - contextTokens, len - contextTokens);
  const highIndex = clamp(contextTokens, i + 1 + contextTokens, len);
  const tokensSlice = data.tokens.slice(lowIndex, highIndex);
  const lines: string[] = [];
  const indexWidth = String(highIndex - 1).length + 1;
  if (i < 0) {
    lines.push(`${String(i).padStart(indexWidth)} >>`);
  }
  if (0 < lowIndex) {
    lines.push('...'.padStart(indexWidth + 6));
  }
  for (let j = 0; j < tokensSlice.length; j++) {
    const index = lowIndex + j;
    lines.push(`${
      String(index).padStart(indexWidth)
    } ${
      (index === i ? '>' : ' ')
    } ${
      escapeWhitespace(formatToken(tokensSlice[j]))
    }`);
  }
  if (highIndex < len) {
    lines.push('...'.padStart(indexWidth + 6));
  }
  if (len <= i) {
    lines.push(`${String(i).padStart(indexWidth)} >>`);
  }
  return lines.join('\n');
}

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 *
 * This one throws an error in case parser didn't match
 * OR the match is incomplete (some part of tokens array left unparsed).
 *
 * @param parser - A parser to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @param formatToken - A function to stringify a token
 * (Defaults to `JSON.stringify`. For incomplete match error message).
 *
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function parse<TToken,TOptions,TValue> (
  parser: Parser<TToken,TOptions,TValue>,
  tokens: TToken[],
  options: TOptions,
  formatToken: (t: TToken) => string = JSON.stringify
): TValue {
  const data: Data<TToken,TOptions> = { tokens: tokens, options: options };
  const result = parser(data, 0);
  if (!result.matched) {
    throw new Error('No match');
  }
  if (result.position < data.tokens.length) {
    throw new Error(
      `Partial match. Parsing stopped at:\n${parserPosition(data, result.position, formatToken)}`
    );
  }
  return result.value;
}

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 * Returns `undefined` in case parser did not match.
 *
 * Note: this doesn't capture errors thrown during parsing.
 * Nonmatch is considered a part or normal flow.
 * Errors mean unrecoverable state and it's up to client code to decide
 * where to throw errors and how to get back to safe state.
 *
 * @param parser - A parser to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @returns A matched value or `undefined` in case of nonmatch.
 *
 * @category Utility functions
 */
export function tryParse<TToken,TOptions,TValue> (
  parser: Parser<TToken,TOptions,TValue>,
  tokens: TToken[],
  options: TOptions
): TValue | undefined {
  const result = parser({ tokens: tokens, options: options }, 0);
  return (result.matched)
    ? result.value
    : undefined;
}

/**
 * Utility function that provides a bit cleaner interface for running a {@link Matcher}.
 *
 * @param matcher - A matcher to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function match<TToken,TOptions,TValue> (
  matcher: Matcher<TToken,TOptions,TValue>,
  tokens: TToken[],
  options: TOptions
): TValue {
  const result = matcher({ tokens: tokens, options: options }, 0);
  return result.value;
}
