"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var snowball = require("snowball-stemmers");
var stopwordData = require("./stopwords.json");
var inBrowser = typeof window != "undefined";
var english = "english";
var get;
//// Request section
if (inBrowser) {
    get = function (url, timeoutMs) {
        return new Promise(function (resolve, reject) {
            var out = setTimeout(function () {
                reject("Request Timed Out");
            }, timeoutMs);
            var req = new XMLHttpRequest();
            req.open("GET", url);
            req.send();
            req.onload = function () {
                if (req.status == 200) {
                    clearTimeout(out);
                    resolve(req.response);
                }
                else {
                    reject(req.response);
                }
            };
        });
    };
}
else {
    var http_1 = require("http");
    var https_1 = require("https");
    get = function (url, timeoutMs) {
        return new Promise(function (resolve, reject) {
            var out = setTimeout(function () {
                reject("Request Timed Out");
            }, timeoutMs);
            var data = "";
            var handler = function (res) {
                res.on("data", function (d) {
                    data += d;
                });
                res.on("end", function () {
                    clearTimeout(out);
                    resolve(data);
                });
                res.on("error", function (e) {
                    reject(e);
                });
            };
            var options = {
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                        "AppleWebKit/537.36 (KHTML, like Gecko) " +
                        "Chrome/83.0.4103.97 Safari/537.36",
                    connection: "keep-alive"
                }
            };
            if (url.slice(0, 5) == "https")
                https_1.get(url, options, handler);
            else
                http_1.get(url, options, handler);
        });
    };
}
//// Comparison section
/**
 * Takes text and the output of the findSpaces function as inputs, outputs list of words and list of their indices
 * in the original string in formant [start, end]
 *
 * In: "Hello, my name is", [-1, 6, 9, 14, 17]
 *
 * Out: [   [ 'Hello,', 'my', 'name', 'is' ] ,
 * [[ 0, 6 ], [ 7, 9 ], [ 10, 14 ], [ 15, 17 ]]   ]
 */
function getWords(text, language) {
    if (language === void 0) { language = english; }
    var regex = new RegExp(stopwordData[language].wordregex[0], stopwordData[language].wordregex[1]);
    var words = [];
    var indices = [];
    Array.from(text.matchAll(regex)).forEach(function (match) {
        words.push(match[0]);
        indices.push([match.index || 0, (match.index || 0) + match.length]);
    });
    return [words, indices];
}
/**
 * Leaves only allowed characters on each word and lowers it, and then removes the stopwords (from stopwords.json)
 *
 * In: [ 'Hello,', 'my', 'name', 'is', 'jazz' ] ,  [[ 0, 6 ], [ 7, 9 ], [ 10, 14 ], [ 15, 17 ], [20,25]]
 *
 * Out: [ [ 'jazz' ], [ [ 20, 25 ] ] ]
 * (only jazz is not a stopword)
 */
function normalizeAndRemoveStopWords(words, indicesList, language) {
    if (language === void 0) { language = english; }
    var stopwords = stopwordData[language].stopwords;
    var spaces = RegExp(stopwordData[language].spaceregex[0], stopwordData[language].spaceregex[1]); // All non-allowed characters
    var newWords = [];
    var newIndicesList = [];
    for (var i = 0; i < words.length; i++) {
        var word = words[i].toLowerCase().replace(spaces, "");
        if (!stopwords.includes(word)) {
            newWords.push(word);
            newIndicesList.push(indicesList[i]);
        }
    }
    return [newWords, newIndicesList];
}
/**
 * Stems the words (turns to root form) and optionally shingles them
 *
 * Read more:
 * https://en.wikipedia.org/wiki/Stemming
 * https://en.wikipedia.org/wiki/W-shingling
 *
 * In: ["like", "jazz", "my", "jazzy", "feeling"] , [[1,2], [3,4], [5,6], [7,8], [9,10]] , 2 , "english"
 *
 * Out: [ [  [ 'like', 'jazz' ],[ 'jazz', 'my' ],[ 'my', 'jazzi' ],[ 'jazzi', 'feel' ] ],
 * [ [ 1, 4 ], [ 3, 6 ], [ 5, 8 ], [ 7, 10 ] ]]
 */
