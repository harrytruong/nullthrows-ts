import { expect } from 'chai';
import idx from 'idx';
import nullthrowsObject from '../nullthrowsObject';

describe('nullthrowsObject', () => {
  describe('throws', () => {
    it('for null', () => {
      expect(() => nullthrowsObject(null)).to.throw('Found unexpected "null"');
    });
    it('for undefined', () => {
      expect(() => nullthrowsObject(undefined)).to.throw('Found unexpected "undefined"');
    });
    it('detailed error for "null" property', () => {
      expect(() => nullthrowsObject({ foo: null })).to.throw(
        'Found unexpected "null" for property: "foo"',
      );
    });
    it('detailed error for "undefined" property', () => {
      expect(() => nullthrowsObject({ foo: undefined })).to.throw(
        'Found unexpected "undefined" for property: "foo"',
      );
    });
    it('custom error message', () => {
      const message = 'Error parsing asdfjkl';
      expect(() => nullthrowsObject(null, message)).to.throw(message);
    });
    it('detailed error with custom message', () => {
      const message = 'Error parsing asdfjkl';
      expect(() => nullthrowsObject({ foo: true, bar: null }, message)).to.throw(
        'Error parsing asdfjkl (Found unexpected "null" for property: "bar")',
      );
    });
  });
  describe('does not throw', () => {
    it('for {} (empty object)', () => {
      expect(() => {
        const emptyObject: {} | null | undefined = {};
        const returnValue: {} = nullthrowsObject(emptyObject);
        expect(returnValue).to.equal(emptyObject); // identity
      }).to.not.throw();
    });
    it('for `false` property', () => {
      expect(() => {
        const falseProp: { foo: boolean | null | undefined } | null | undefined = { foo: false };
        const returnValue: { foo: boolean } = nullthrowsObject(falseProp);
        expect(returnValue).to.equal(falseProp); // identity
      }).to.not.throw();
    });
    it('for `0` property', () => {
      expect(() => {
        const zeroProp: { foo: number | null | undefined } | null | undefined = { foo: 0 };
        const returnValue: { foo: number } = nullthrowsObject(zeroProp);
        expect(returnValue).to.equal(zeroProp); // identity
      }).to.not.throw();
    });
    it('for "" (empty string) property', () => {
      expect(() => {
        const emptyStringProp: { foo: string | null | undefined } | null | undefined = { foo: '' };
        const returnValue: { foo: string } = nullthrowsObject(emptyStringProp);
        expect(returnValue).to.equal(emptyStringProp); // identity
      }).to.not.throw();
    });
    it('for `{}` (empty object) property', () => {
      expect(() => {
        const emptyObjectProp: { foo: {} | null | undefined } | null | undefined = { foo: {} };
        const returnValue: { foo: {} } = nullthrowsObject(emptyObjectProp);
        expect(returnValue).to.equal(emptyObjectProp); // identity
      }).to.not.throw();
    });
    it('for nested object property', () => {
      expect(() => {
        const nestedObjectProp:
          | { foo: { bar: number | null | undefined } | null | undefined }
          | null
          | undefined = { foo: { bar: null } };
        const returnValue: { foo: { bar: number | null | undefined } } = nullthrowsObject(
          nestedObjectProp,
        );
        expect(returnValue).to.equal(nestedObjectProp); // identity
      }).to.not.throw();
    });
    it('for `[]` (empty array) property', () => {
      expect(() => {
        const emptyArrayProp: { foo: unknown[] | null | undefined } | null | undefined = {
          foo: [],
        };
        const returnValue: { foo: unknown[] } = nullthrowsObject(emptyArrayProp);
        expect(returnValue).to.equal(emptyArrayProp); // identity
      }).to.not.throw();
    });
    it('for `NaN` property', () => {
      expect(() => {
        const nanProp: { foo: number | null | undefined } | null | undefined = { foo: NaN };
        const returnValue: { foo: number } = nullthrowsObject(nanProp);
        expect(returnValue).to.equal(nanProp); // identity
      }).to.not.throw();
    });
  });
  describe('when given object with optional properties types ("?:")', () => {
    it('maintains optional property types', () => {
      expect(() => {
        const optionalProp:
          | {
              // n.b. "foo" property is typed as optional
              foo?: number;
            }
          | null
          | undefined = { foo: 123 };

        const returnValue: {
          foo?: number; // n.b. returned property must still be optional
        } = nullthrowsObject(optionalProp);

        expect(returnValue).to.equal(optionalProp); // identity

        // @ts-ignore: remove this "@ts-ignore" to reveal type assignment error
        const TS_TYPE_ASSIGNMENT_INCOMPATIBLE_ERROR: { foo: number } = returnValue;
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
        } = nullthrowsObject(idx(object, (_) => _.nested));

        expect(returnValue).to.equal(idx(object, (_) => _.nested)); // identity
      }).to.not.throw();
    });
  });
});
