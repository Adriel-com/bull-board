"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyAdapter = exports.BullMQAdapter = exports.BullAdapter = exports.createBullBoard = void 0;
var api_1 = require("@bull-board/api");
Object.defineProperty(exports, "createBullBoard", { enumerable: true, get: function () { return api_1.createBullBoard; } });
var bullAdapter_1 = require("@bull-board/api/bullAdapter");
Object.defineProperty(exports, "BullAdapter", { enumerable: true, get: function () { return bullAdapter_1.BullAdapter; } });
var bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
Object.defineProperty(exports, "BullMQAdapter", { enumerable: true, get: function () { return bullMQAdapter_1.BullMQAdapter; } });
var FastifyAdapter_1 = require("./FastifyAdapter");
Object.defineProperty(exports, "FastifyAdapter", { enumerable: true, get: function () { return FastifyAdapter_1.FastifyAdapter; } });
//# sourceMappingURL=index.js.map