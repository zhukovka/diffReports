import 'mocha';
import {expect} from 'chai';
import {quadraticSum} from "../src/utils/MathUtils";

describe('Math functions', () => {
    it('should calculate sum of squares of natural numbers', function () {
        let sum = quadraticSum(4);
        expect(sum).to.equal(30);
    });

    it('should render 42 source frames on 5 destination frames', function () {
        let dstFrames = 10;
        let srcLength = 10;
        let srcFrame = 0;
        let half = dstFrames / 2;
        let sum = quadraticSum(half);
        let k = srcLength / (sum * 2);
        let srcFrames: any[] = [];
        while (dstFrames >= 0) {
            //(5-x)²+1
            let eq = Math.pow(half - dstFrames, 2);
            let interval = Math.round(eq);
            // console.log(interval);
            if (eq > 0) {
                console.log(dstFrames, "=>", eq, "=>", interval);
                srcFrame += interval;
                srcFrames.push(srcFrame);
            }
            dstFrames--;
        }

        console.log(srcFrames, srcFrames.length);
    });
});