"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var cacheDirJson = 'cacheFile.json';
var cachePathPrefix = '/node_modules/.vite/cacheDir';
// TODO 客户端缓存控制、文件名后缀处理
function fileCachePlugin(options) {
    var matchFn = options.matchFn;
    var cacheFileInfoJsonPath = path_1.default.join(process.cwd(), cachePathPrefix, cacheDirJson);
    return {
        name: 'fileCachePlugin',
        apply: 'serve',
        enforce: 'pre',
        configureServer: function (serve) {
            var _this = this;
            var middlewares = serve.middlewares, transformRequest = serve.transformRequest, moduleGraph = serve.moduleGraph;
            middlewares.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var matchEx, urlToModuleMap, mod, formatUrl, cacheDir, fileName, cacheInfo, exist, cacheHit, serializeContent, mtime, readFileContent, fileInfo, result, fileInfo, result, err_1;
                var _a, _b;
                var _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            matchEx = (req === null || req === void 0 ? void 0 : req.url) ? matchFn(process.cwd() + req.url) : false;
                            if (!(matchEx &&
                                req.url)) return [3 /*break*/, 12];
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 11, , 12]);
                            urlToModuleMap = moduleGraph.urlToModuleMap;
                            mod = urlToModuleMap.get(req.url);
                            if (!mod) {
                                next();
                                return [2 /*return*/];
                            }
                            formatUrl = (_c = mod.id) !== null && _c !== void 0 ? _c : '';
                            cacheDir = path_1.default.join(process.cwd(), cachePathPrefix);
                            fileName = formatUrl.replace(/\//g, '-');
                            return [4 /*yield*/, getCacheInfo(formatUrl, cacheFileInfoJsonPath)];
                        case 2:
                            cacheInfo = _f.sent();
                            if (!cacheInfo) return [3 /*break*/, 10];
                            exist = cacheInfo.exist, cacheHit = cacheInfo.cacheHit, serializeContent = cacheInfo.serializeContent, mtime = cacheInfo.mtime;
                            if (!exist) return [3 /*break*/, 7];
                            if (!cacheHit) return [3 /*break*/, 4];
                            return [4 /*yield*/, fs_1.default.readFileSync(path_1.default.join(cacheDir, fileName))];
                        case 3:
                            readFileContent = _f.sent();
                            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                            res.end(readFileContent);
                            return [2 /*return*/];
                        case 4:
                            fileInfo = JSON.stringify(__assign(__assign({}, serializeContent), (_a = {}, _a[formatUrl] = mtime.getTime(), _a)));
                            return [4 /*yield*/, transformRequest(req === null || req === void 0 ? void 0 : req.url)];
                        case 5:
                            result = _f.sent();
                            fs_1.default.writeFileSync(cacheFileInfoJsonPath, fileInfo);
                            fs_1.default.writeFileSync(path_1.default.join(cacheDir, fileName), (_d = result === null || result === void 0 ? void 0 : result.code) !== null && _d !== void 0 ? _d : '');
                            _f.label = 6;
                        case 6: return [3 /*break*/, 10];
                        case 7:
                            fileInfo = JSON.stringify((_b = {},
                                _b[formatUrl] = mtime.getTime(),
                                _b));
                            return [4 /*yield*/, transformRequest(req.url)];
                        case 8:
                            result = _f.sent();
                            return [4 /*yield*/, fs_1.default.mkdirSync(path_1.default.join(process.cwd(), cachePathPrefix))];
                        case 9:
                            _f.sent();
                            fs_1.default.writeFileSync(cacheFileInfoJsonPath, fileInfo);
                            fs_1.default.writeFileSync(path_1.default.join(cacheDir, fileName), (_e = result === null || result === void 0 ? void 0 : result.code) !== null && _e !== void 0 ? _e : '');
                            _f.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            err_1 = _f.sent();
                            console.error(err_1);
                            return [3 /*break*/, 12];
                        case 12:
                            next();
                            return [2 /*return*/];
                    }
                });
            }); });
        },
        load: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var matchEx, cacheInfo, exist, cacheHit, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            matchEx = matchFn(id);
                            if (!matchEx) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getCacheInfo(id, cacheFileInfoJsonPath)];
                        case 2:
                            cacheInfo = _a.sent();
                            if (cacheInfo) {
                                exist = cacheInfo.exist, cacheHit = cacheInfo.cacheHit;
                                if (exist && cacheHit) {
                                    return [2 /*return*/, {
                                            code: '',
                                        }];
                                }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            console.error(err_2);
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5: return [2 /*return*/, null];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
    };
}
exports.default = fileCachePlugin;
var getCacheInfo = function (fileUrl, cacheFileInfoJsonPath) { return __awaiter(void 0, void 0, void 0, function () {
    var mtime, exist, fileContent, serializeContent, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                mtime = fs_1.default.statSync(fileUrl).mtime;
                exist = fs_1.default.existsSync(cacheFileInfoJsonPath);
                if (!exist) return [3 /*break*/, 2];
                return [4 /*yield*/, fs_1.default.readFileSync(cacheFileInfoJsonPath, {
                        encoding: 'utf8',
                    })];
            case 1:
                fileContent = _a.sent();
                serializeContent = JSON.parse(fileContent);
                // cache hit
                if (serializeContent[fileUrl] == mtime.getTime()) {
                    return [2 /*return*/, {
                            exist: exist,
                            cacheHit: true,
                            serializeContent: serializeContent,
                            mtime: mtime
                        }];
                }
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, {
                    exist: exist,
                    cacheHit: false,
                    mtime: mtime
                }];
            case 3: return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.error(err_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map