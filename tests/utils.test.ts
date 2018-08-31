// \d{2}$
import 'mocha';
import {expect} from 'chai';

describe('digits padding function', () => {
    it('should pad digits with zeros', function () {
        const expected = '0042';
        // @ts-ignore
        let actual = '42'.padStart(4, '0');
        console.log(actual);
        expect(actual).to.equal(expected)
    });
});