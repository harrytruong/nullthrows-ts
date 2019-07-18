import { expect } from 'chai';
import idx from 'idx';
import nullthrowsObjectMap from '../nullthrowsObjectMap';

describe('nullthrowsObjectMap', () => {
  describe('throws', () => {
    it('for null', () => {
      expect(() =>
        // prettier-ignore
        nullthrowsObjectMap(
          null as ({ foo: string | null } | null),
          (obj) => ({
            foo: obj.foo, // non-nullable
          })),
      ).to.throw('Found unexpected "null"');
    });
    it('for undefined', () => {
      expect(() =>
        // prettier-ignore
        nullthrowsObjectMap(
          undefined as ({ foo: string | null } | null | undefined),
          (obj) => ({
            foo: obj.foo,  // non-nullable
          }),
        ),
      ).to.throw('Found unexpected "undefined"');
    });
    it('detailed error for "null" property', () => {
      expect(() =>
        // prettier-ignore
        nullthrowsObjectMap(
          { foo: null },
          (obj) => ({
            foo: obj.foo,  // non-nullable
          }),
        ),
      ).to.throw('Found unexpected "null" for property: "foo"');
    });
    it('detailed error for "undefined" property', () => {
      expect(() =>
        // prettier-ignore
        nullthrowsObjectMap(
          { bar: undefined },
          (obj) => ({
            bar: obj.bar,  // non-nullable
          })),
      ).to.throw('Found unexpected "undefined" for property: "bar"');
    });
    it('custom error message', () => {
      const message = 'Error parsing asdfjkl';
      expect(() =>
        // prettier-ignore
        nullthrowsObjectMap(
          null as ({ foo: string | null } | null),
          (obj) => ({
            foo: obj.foo,  // non-nullable
          }),
          message,
        ),
      ).to.throw(message);
    });
    it('detailed error with custom message', () => {
      const message = 'Error parsing asdfjkl';
      expect(() =>
        // prettier-ignore
        nullthrowsObjectMap(
          { foo: true, bar: null },
          (obj) => ({
            foo: obj.foo, // non-nullable
            bar: obj.bar, // non-nullable
          }),
          message,
        ),
      ).to.throw('Error parsing asdfjkl (Found unexpected "null" for property: "bar")');
    });
  });
  describe('does not throw', () => {
    it('for {} (empty object)', () => {
      expect(() => {
        const emptyObject: {} | null | undefined = {};
        // prettier-ignore
        const returnValue: {} = nullthrowsObjectMap(
          emptyObject,
          (_obj) => ({ /* new empty object */ }),
        );
        expect(returnValue).to.not.equal(emptyObject); // NOT identity
        expect(returnValue).to.deep.equal(emptyObject);
      }).to.not.throw();
    });
    it('for `false` property', () => {
      expect(() => {
        const falseProp: { foo: boolean | null | undefined } | null | undefined = { foo: false };
        // prettier-ignore
        const returnValue: {foo: boolean} = nullthrowsObjectMap(
          falseProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(falseProp); // NOT identity
        expect(returnValue).to.deep.equal(falseProp);
      }).to.not.throw();
    });
    it('for `0` property', () => {
      expect(() => {
        const zeroProp: { foo: number | null | undefined } | null | undefined = { foo: 0 };
        // prettier-ignore
        const returnValue: {foo: number} = nullthrowsObjectMap(
          zeroProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(zeroProp); // NOT identity
        expect(returnValue).to.deep.equal(zeroProp);
      }).to.not.throw();
    });
    it('for "" (empty string) property', () => {
      expect(() => {
        const emptyStringProp: { foo: string | null | undefined } | null | undefined = { foo: '' };
        // prettier-ignore
        const returnValue: {foo: string} = nullthrowsObjectMap(
          emptyStringProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(emptyStringProp); // NOT identity
        expect(returnValue).to.deep.equal(emptyStringProp);
      }).to.not.throw();
    });
    it('for `{}` (empty object) property', () => {
      expect(() => {
        const emptyObjectProp: { foo: {} | null | undefined } | null | undefined = { foo: {} };
        // prettier-ignore
        const returnValue: {foo: {}} = nullthrowsObjectMap(
          emptyObjectProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(emptyObjectProp); // NOT identity
        expect(returnValue).to.deep.equal(emptyObjectProp);
      }).to.not.throw();
    });
    it('for nested object property', () => {
      expect(() => {
        const nestedObjectProp:
          | { foo: { bar: number | null | undefined } | null | undefined }
          | null
          | undefined = { foo: { bar: null } };
        // prettier-ignore
        const returnValue: {foo: {bar: number|  null | undefined}} = nullthrowsObjectMap(
          nestedObjectProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(nestedObjectProp); // NOT identity
        expect(returnValue).to.deep.equal(nestedObjectProp);
      }).to.not.throw();
    });
    it('for `[]` (empty array) property', () => {
      expect(() => {
        const emptyArrayProp: { foo: unknown[] | null | undefined } | null | undefined = {
          foo: [],
        };
        // prettier-ignore
        const returnValue: {foo: unknown[]} = nullthrowsObjectMap(
          emptyArrayProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(emptyArrayProp); // NOT identity
        expect(returnValue).to.deep.equal(emptyArrayProp);
      }).to.not.throw();
    });
    it('for `NaN` property', () => {
      expect(() => {
        const nanProp: { foo: number | null | undefined } | null | undefined = { foo: NaN };
        // prettier-ignore
        const returnValue: {foo: number} = nullthrowsObjectMap(
          nanProp,
          (obj) => ({ foo: obj.foo }),
        );
        expect(returnValue).to.not.equal(nanProp); // NOT identity
        expect(returnValue).to.deep.equal(nanProp);
      }).to.not.throw();
    });
    it('for valid picked + renamed non-nullable properties', () => {
      expect(() => {
        const object:
          | {
              foo: boolean | null | undefined;
              bar: number | null | undefined;
              baz: string | null | undefined;
            }
          | null
          | undefined = { foo: true, bar: 123, baz: null };
        // prettier-ignore
        const returnValue: { foozy: boolean; barzy: number} = nullthrowsObjectMap(
          object,
          (obj) => ({
            foozy: obj.foo, // renamed, non-nullable
            barzy: obj.bar, // renamed, non-nullable
            // baz not picked
          }),
        );
        expect(returnValue).to.not.equal(object); // NOT identity
        expect(returnValue).to.deep.equal({
          foozy: object.foo,
          barzy: object.bar,
        });
      }).to.not.throw();
    });
  });
  describe('given object with optional properties types ("?:")', () => {
    it('transform into typing inferred from `mapFn` output', () => {
      expect(() => {
        const optionalProp:
          | {
              // n.b. "foo" property is typed as optional
              foo?: number;
            }
          | null
          | undefined = { foo: 123 };

        // prettier-ignore
        const returnValue: {
          foo: number; // n.b. returned property is no longer optional
         } = nullthrowsObjectMap(
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
        // const returnValue: { foo?: number } = nullthrowsObjectMap(...)
      }).to.not.throw();
    });
  });
  describe('when used in combination with `idx` utility', () => {
    it('maintains correct typing', () => {
      expect(() => {
        const object:
          | {
              nested:
                | {
                    foo: number | null | undefined;
                    bar: number | null | undefined;
                    baz: number | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined = { nested: { foo: 123, bar: 456, baz: 789 } };

        const returnValue: {
          foo: number;
          bar: number;
          baz: number;
        } = nullthrowsObjectMap(
          // prettier-ignore
          idx(object, (_) => _.nested),
          // n.b., explicitly asserting `obj` typing here is non-null/undefined
          (obj: NonNullable<(typeof object)['nested']>) => ({
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
