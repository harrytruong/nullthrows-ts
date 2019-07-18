import { expect } from 'chai';
import nullthrows from '../nullthrows';

describe('nullthrows', () => {
  describe('throws', () => {
    it('for null', () => {
      expect(() => nullthrows(null)).to.throw('Found unexpected "null"');
    });
    it('for undefined', () => {
      expect(() => nullthrows(undefined)).to.throw('Found unexpected "undefined"');
    });
    it('custom error message', () => {
      const message = 'Error parsing asdfjkl';
      expect(() => nullthrows(null, message)).to.throw(message);
    });
  });
  describe('does not throw', () => {
    it('for `false`', () => {
      expect(() => {
        const value: boolean | null | undefined = false;
        const returnValue: boolean = nullthrows(value);
        expect(returnValue).to.equal(value);
      }).to.not.throw();
    });
    it('for `0`', () => {
      expect(() => {
        const value: number | null | undefined = 0;
        const returnValue: number = nullthrows(value);
        expect(returnValue).to.equal(value);
      }).to.not.throw();
    });
    it('for "" (empty string)', () => {
      expect(() => {
        const value: string | null | undefined = '';
        const returnValue: string = nullthrows(value);
        expect(returnValue).to.equal(value);
      }).to.not.throw();
    });
    it('for `{}` (empty object)', () => {
      expect(() => {
        const emptyObject: {} | null | undefined = {};
        const returnValue: {} = nullthrows(emptyObject);
        expect(returnValue).to.equal(emptyObject); // identity
      }).to.not.throw();
    });
    it('for `[]` (empty array)', () => {
      expect(() => {
        const emptyArray: unknown[] | null | undefined = [];
        const returnValue: unknown[] = nullthrows(emptyArray);
        expect(returnValue).to.equal(emptyArray); // identity
      }).to.not.throw();
    });
    it('for `NaN`', () => {
      expect(() => {
        const notNumber: number | null | undefined = NaN;
        const returnValue: number = nullthrows(notNumber);
        expect(Number.isNaN(returnValue)).to.equal(true);
      }).to.not.throw();
    });
  });
});
