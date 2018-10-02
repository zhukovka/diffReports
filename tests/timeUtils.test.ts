import 'mocha';
import {expect} from 'chai';
import {formatTime} from "../src/utils/TimeUtils";
import TapeTimecode from "bigfootjs/dist/TapeTimecode";
import {TimecodeDiffRange} from "bigfootjs/dist/TimecodeRange";
import {MatchType} from "bigfootjs/dist/DiffRange";

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

describe('TapeTimecode tests', () => {
    let video1 = {
        "id" : "PIXELOGIC_FRIENDS_YR05_98_99_ONE_WHERE_EVERYBODY_FINDS_OUT_THE_16x9_E0286124_EPISODE_2_0_LTRT_9079831.mp4",
        "filename" : "PIXELOGIC_FRIENDS_YR05_98_99_ONE_WHERE_EVERYBODY_FINDS_OUT_THE_16x9_E0286124_EPISODE_2_0_LTRT_9079831.mp4",
        "status" : "uploaded",
        "chunksUploaded" : 266,
        "chunksTotal" : 266,
        "framesTotal" : 31873,
        "timescale" : 24000,
        "frameDuration" : 1001,
        "startTimecode" : 0,
        "timecodeRate" : 24,
        "isDropFrame" : false,
        "needsFPSChange" : false,
        "isIndexed" : true,
        "width" : 1920,
        "height" : 1080,
    };
    let video2 = {
        "id" : "PIXELOGIC_FRIENDS_YR10_03_04_ONE_AFTER_JOEY_AND_RACHEL_KISS_THE_16x9_E0286336_EPISODE_STEREO_9079832.mp4",
        "filename" : "PIXELOGIC_FRIENDS_YR10_03_04_ONE_AFTER_JOEY_AND_RACHEL_KISS_THE_16x9_E0286336_EPISODE_STEREO_9079832.mp4",
        "status" : "uploaded",
        "chunksUploaded" : 351,
        "chunksTotal" : 351,
        "framesTotal" : 42069,
        "timescale" : 24000,
        "frameDuration" : 1001,
        "startTimecode" : 0,
        "timecodeRate" : 24,
        "isDropFrame" : false,
        "needsFPSChange" : false,
        "uiVideoUrl" : "/api/1/storage/PIXELOGIC_FRIENDS_YR10_03_04_ONE_AFTER_JOEY_AND_RACHEL_KISS_THE_16x9_E0286336_EPISODE_STEREO_9079832.mp4/dash/file.mpd",
        "isIndexed" : true,
        "width" : 1920,
        "height" : 1080,
    };
    let ranges = [
        {"r1" : {"frame" : 0, "length" : 0}, "r2" : {"frame" : 0, "length" : 2181}, "matchType" : MatchType.ADDED},
        {"r1" : {"frame" : 0, "length" : 140}, "r2" : {"frame" : 2182, "length" : 140}, "matchType" : MatchType.MATCH},
        {
            "r1" : {"frame" : 1030, "length" : 597},
            "r2" : {"frame" : 3214, "length" : 1564},
            "matchType" : MatchType.CHANGED
        },
        {
            "r1" : {"frame" : 1648, "length" : 432},
            "r2" : {"frame" : 4778, "length" : 0},
            "matchType" : MatchType.REMOVED
        },
        {
            "r1" : {"frame" : 1627, "length" : 21},
            "r2" : {"frame" : 4778, "length" : 0},
            "movedTo" : {"frame" : 14801, "length" : 21},
            "matchType" : MatchType.MOVED_FROM
        }
    ];
    it('should get timecode from diffrange', function () {
        let range = {
            "r1" : {"frame" : 0, "length" : 25},
            "r2" : {"frame" : 0, "length" : 25},
            "matchType" : MatchType.MATCH
        };
        let tc1 = new TapeTimecode(video1.isDropFrame, video1.startTimecode, video1.timecodeRate);
        let tc2 = new TapeTimecode(video2.isDropFrame, video2.startTimecode, video2.timecodeRate);
        let tcRange: TimecodeDiffRange = TimecodeDiffRange.toTimecode(range as any, tc1, tc2);
        console.log(tcRange.r1);
        console.log(tcRange.r2);
        expect(tcRange.r1.start).to.equal('00:00:00.00');
        expect(tcRange.r1.end).to.equal('00:00:01.00');
    });
});