function shingleAndStemmer(words, indicesList, shingleSize, stemmer) {
    words = words.map(stemmer);
    var shingles = [];
    var shingledIndicesList = [];
    var len = words.length - shingleSize + 1;
    for (var i = 0; i < len; i++) {
        shingles.push(words.slice(i, i + shingleSize));
        shingledIndicesList.push([
            indicesList[i][0],
            indicesList[i + shingleSize - 1][1]
        ]);
    }
    return [shingles, shingledIndicesList];
}
/**
 * Auxiliary function which unites two arrays, skipping duplicates
 *
 * In: [1,2,4,5,7] , [3,4,5,6,7,8]
 *
 * Out: [1,2,4,5,7,3,6,8]
 */
function union(array1, array2) {
    var len = array2.length;
    for (var i = 0; i < len; i++) {
        if (!array1.includes(array2[i])) {
            array1.push(array2[i]);
        }
    }
    return array1;
}
/**
 * Auxiliary function which finds the difference of two arrays (based on the first one)
 *
 * In: [1,2,3,4,9], [2,4,7,8]
 *
 * Out: [1,3,9]
 */
function diff(array1, array2) {
    var e_1, _a;
    var output = [];
    try {
        for (var array1_1 = __values(array1), array1_1_1 = array1_1.next(); !array1_1_1.done; array1_1_1 = array1_1.next()) {
            var element = array1_1_1.value;
            if (!array2.includes(element))
                output.push(element);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (array1_1_1 && !array1_1_1.done && (_a = array1_1.return)) _a.call(array1_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return output;
}
/**
 * Auxiliary function which checks if the elements of both arrays are equal. If they are not arrays just checks if
 * they are equal.
 *
 * In: [1,2,3,4], [2,4,3,1]
 * Out: false
 *
 * In: [1,2,3,4], [1,2,3,4]
 * Out: true
 *
 * In: [[1]], [[1]]
 * Out: false // because they are different entities and this function isn't recursive
 */
function arraysEqual(array1, array2) {
    if (array1 == array2) {
        return true;
    }
    if (array1.length != array2.length) {
        return false;
    }
    var len = array1.length;
    for (var i = 0; i < len; i++) {
        if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Finds the points matching in both shingle sets, then finds the clusters in which they are close together
 * (a match)
 *
 * In: [["a"],["b"],["c"],["d"]], [["x"],["c"],["d"],["y"]], 2, 1
 * Out: [ [ [ 2, 1 ], [ 3, 2 ] ] ]
 *
 * Meaning there was one cluster, consisting of the indices 2 and 3 ("b" and "c") of the first array, and indices 1
 * and 2 of the second array (also "b" and "c")
 *
 * The returnMatches argument return the matches without any cluster done to them
 */
function findUnionAndCluster(shingles1, shingles2, maximumGap, minimumClusterSize, returnMatches) {
    if (maximumGap === void 0) { maximumGap = 3; }
    if (minimumClusterSize === void 0) { minimumClusterSize = 1; }
    if (returnMatches === void 0) { returnMatches = false; }
    var matches = [];
    for (var i = 0; i < shingles1.length; i++) {
        for (var j = 0; j < shingles2.length; j++) {
            if (arraysEqual(shingles1[i], shingles2[j])) {
                matches.push([i, j]);
            }
        }
    }
    //clustering
    var clusters = [];
    for (var i = 0; i < matches.length; i++) {
        // For every matching point
        var inCluster = null; // By default it is not in any cluster
        var clustersLen = clusters.length; // (false == 0 so it's not used)
        for (var j = 0; j < clustersLen; j++) {
            // For each existing cluster
            var currentClusterLen = clusters[j].length;
            for (var k = 0; k < currentClusterLen; k++) {
                // For each point in that cluster
                if (Math.max(Math.abs(matches[i][0] - clusters[j][k][0]), // If Chebyshev distance is small enough
                Math.abs(matches[i][1] - clusters[j][k][1])) <= maximumGap) {
                    // to be in the same cluster
                    if (inCluster == null) {
                        // If it isn't in any cluster
                        clusters[j].push(matches[i]); // Add it to the cluster
                        inCluster = j; // Mark that it is in that cluster
                    }
                    else if (inCluster != j) {
                        // Else if it already is in a cluster
                        //and that cluster isn't the one it's in
                        clusters[inCluster] = union(clusters[inCluster], //Merge both clusters
                        clusters[j]);
                        clusters[j] = [];
                        break;
                    }
                }
            }
        }
        if (inCluster == null) {
            // If after checking in al clusters it
            clusters.push([matches[i]]); // isn't in any, create a cluster with just itseld
        }
    }
    //Removing all clusters smaller than the minimum distance
    var newClusters = [];
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].length >= minimumClusterSize) {
            newClusters.push(clusters[i]);
        }
    }
    if (returnMatches) {
        return [newClusters, matches];
    }
    return newClusters;
}
/**
 * Returns the indices of matches based on the original text.
 *
 * In: 0,2, [[1,4],[5,7],[8,9],[12,15]]
 * Out: [1, 9]
 */
function findClusterStartAndEnd(shingleStart, shingleEnd, shingledIndicesList) {
    return [
        shingledIndicesList[shingleStart][0],
        shingledIndicesList[shingleEnd][1]
    ];
}
//// Search section
/**
 * Checks if any element in a list contains a substring of the given string
 *
 * In: "hello there", ["xyz", "thi", "re"]
 * Out: true
 */
function includesSubstringFromArray(string, array) {
    var e_2, _a;
    try {
        for (var array_1 = __values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
            var substring = array_1_1.value;
            if (string.includes(substring))
                return true;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
}
/**
 * Auxiliary function to convert html to plain text
 *
 * Modified from EpokK @
 *https://stackoverflow.com/questions/15180173/convert-html-to-plain-text-in-js-without-browser-environment/15180206
 *
 * In: "<html><head><title>Example Domain</title>..."
 *
 * Out:
 *Example Domain
 *
 *Example Domain
 *This domain is for use in illustrative examples in documents. You may use this
 *domain in literature without prior coordination or asking for permission.
 *
 *More information...
 */
function html2text(htmlCode) {
    htmlCode = String(htmlCode)
        .replace(/<style([\s\S]*?)<\/style>/gi, "")
        .replace(/<script([\s\S]*?)<\/script>/gi, "")
        .replace(/<[^>]+>/gi, " ");
    return htmlCode;
}
/**
 * Gets contents inside title tag in html.
 *
 * In: "<head> ... <title >HookeJs/index.js at master · oekshido/HookeJs</title> ... "
 *
 * Out: HookeJs/index.js at master · oekshido/HookeJs
 */
function getTitle(html) {
    var _a, _b;
    if (typeof html != "string") {
        return "";
    }
    var a = RegExp("title(.*?)/title", "i");
    var b = RegExp(">(.*?)<", "i");
    return ((_b = (_a = html.match(a)) === null || _a === void 0 ? void 0 : _a[0].match(b)) === null || _b === void 0 ? void 0 : _b[0].slice(1, -1)) || "";
}
/**
 * Searches the given query scraping google
 *
 * In: "Jazz"
 * Out: ["https://en.wikipedia.org/wiki/Jazz", ...]
 */
function singleSearchScrape(query) {
    return __awaiter(this, void 0, void 0, function () {
        var ignore, url, response, anchorTags, urls, anchorTags_1, anchorTags_1_1, tag, links;
        var e_3, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ignore = [
                        "google.com/preferences",
                        "accounts.google",
                        "google.com/webhp",
                        "google.com/"
                    ];
                    url = new URL("https://www.google.com/search");
                    url.searchParams.append("q", query);
                    return [4 /*yield*/, get(url.href, 60000).catch(function (e) { throw e; })];
                case 1:
                    response = _b.sent();
                    anchorTags = response.match(/<a[\s]+([^>]+)>/gi) || [];
                    urls = [];
                    try {
                        for (anchorTags_1 = __values(anchorTags), anchorTags_1_1 = anchorTags_1.next(); !anchorTags_1_1.done; anchorTags_1_1 = anchorTags_1.next()) {
                            tag = anchorTags_1_1.value;
                            links = __spreadArray([], __read(tag.matchAll(/".*?"/g)), false).filter(function (e) { return e[0].startsWith("\"http"); })
                                .map(function (e) { return e[0].slice(1, -1).split("&")[0]; })
                                .filter(function (e) { return !includesSubstringFromArray(e, ignore); })
                                .filter(function (e) { return !urls.includes(e); });
                            urls.push.apply(urls, __spreadArray([], __read(links), false));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (anchorTags_1_1 && !anchorTags_1_1.done && (_a = anchorTags_1.return)) _a.call(anchorTags_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    return [2 /*return*/, urls];
            }
        });
    });
}
/**
 * Searches the given query using the custom search engine api
 *
 * In: "Jazz"
 *
 * Out: ["https://en.wikipedia.org/wiki/Jazz", ...]
 */
function singleSearchApi(query, apikey, engineid) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, _a, _b, urls, _c, _d, item;
        var e_4, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    url = new URL("https://www.googleapis.com/customsearch/v1");
                    url.searchParams.append("q", query);
                    url.searchParams.append("key", apikey);
                    url.searchParams.append("cx", engineid);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, get(url.href, 60000)];
                case 1:
                    response = _b.apply(_a, [_f.sent()]);
                    if (response != undefined && response.items != undefined) {
                        urls = [];
                        try {
                            for (_c = __values(response.items), _d = _c.next(); !_d.done; _d = _c.next()) {
                                item = _d.value;
                                urls.push(item.link);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        return [2 /*return*/, urls];
                    }
                    else {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Downloads text of the urls given, or returns html if justText is false.
 *
 * In: ["http://example.com/", ...]
 * Out: ["Example Domain\n ...", ...]
 */
function downloadWebsites(urls, justText, verbose) {
    if (justText === void 0) { justText = true; }
    if (verbose === void 0) { verbose = false; }
    return __awaiter(this, void 0, void 0, function () {
        var catchFunction, requests, i, responses, htmls, texts, titles, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    catchFunction = verbose ? console.log : function () { };
                    requests = [];
                    for (i = 0; i < urls.length; i++) {
                        requests.push(get(urls[i], 60000));
                    }
                    return [4 /*yield*/, Promise.all(requests).catch(catchFunction)];
                case 1:
                    responses = (_a.sent()) || [];
                    htmls = responses.map(function (e) {
                        if (typeof e == "string")
                            return e;
                        else
                            return "";
                    });
                    if (!justText) {
                        return [2 /*return*/, htmls];
                    }
                    texts = [];
                    titles = [];
                    for (i = 0; i < htmls.length; i++) {
                        texts.push(html2text(htmls[i]));
                        titles.push(getTitle(htmls[i]));
                    }
                    return [2 /*return*/, [texts, titles]];
            }
        });
    });
}
//// Use section
/**
 * Class which represents a source, with the variable being source(its url), matches(array of class Match), and the
 * text
 */
var Source = /** @class */ (function () {
    function Source(source, matches, text, title) {
        this.source = source;
        this.matches = matches;
        this.text = text;
        this.title = title;
    }
    return Source;
}());
/**
 * Represents a specific cluster, with extra funcionality
 */
var Match = /** @class */ (function () {
    function Match(cluster, url, sourceTitle) {
        this.inputShingleStart = 0;
        this.inputShingleEnd = 0;
        this.comparedShingleStart = 0;
        this.comparedShingleEnd = 0;
        this.inputStart = 0;
        this.inputEnd = 0;
        this.comparedStart = 0;
        this.comparedEnd = 0;
        this.score = 0;
        this.cluster = cluster;
        this.source = url;
        this.sourceTitle = sourceTitle;
    }
    /**
     * Finds the start and end of the match, and gives it an overall score equals to the amount of matches squared
     * divided by the end minus start of the cluster, or the length times density, or zero if it is len zero
     */
    Match.prototype.contextualize = function (inputShingledIndicesList, comparedShingledIndicesList) {
        var _a, _b;
        var len = this.cluster.length;
        this.inputShingleStart = this.inputShingleEnd = this.cluster[0][0];
        this.comparedShingleStart = this.comparedShingleEnd = this.cluster[0][1];
        for (var i = 1; i < len; i++) {
            if (this.cluster[i][0] < this.inputShingleStart) {
                this.inputShingleStart = this.cluster[i][0];
            }
            else if (this.cluster[i][0] > this.inputShingleEnd) {
                this.inputShingleEnd = this.cluster[i][0];
            }
            if (this.cluster[i][1] < this.comparedShingleStart) {
                this.comparedShingleStart = this.cluster[i][1];
            }
            else if (this.cluster[i][1] > this.comparedShingleEnd) {
                this.comparedShingleEnd = this.cluster[i][1];
            }
        }
        ;
        _a = __read(findClusterStartAndEnd(this.inputShingleStart, this.inputShingleEnd, inputShingledIndicesList), 2), this.inputStart = _a[0], this.inputEnd = _a[1];
        _b = __read(findClusterStartAndEnd(this.comparedShingleStart, this.comparedShingleEnd, comparedShingledIndicesList), 2), this.comparedStart = _b[0], this.comparedEnd = _b[1];
        if (this.inputShingleEnd - this.inputShingleStart > 1) {
            this.score =
                (this.cluster.length * this.cluster.length) /
                    (this.inputShingleEnd - this.inputShingleStart);
        }
        else {
            this.score = 0;
        }
    };
    /**
     * Returns given the period indices the nearest period after it
     */
    Match.prototype.findNearestPeriod = function (periodIndices, margin) {
        if (margin === void 0) { margin = 5; }
        for (var i = 0; i < periodIndices.length; i++) {
            if (periodIndices[i] >= this.inputEnd - margin) {
                return periodIndices[i];
            }
        }
    };
    return Match;
}());
/**
 * Takes th input text and searches the internet for similar texts, and finds matches between them.
 *
 * In: "Example Domain This domain is for use in illustrative examples in documents. You may use this domain in " +
 * "literature without prior coordination or asking for permission. More information..."
 *
 * Out: [Source{source: "http://www.example.com", matches = [Match{...}, ...], text = "Example Domain Example ..."},
 *  ...]
 */
function match(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.text, text = _c === void 0 ? "" : _c, _d = _b.language, language = _d === void 0 ? english : _d, _e = _b.shingleSize, shingleSize = _e === void 0 ? 2 : _e, _f = _b.apikey, apikey = _f === void 0 ? process.env.G_API_KEY || "" : _f, _g = _b.engineid, engineid = _g === void 0 ? process.env.G_ENGINE_ID || "" : _g, _h = _b.maximumGap, maximumGap = _h === void 0 ? 3 : _h, _j = _b.minimumClusterSize, minimumClusterSize = _j === void 0 ? 5 : _j, _k = _b.verbose, verbose = _k === void 0 ? false : _k;
    return __awaiter(this, void 0, void 0, function () {
        var stemmer, inputText, sources, _l, inputWords, inputIndicesList, _m, inputShingles, inputShingledIndicesList, limit, len, searchQueries, i, usedUrls, searchQueries_1, searchQueries_1_1, query, comparedUrls, e_5, _o, comparedTexts, comparedTitles, i, _p, comparedWordsTemp, comparedIndicesListTemp, _q, comparedShinglesTemp, comparedShingledIndicesListTemp, comparedClustersTemp, matchesTemp, j, e_6_1;
        var _r, e_6, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    stemmer = snowball.newStemmer(language).stem;
                    inputText = text;
                    sources = [];
                    _l = __read(getWords(inputText), 2), inputWords = _l[0], inputIndicesList = _l[1];
                    _r = __read(normalizeAndRemoveStopWords(inputWords, inputIndicesList, language), 2), inputWords = _r[0], inputIndicesList = _r[1];
                    _m = __read(shingleAndStemmer(inputWords, inputIndicesList, shingleSize, stemmer), 2), inputShingles = _m[0], inputShingledIndicesList = _m[1];
                    limit = 32 //32 word limit on google search
                    ;
                    len = Math.ceil(inputWords.length / limit);
                    searchQueries = [];
                    for (i = 0; i < len; i++) {
                        searchQueries.push(inputWords.slice(i * limit, (i + 1) * limit).join(" "));
                    }
                    usedUrls = [] // Urls that have already have been used.
                    ;
                    _u.label = 1;
                case 1:
                    _u.trys.push([1, 13, 14, 15]);
                    searchQueries_1 = __values(searchQueries), searchQueries_1_1 = searchQueries_1.next();
                    _u.label = 2;
                case 2:
                    if (!!searchQueries_1_1.done) return [3 /*break*/, 12];
                    query = searchQueries_1_1.value;
                    comparedUrls = void 0;
                    _u.label = 3;
                case 3:
                    _u.trys.push([3, 8, , 9]);
                    if (!(apikey && engineid)) return [3 /*break*/, 5];
                    return [4 /*yield*/, singleSearchApi(query, apikey, engineid)];
                case 4:
                    comparedUrls = _u.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, singleSearchScrape(query)];
                case 6:
                    comparedUrls = _u.sent();
                    _u.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_5 = _u.sent();
                    throw e_5;
                case 9:
                    comparedUrls = diff(comparedUrls, usedUrls); // New urls
                    usedUrls = union(usedUrls, comparedUrls);
                    return [4 /*yield*/, downloadWebsites(comparedUrls, true, verbose).catch(function (e) { throw e; })];
                case 10:
                    _o = __read.apply(void 0, [(_u.sent()) || [[], []], 2]), comparedTexts = _o[0], comparedTitles = _o[1];
                    for (i = 0; i < comparedTexts.length; i++) {
                        _p = __read(getWords(comparedTexts[i]), 2), comparedWordsTemp = _p[0], comparedIndicesListTemp = _p[1];
                        _t = __read(normalizeAndRemoveStopWords(comparedWordsTemp, comparedIndicesListTemp, language), 2), comparedWordsTemp = _t[0], comparedIndicesListTemp = _t[1];
                        _q = __read(shingleAndStemmer(comparedWordsTemp, comparedIndicesListTemp, shingleSize, stemmer), 2), comparedShinglesTemp = _q[0], comparedShingledIndicesListTemp = _q[1];
                        comparedClustersTemp = findUnionAndCluster(inputShingles, comparedShinglesTemp, maximumGap, minimumClusterSize);
                        matchesTemp = [];
                        for (j = 0; j < comparedClustersTemp.length; j++) {
                            matchesTemp.push(new Match(comparedClustersTemp[j], comparedUrls[i], comparedTitles[i]));
                            matchesTemp[j].contextualize(inputShingledIndicesList, comparedShingledIndicesListTemp);
                        }
                        sources.push(new Source(comparedUrls[i], matchesTemp, comparedTexts[i], comparedTitles[i]));
                    }
                    _u.label = 11;
                case 11:
                    searchQueries_1_1 = searchQueries_1.next();
                    return [3 /*break*/, 2];
                case 12: return [3 /*break*/, 15];
                case 13:
                    e_6_1 = _u.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 15];
                case 14:
                    try {
                        if (searchQueries_1_1 && !searchQueries_1_1.done && (_s = searchQueries_1.return)) _s.call(searchQueries_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/, sources];
            }
        });
    });
}
/**
 * Runs the match function and prints it
 */
