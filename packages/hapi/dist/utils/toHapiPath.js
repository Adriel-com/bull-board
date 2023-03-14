"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHapiPath = void 0;
function toHapiPath(path) {
    return path
        .split('/')
        .map((path) => (path.startsWith(':') ? `{${path.substring(1)}}` : path))
        .join('/');
}
exports.toHapiPath = toHapiPath;
//# sourceMappingURL=toHapiPath.js.map