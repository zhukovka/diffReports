/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./generators/generateTestHTML.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./generators/generateTestHTML.tsx":
/*!*****************************************!*\
  !*** ./generators/generateTestHTML.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst projectUtils_1 = __webpack_require__(/*! ./projectUtils */ \"./generators/projectUtils.ts\");\nconst React = __webpack_require__(/*! react */ \"react\");\nconst server_1 = __webpack_require__(/*! react-dom/server */ \"react-dom/server\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst test_1 = __webpack_require__(/*! ../src/test */ \"./src/test.tsx\");\nconst DiffReportsApi_1 = __webpack_require__(/*! ../src/model/DiffReportsApi */ \"./src/model/DiffReportsApi.ts\");\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\nconst program = __webpack_require__(/*! commander */ \"commander\");\nprogram\n    .option('-p, --projectId <id>', 'Project id')\n    .option('-c, --comparedMov <mov>', 'Compared video id')\n    .parse(process.argv);\nfunction htmlTemplate(title, reactDom, script) {\n    let staticDir = '.';\n    if (true) {\n        staticDir = `/${process.env.BUNDLE_PATH}`;\n    }\n    return `\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset=\"utf-8\">\n            <title>${title}</title>\n            <link rel=\"stylesheet\" href=\"${staticDir}/project.css\">\n        </head>\n\n        <body>\n            <div id=\"app\">${reactDom}</div>\n            <script src=\"${staticDir}/test.bundle.js\"></script>\n            ${script}\n        </body>\n        </html>\n    `;\n}\nexports.htmlTemplate = htmlTemplate;\nfunction writeHTML(html) {\n    let path = `./tests/index.html`;\n    fs.writeFileSync(path, html, 'utf8');\n    return path;\n}\nfunction generateHTML(projectId, comparedMov) {\n    const project = projectUtils_1.readProjectJson(projectId);\n    const sourceMov = project.masterId;\n    const sourceVideo = projectUtils_1.readVideoJson(sourceMov);\n    const comparedVideo = projectUtils_1.readVideoJson(comparedMov);\n    let ranges = projectUtils_1.readRangesJson(projectId, comparedMov);\n    let api = new DiffReportsApi_1.default(projectId);\n    const app = server_1.renderToString(React.createElement(test_1.TestPage, { comparedVideo: comparedVideo, ranges: ranges, sourceVideo: sourceVideo, api: api }));\n    const script = `<script>\n            diffReport(${JSON.stringify(ranges)}, ${JSON.stringify(sourceVideo)}, ${JSON.stringify(comparedVideo)}, \"${projectId}\");\n    </script>`;\n    const html = htmlTemplate(projectId, app, script);\n    return writeHTML(html);\n}\nlet { projectId, comparedMov } = program;\n//    mkdir -p reports/salt_color_trim3k/salt_color_trim3k.mov/stripes/ && cp -r projects/storage/salt_color_trim3k.mov/stripes/square/ \"$_\"\nconsole.log(generateHTML(projectId, comparedMov));\n\n\n//# sourceURL=webpack:///./generators/generateTestHTML.tsx?");

/***/ }),

/***/ "./generators/projectUtils.ts":
/*!************************************!*\
  !*** ./generators/projectUtils.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nfunction readRangesJson(sourceId, comparedMov) {\n    const regex = new RegExp(`^ranges_${comparedMov}.*\\\\.js$`);\n    const rangesFile = fs.readdirSync(`${process.env.MRESTORE_PROJECTS}/${sourceId}`).find(file => {\n        return regex.test(file);\n    });\n    const ranges = fs.readFileSync(`${process.env.MRESTORE_PROJECTS}/${sourceId}/${rangesFile}`, 'utf8');\n    return JSON.parse(ranges);\n}\nexports.readRangesJson = readRangesJson;\nfunction readProjectJson(projectId) {\n    const project = fs.readFileSync(`${process.env.MRESTORE_PROJECTS}/${projectId}/project.js`, 'utf8');\n    return JSON.parse(project);\n}\nexports.readProjectJson = readProjectJson;\nfunction readVideoJson(mov) {\n    const videoJs = fs.readFileSync(`${process.env.PROJECT_STORAGE}/${mov}/video.js`, 'utf8');\n    return JSON.parse(videoJs);\n}\nexports.readVideoJson = readVideoJson;\n\n\n//# sourceURL=webpack:///./generators/projectUtils.ts?");

/***/ }),

