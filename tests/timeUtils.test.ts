import 'mocha';
import {expect} from 'chai';
import {formatTime} from "../src/utils/TimeUtils";

describe('Thumbs calculating function', () => {
    it('should return format 60 seconds to 00:01:00', () => {
        let expected = '00:01:00';
        let actual = formatTime(60);
        console.log(actual);
        expect(actual).to.equal(expected);
    });
    it('should return format 122 seconds to 00:02:02', () => {
        let expected = '00:02:02';
        let actual = formatTime(122);
        console.log(actual);
        expect(actual).to.equal(expected);
    });
    it('should return format 7200 seconds to 02:00:00', () => {
        let expected = '02:00:00';
        let actual = formatTime(7200);
        console.log(actual);
        expect(actual).to.equal(expected);
    });
    it('should return format 10745 seconds to 02:59:05', () => {
        let expected = '02:59:05';
        let actual = formatTime(10745);
        console.log(actual);
        expect(actual).to.equal(expected);
    });
});