function matchPrint(matchArgs, minScore) {
    var _a;
    if (minScore === void 0) { minScore = 5; }
    return __awaiter(this, void 0, void 0, function () {
        var text, sources, sources_1, sources_1_1, source, _b, _c, singleMatch;
        var e_7, _d, e_8, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    text = ((_a = matchArgs[0]) === null || _a === void 0 ? void 0 : _a.text) || "";
                    return [4 /*yield*/, match(matchArgs[0]).catch(console.log)];
                case 1:
                    sources = (_f.sent()) || [];
                    console.log("\n\n\nComparison");
                    try {
                        for (sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                            source = sources_1_1.value;
                            try {
                                for (_b = (e_8 = void 0, __values(source.matches)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    singleMatch = _c.value;
                                    if (singleMatch.score >= minScore) {
                                        console.log("\n\n\nFROM ".concat(source.source, "\n\n"));
                                        console.log("ORIGINAL: ".concat(text.slice(singleMatch.inputStart, singleMatch.inputEnd), "\n\n"));
                                        console.log("COMPARED: ".concat(source.text.slice(singleMatch.comparedStart, singleMatch.comparedEnd), "\n\n"));
                                        console.log("SCORE: ".concat(singleMatch.score));
                                    }
                                }
                            }
                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_e = _b.return)) _e.call(_b);
                                }
                                finally { if (e_8) throw e_8.error; }
                            }
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (sources_1_1 && !sources_1_1.done && (_d = sources_1.return)) _d.call(sources_1);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
if (!inBrowser) {
    module.exports = { match: match, matchPrint: matchPrint };
}
else {
    // @ts-ignore
    window.hooke = { match: match, matchPrint: matchPrint };
}