/***/ "./src/components/ranges/DiffTimeline.tsx":
/*!************************************************!*\
  !*** ./src/components/ranges/DiffTimeline.tsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"react\");\nconst DiffRange_1 = __webpack_require__(/*! bigfootjs/dist/DiffRange */ \"bigfootjs/dist/DiffRange\");\nconst ThumbsStrip_1 = __webpack_require__(/*! bigfootjs/dist/ThumbsStrip */ \"bigfootjs/dist/ThumbsStrip\");\nconst NAME = \"DiffTimeline\";\nconst FRAME_WIDTH = 120;\nconst FRAME_HEIGHT = 68;\nconst COLS = 10;\nclass DiffTimeline extends React.Component {\n    constructor(props) {\n        super(props);\n        this.setupContainer = (container) => {\n            this.container = container;\n            if (!container || !this.totalFrameCount || !container.clientWidth) {\n                return;\n            }\n            const maxZoom = Math.min(this.totalFrameCount * this.dFrameWidth, 32767) / container.clientWidth | 0;\n            let pointerX = this.pointerXFromRange(this.props.selectedRange);\n            this.setState({ maxZoom, pointerX });\n        };\n        this.setupCanvas = (canvas) => {\n            this.canvas = canvas;\n            if (!canvas) {\n                return;\n            }\n            const { ranges, sourceVideo, comparedVideo } = this.props;\n            this.drawCount++;\n            canvas.width = canvas.parentElement.clientWidth;\n            const ctx = this.canvas.getContext('2d');\n            ctx.clearRect(0, 0, canvas.width, canvas.height);\n            let pxPerFrame = this.pxPerFrame;\n            for (const [diffRange, range] of this.timelineMap) {\n                let { r1, r2, matchType } = diffRange;\n                ctx.fillStyle = DiffRange_1.MatchTypeColors[matchType];\n                this.drawRange(r1, range, sourceVideo.id, pxPerFrame, ctx, 0);\n                this.drawRange(r2, range, comparedVideo.id, pxPerFrame, ctx, this.dFrameHeight);\n            }\n        };\n        this.onZoom = (e) => {\n            let zoom = +e.target.value;\n            let pointerX = this.state.pointerX / this.state.zoom * zoom;\n            this.setState({ zoom, pointerX }, () => {\n                this.setupCanvas(this.canvas);\n                this.scrollToPointer(this.state.pointerX);\n            });\n        };\n        this.onRangeClick = (e) => {\n            let { offsetX: pointerX } = e.nativeEvent;\n            let timelineEntry = this.rangeAtPointer(pointerX);\n            this.setState({ pointerX }, () => {\n                this.props.rangeSelected(timelineEntry[0]);\n            });\n        };\n        this.onWheel = (e) => {\n            if (this.container && e.deltaY != 0) {\n                this.container.scrollTo(this.container.scrollLeft + e.deltaY, 0);\n            }\n        };\n        const { ranges, sourceVideo, comparedVideo } = props;\n        if (sourceVideo) {\n            this.dFrameWidth = FRAME_WIDTH / 2;\n            this.dFrameHeight = FRAME_HEIGHT / 2;\n            this.thumbsStrip = new ThumbsStrip_1.default(COLS, props.sourceVideo.timecodeRate, FRAME_WIDTH, FRAME_HEIGHT);\n            this.thumbsStrip.setDestFrameSize({ frameWidth: this.dFrameWidth, frameHeight: this.dFrameHeight });\n            this.totalFrameCount = ranges.reduce((acc, range) => {\n                let { r1, r2 } = range;\n                return acc + Math.max(r1.length, r2.length);\n            }, 0);\n            this.timelineMap = this.thumbsStrip.diffRangesTimeline(ranges);\n            this.drawCount = 0;\n        }\n        this.state = {\n            zoom: 1,\n            pointerX: 0,\n            maxZoom: 0\n        };\n    }\n    componentWillReceiveProps(nextProps) {\n        let selectedRange = nextProps.selectedRange;\n        if (this.container && selectedRange) {\n            let pointerX = this.pointerXFromRange(selectedRange);\n            this.setState({ pointerX }, () => {\n                this.scrollToPointer(pointerX);\n            });\n        }\n    }\n    get pxPerFrame() {\n        if (!this.canvas || !this.totalFrameCount) {\n            return 0;\n        }\n        return this.canvas.width / this.totalFrameCount;\n    }\n    pointerXFromRange(selectedRange) {\n        let selected = this.timelineMap.get(selectedRange);\n        if (selected) {\n            let { frame, length } = selected;\n            let { pointerX } = this.state;\n            let startX = frame * this.pxPerFrame;\n            let endX = (frame + length) * this.pxPerFrame;\n            if (startX < pointerX && pointerX < endX) {\n                return pointerX;\n            }\n            else {\n                return startX;\n            }\n        }\n        return 0;\n    }\n    drawRange(srcRange, dstRange, videoId, canvasFrameWidth, ctx, canvasY) {\n        let { frame: srcFrame, length: srcLength } = srcRange;\n        let { frame: dstFrame, length: dstLength } = dstRange;\n        let canvasX = dstFrame * canvasFrameWidth;\n        let scaledFrameWidth = this.dFrameWidth;\n        // px for the whole range\n        let canvasWidth = dstLength * canvasFrameWidth;\n        ctx.fillRect(canvasX, canvasY, canvasWidth, this.dFrameHeight);\n        if (!srcLength) {\n            return;\n        }\n        let scaledFrames = canvasWidth / scaledFrameWidth;\n        let scaledFullFrames = (scaledFrames | 0); // drop possible frame portion from the end\n        let scaledFrameRemainder = (scaledFrames % 1); // keep track of possible frame portion from the end\n        // source range frame numbers scaled to canvas,\n        // i.e. spread 42 frames from the source images to 10 frames space on the canvas\n        this.thumbsStrip.scaledToCanvas(srcLength, scaledFullFrames).forEach((n, i) => {\n            let srcFrameNumber = srcFrame + n;\n            let src = this.thumbsStrip.frameCoordinates(srcFrameNumber);\n            let dx = canvasX + i * scaledFrameWidth;\n            let dest = { x: dx, y: canvasY, height: this.dFrameHeight, width: scaledFrameWidth };\n            this.drawFrame(srcFrameNumber, videoId, src, dest);\n        });\n        if (scaledFrameRemainder > 0) {\n            // coordinates of possible portion + 1 frame from the end\n            let lastFrameNumber = srcFrame + srcLength - 1;\n            let lastSrcCoords = this.thumbsStrip.frameCoordinates(lastFrameNumber);\n            lastSrcCoords.width = lastSrcCoords.width * scaledFrameRemainder;\n            canvasX += scaledFullFrames * scaledFrameWidth;\n            let lastDestCoords = {\n                x: canvasX,\n                y: canvasY,\n                height: this.dFrameHeight,\n                width: scaledFrameWidth * scaledFrameRemainder\n            };\n            this.drawFrame(lastFrameNumber, videoId, lastSrcCoords, lastDestCoords);\n        }\n    }\n    drawFrame(frameNumber, videoId, src, dest) {\n        let drawCount = this.drawCount;\n        let { x: sX, y: sY, width: sWidth, height: sHeight } = src;\n        let { x: dX, y: dY, width: dWidth, height: dHeight } = dest;\n        let page = this.thumbsStrip.pageForFrame(frameNumber);\n        this.props.getImage(videoId, page).then(img => {\n            //do not draw if the canvas should draw new state\n            if (this.canvas && drawCount == this.drawCount) {\n                const ctx = this.canvas.getContext('2d');\n                ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);\n            }\n        });\n    }\n    rangeAtPointer(pointerX) {\n        let timelineFrame = pointerX / this.pxPerFrame | 0;\n        return this.thumbsStrip.entryByFrame(this.timelineMap, timelineFrame);\n    }\n    scrollToPointer(pointerX) {\n        if (!this.container) {\n            return;\n        }\n        this.container.scrollTo(pointerX - this.container.clientWidth / 2, 0);\n    }\n    render() {\n        const { zoom, pointerX, maxZoom } = this.state;\n        const height = this.dFrameHeight * 2;\n        let style = { '--timeline-zoom': zoom };\n        // @ts-ignore\n        return React.createElement(\"div\", { className: NAME, style: style },\n            React.createElement(\"div\", { className: \"container overflow-x\", ref: this.setupContainer, onWheel: this.onWheel },\n                React.createElement(\"div\", { className: `${NAME}__ranges`, onClick: this.onRangeClick },\n                    React.createElement(\"canvas\", { className: `${NAME}__canvas`, ref: this.setupCanvas, width: 1200, height: height }),\n                    React.createElement(\"div\", { className: `${NAME}__pointer`, style: { left: `${pointerX}px` } }))),\n            (maxZoom >= zoom) ?\n                React.createElement(\"div\", { className: `${NAME}__zoom` },\n                    React.createElement(\"input\", { type: \"range\", max: maxZoom, min: 1, step: 0.5, onChange: this.onZoom, value: zoom }))\n                : null);\n    }\n}\nexports.default = DiffTimeline;\n\n\n//# sourceURL=webpack:///./src/components/ranges/DiffTimeline.tsx?");

