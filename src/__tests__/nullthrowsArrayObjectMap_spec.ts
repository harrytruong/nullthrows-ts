import { expect } from 'chai';
import idx from 'idx';
import nullthrowsArrayObjectMap from '../nullthrowsArrayObjectMap';

describe('nullthrowsArrayObjectMap', () => {
  describe('throws', () => {
    it('for null', () => {
      expect(() =>
        // prettier-ignore
        nullthrowsArrayObjectMap(
          null as (Array<{ foo: string | null | undefined } | null | undefined> | null | undefined),
          (obj) => ({
            foo: obj.foo, // non-nullable
          })),
      ).to.throw('Found unexpected "null"');
    });
    it('for undefined', () => {
      expect(() =>
        nullthrowsArrayObjectMap(
          undefined as (
            | Array<{ foo: string | null | undefined } | null | undefined>
            | null
            | undefined),
          (obj) => ({
            foo: obj.foo, // non-nullable
          }),
        ),
      ).to.throw('Found unexpected "undefined"');
    });
    it('detailed error for "null" array element', () => {
      expect(() =>
        nullthrowsArrayObjectMap(
          [{ foo: 123 }, null] as (
            | Array<{ foo: number | null | undefined } | null | undefined>
            | null
            | undefined),
          (obj) => ({
            foo: obj.foo, // non-nullable
          }),
        ),
      ).to.throw('Found unexpected "null" for array index: "1"');
    });
    it('detailed error for "undefined" array element', () => {
      expect(() =>
        nullthrowsArrayObjectMap(
          [{ foo: 123 }, { foo: 456 }, undefined, { foo: 789 }] as (
            | Array<{ foo: number | null | undefined } | null | undefined>
            | null
            | undefined),
          (obj) => ({
            foo: obj.foo, // non-nullable
          }),
        ),
      ).to.throw('Found unexpected "undefined" for array index: "2"');
    });
    it('detailed error for "null" property', () => {
      expect(() =>
        nullthrowsArrayObjectMap(
          [{ foo: null }] as (
            | Array<{ foo: number | null | undefined } | null | undefined>
            | null
            | undefined),
          (obj) => ({
            foo: obj.foo, // non-nullable
          }),
        ),
      ).to.throw('Found unexpected "null" for property: "foo"');
    });
    it('detailed error for "undefined" property', () => {
      expect(() =>
        nullthrowsArrayObjectMap(
          [{ bar: undefined }] as (
            | Array<{ bar: number | null | undefined } | null | undefined>
            | null
            | undefined),
          (obj) => ({
            bar: obj.bar, // non-nullable
          }),
        ),
      ).to.throw('Found unexpected "undefined" for property: "bar"');
    });
    it('custom error message', () => {
      const message = 'Error parsing asdfjkl';
      expect(() =>
        nullthrowsArrayObjectMap(
          null as (Array<{ foo: string | null | undefined } | null | undefined> | null | undefined),
          (obj) => ({
            foo: obj.foo, // non-nullable
          }),
          message,
        ),
      ).to.throw(message);
    });
    it('detailed error with custom message', () => {
      const message = 'Error parsing asdfjkl';
      expect(() =>
        nullthrowsArrayObjectMap(
          [{ foo: true, bar: 123 }, null] as (
            | Array<
                | {
                    foo: boolean | null | undefined;
                    bar: number | null | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined),
          (obj) => ({
            foo: obj.foo, // non-nullable
            bar: obj.bar, // non-nullable
          }),
          message,
        ),
      ).to.throw('Error parsing asdfjkl (Found unexpected "null" for array index: "1")');
    });
  });
  describe('does not throw', () => {
    it('for [] (empty array)', () => {
      expect(() => {
        const arrEmpty: unknown[] | null | undefined = [];
        // prettier-ignore
        const returnValue: unknown[] = nullthrowsArrayObjectMap(
          arrEmpty,
          (_obj) => ({ /* new empty object */ }),
        );
        expect(returnValue).to.not.equal(arrEmpty); // NOT identity
        expect(returnValue).to.deep.equal(arrEmpty);
      }).to.not.throw();
    });
    it('for {} (empty object)', () => {
      expect(() => {
        const arrEmptyObject: Array<{} | null | undefined> | null | undefined = [{}];
        // prettier-ignore
        const returnValue: Array<{}> = nullthrowsArrayObjectMap(
          arrEmptyObject,
          (_obj) => ({ /* new empty object */ }),
        );
        expect(returnValue).to.not.equal(arrEmptyObject); // NOT identity
        expect(returnValue).to.deep.equal(arrEmptyObject);
      }).to.not.throw();
    });
    it('for `false` property', () => {
      expect(() => {
        const arrFalseProp:
          | Array<{ foo: boolean | null | undefined } | null | undefined>
          | null
          | undefined = [{ foo: false }];
        // prettier-ignore
        const returnValue: Array<{foo: boolean}> = nullthrowsArrayObjectMap(
          arrFalseProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(arrFalseProp); // NOT identity
        expect(returnValue).to.deep.equal(arrFalseProp);
      }).to.not.throw();
    });
    it('for `0` property', () => {
      expect(() => {
        const arrZeroProp:
          | Array<{ foo: number | null | undefined } | null | undefined>
          | null
          | undefined = [{ foo: 0 }];
        // prettier-ignore
        const returnValue: Array<{foo: number}> = nullthrowsArrayObjectMap(
          arrZeroProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(arrZeroProp); // NOT identity
        expect(returnValue).to.deep.equal(arrZeroProp);
      }).to.not.throw();
    });
    it('for "" (empty string) property', () => {
      expect(() => {
        const arrEmptyStringProp:
          | Array<{ foo: string | null | undefined } | null | undefined>
          | null
          | undefined = [{ foo: '' }];
        // prettier-ignore
        const returnValue: Array<{foo: string}> = nullthrowsArrayObjectMap(
          arrEmptyStringProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(arrEmptyStringProp); // NOT identity
        expect(returnValue).to.deep.equal(arrEmptyStringProp);
      }).to.not.throw();
    });
    it('for `{}` (empty object) property', () => {
      expect(() => {
        const arrEmptyObjectProp:
          | Array<{ foo: {} | null | undefined } | null | undefined>
          | null
          | undefined = [{ foo: {} }];
        // prettier-ignore
        const returnValue: Array<{foo: {}}> = nullthrowsArrayObjectMap(
          arrEmptyObjectProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(arrEmptyObjectProp); // NOT identity
        expect(returnValue).to.deep.equal(arrEmptyObjectProp);
      }).to.not.throw();
    });
    it('for nested object property', () => {
      expect(() => {
        const arrNestedObjectProp:
          | Array<{ foo: { bar: number | null | undefined } | null | undefined } | null | undefined>
          | null
          | undefined = [{ foo: { bar: null } }];
        // prettier-ignore
        const returnValue: Array<{foo: {bar: number | null | undefined}}> = nullthrowsArrayObjectMap(
          arrNestedObjectProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(arrNestedObjectProp); // NOT identity
        expect(returnValue).to.deep.equal(arrNestedObjectProp);
      }).to.not.throw();
    });
    it('for `[]` (empty array) property', () => {
      expect(() => {
        const arrEmptyArrayProp:
          | Array<{ foo: unknown[] | null | undefined } | null | undefined>
          | null
          | undefined = [{ foo: [] }];
        // prettier-ignore
        const returnValue: Array<{foo: unknown[]}> = nullthrowsArrayObjectMap(
          arrEmptyArrayProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(arrEmptyArrayProp); // NOT identity
        expect(returnValue).to.deep.equal(arrEmptyArrayProp);
      }).to.not.throw();
    });
    it('for `NaN` property', () => {
      expect(() => {
        const arrNanProp:
          | Array<{ foo: number | null | undefined } | null | undefined>
          | null
          | undefined = [{ foo: NaN }];
        // prettier-ignore
        const returnValue: Array<{foo: number}> = nullthrowsArrayObjectMap(
          arrNanProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(arrNanProp); // NOT identity
        expect(returnValue).to.deep.equal(arrNanProp);
      }).to.not.throw();
    });
    it('for valid picked + renamed non-nullable properties', () => {
      expect(() => {
        const arrObject:
          | Array<
              | {
                  foo: boolean | null | undefined;
                  bar: number | null | undefined;
                  baz: string | null | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined = [{ foo: true, bar: 123, baz: null }];
        // prettier-ignore
        const returnValue: Array<{
          foozy: boolean;
          barzy: number;
        }> = nullthrowsArrayObjectMap(
          arrObject,
          (obj) => ({
            foozy: obj.foo, // renamed, non-nullable
            barzy: obj.bar, // renamed, non-nullable
            // baz not picked
          }),
        );
        expect(returnValue).to.not.equal(arrObject); // NOT identity
        expect(returnValue).to.deep.equal([
          {
            foozy: (arrObject[0] as NonNullable<typeof arrObject[0]>).foo,
            barzy: (arrObject[0] as NonNullable<typeof arrObject[0]>).bar,
          },
        ]);
      }).to.not.throw();
    });
  });
  describe('given array element object with optional properties types ("?:")', () => {
    it('transform into typing inferred from `mapFn` output', () => {
      expect(() => {
        const optionalProp:
          | Array<
              | {
                  // n.b. "foo" property is typed as optional
                  foo?: number;
                }
              | null
              | undefined
            >
          | null
          | undefined = [{ foo: 123 }];

        // prettier-ignore
        const returnValue: Array<{
          foo: number; // n.b. returned property is no longer optional
        }> = nullthrowsArrayObjectMap(
          optionalProp,
          (obj) => ({
            foo: obj.foo,
          }),
        );

        expect(returnValue).to.not.equal(optionalProp); // NOT identity
        expect(returnValue).to.deep.equal(optionalProp);

        // NOTE: it's still possible to maintain optional property typing,
        // simply by declaring `returnValue` with the optional property, e.g.,
        //
        // const returnValue: Array<{ foo?: number }> = nullthrowsArrayObjectMap(...)
      }).to.not.throw();
    });
  });
  describe('given ReadonlyArray<> type', () => {
    it('returns Array<> type instead', () => {
      expect(() => {
        // prettier-ignore
        const readonlyArray:
          // n.b. array is typed as ReadonlyArray<>
          | ReadonlyArray<
              | { foo: number | null | undefined }
              | null
              | undefined
            >
          | null
          | undefined = [{ foo: 123 }];

        // prettier-ignore
        const returnValue:
          // n.b. returned array is no longer readonly
          Array<{ foo: number }> = nullthrowsArrayObjectMap(
          readonlyArray,
          (obj) => ({
            foo: obj.foo,
          }),
        );

        expect(returnValue).to.not.equal(readonlyArray); // NOT identity
        expect(returnValue).to.deep.equal(readonlyArray);

        // NOTE: it's still possible to maintain ReadonlyArray<> typing,
        // simply by declaring `returnValue` as readonly, e.g.,
        //
        // const returnValue: ReadonlyArray<{ foo: number }> = nullthrowsArrayObjectMap(...)
      }).to.not.throw();
    });
  });
  describe('when used in combination with `idx` utility', () => {
    it('maintains correct typing', () => {
      expect(() => {
        const object:
          | {
              nested:
                | Array<
                    | {
                        foo: number | null | undefined;
                        bar: number | null | undefined;
                        baz: number | null | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined = { nested: [{ foo: 123, bar: 456, baz: 789 }] };

        const returnValue: Array<{
          foo: number;
          bar: number;
          baz: number;
        }> = nullthrowsArrayObjectMap(
          // prettier-ignore
          idx(object, (_) => _.nested),
          // n.b., explicitly asserting `obj` typing here is non-null/undefined
          (obj) => ({
            foo: obj.foo,
            bar: obj.bar,
            baz: obj.baz,
          }),
        );

        expect(returnValue).to.not.equal(idx(object, (_) => _.nested)); // NOT identity
        expect(returnValue).to.deep.equal(idx(object, (_) => _.nested));
      }).to.not.throw();
    });
  });
});