/***/ }),

/***/ "./src/model/DiffReportsApi.ts":
/*!*************************************!*\
  !*** ./src/model/DiffReportsApi.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass DiffReportsApi {\n    constructor(projectId) {\n        this.projectId = projectId;\n        this.imageMap = new Map();\n    }\n    getImage(videoId, page) {\n        let padStart = String(page + 1).padStart(3, '0');\n        const imgSrc = `${videoId}/stripes/out${padStart}.jpg`;\n        return new Promise((resolve, reject) => {\n            let img;\n            if (this.imageMap.has(imgSrc)) {\n                img = this.imageMap.get(imgSrc);\n                resolve(img);\n            }\n            else {\n                img = new Image();\n                img.src = imgSrc;\n                img.onload = () => {\n                    resolve(img);\n                    this.imageMap.set(img.src, img);\n                };\n                img.onerror = reject;\n            }\n        });\n    }\n}\nexports.default = DiffReportsApi;\n\n\n//# sourceURL=webpack:///./src/model/DiffReportsApi.ts?");

/***/ }),

/***/ "./src/test.tsx":
/*!**********************!*\
  !*** ./src/test.tsx ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst ReactDOM = __webpack_require__(/*! react-dom */ \"react-dom\");\nconst React = __webpack_require__(/*! react */ \"react\");\nconst DiffTimeline_1 = __webpack_require__(/*! ./components/ranges/DiffTimeline */ \"./src/components/ranges/DiffTimeline.tsx\");\nconst DiffReportsApi_1 = __webpack_require__(/*! ./model/DiffReportsApi */ \"./src/model/DiffReportsApi.ts\");\nexports.TestPage = ({ ranges, sourceVideo, comparedVideo, api }) => {\n    return React.createElement(DiffTimeline_1.default, { comparedVideo: comparedVideo, ranges: ranges, sourceVideo: sourceVideo, getImage: api.getImage.bind(api), rangeSelected: (r) => console.log(r) });\n};\nfunction diffReport(ranges, sourceVideo, comparedVideo, projectId) {\n    let api = new DiffReportsApi_1.default(projectId);\n    const app = document.getElementById(\"app\");\n    ReactDOM.hydrate(React.createElement(exports.TestPage, { comparedVideo: comparedVideo, ranges: ranges, sourceVideo: sourceVideo, api: api }), app);\n}\nif (typeof window != \"undefined\") {\n    // @ts-ignore\n    window.diffReport = diffReport;\n}\n\n\n//# sourceURL=webpack:///./src/test.tsx?");

/***/ }),

/***/ "bigfootjs/dist/DiffRange":
/*!*******************************************!*\
  !*** external "bigfootjs/dist/DiffRange" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bigfootjs/dist/DiffRange\");\n\n//# sourceURL=webpack:///external_%22bigfootjs/dist/DiffRange%22?");

/***/ }),

/***/ "bigfootjs/dist/ThumbsStrip":
/*!*********************************************!*\
  !*** external "bigfootjs/dist/ThumbsStrip" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bigfootjs/dist/ThumbsStrip\");\n\n//# sourceURL=webpack:///external_%22bigfootjs/dist/ThumbsStrip%22?");

/***/ }),

/***/ "commander":
/*!****************************!*\
  !*** external "commander" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"commander\");\n\n//# sourceURL=webpack:///external_%22commander%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-dom\");\n\n//# sourceURL=webpack:///external_%22react-dom%22?");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-dom/server\");\n\n//# sourceURL=webpack:///external_%22react-dom/server%22?");

/***/ })

/******/ });