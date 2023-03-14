"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HapiAdapter = void 0;
const vision_1 = __importDefault(require("@hapi/vision"));
const inert_1 = __importDefault(require("@hapi/inert"));
const toHapiPath_1 = require("./utils/toHapiPath");
class HapiAdapter {
    constructor() {
        this.basePath = '';
        this.uiConfig = {};
    }
    setBasePath(path) {
        this.basePath = path;
        return this;
    }
    setStaticPath(staticsRoute, staticsPath) {
        this.statics = { route: staticsRoute, path: staticsPath };
        return this;
    }
    setViewsPath(viewPath) {
        this.viewPath = viewPath;
        return this;
    }
    setErrorHandler(handler) {
        this.errorHandler = handler;
        return this;
    }
    setApiRoutes(routes) {
        this.apiRoutes = routes.reduce((result, routeRaw) => {
            const routes = Array.isArray(routeRaw.route) ? routeRaw.route : [routeRaw.route];
            const methods = Array.isArray(routeRaw.method) ? routeRaw.method : [routeRaw.method];
            routes.forEach((path) => {
                result.push({
                    method: methods.map((method) => method.toUpperCase()),
                    path: (0, toHapiPath_1.toHapiPath)(path),
                    handler: routeRaw.handler,
                });
            });
            return result;
        }, []);
        return this;
    }
    setEntryRoute(routeDef) {
        this.entryRoute = routeDef;
        return this;
    }
    setQueues(bullBoardQueues) {
        this.bullBoardQueues = bullBoardQueues;
        return this;
    }
    setUIConfig(config = {}) {
        this.uiConfig = config;
        return this;
    }
    registerPlugin() {
        return {
            pkg: require('../package.json'),
            register: async (server, options = {}) => {
                if (!this.statics) {
                    throw new Error(`Please call 'setStaticPath' before using 'registerPlugin'`);
                }
                else if (!this.entryRoute) {
                    throw new Error(`Please call 'setEntryRoute' before using 'registerPlugin'`);
                }
                else if (!this.viewPath) {
                    throw new Error(`Please call 'setViewsPath' before using 'registerPlugin'`);
                }
                else if (!this.apiRoutes) {
                    throw new Error(`Please call 'setApiRoutes' before using 'registerPlugin'`);
                }
                else if (!this.bullBoardQueues) {
                    throw new Error(`Please call 'setQueues' before using 'registerPlugin'`);
                }
                else if (!this.errorHandler) {
                    throw new Error(`Please call 'setErrorHandler' before using 'registerPlugin'`);
                }
                await server.register(vision_1.default);
                server.views({
                    engines: {
                        ejs: require('ejs'),
                    },
                    path: this.viewPath,
                });
                await server.register(inert_1.default);
                server.route({
                    method: 'GET',
                    path: `${this.statics.route}/{param*}`,
                    options,
                    handler: {
                        directory: {
                            path: this.statics.path,
                        },
                    },
                });
                const { method, route, handler } = this.entryRoute;
                const routes = Array.isArray(route) ? route : [route];
                routes.forEach((path) => server.route({
                    method: method.toUpperCase(),
                    path: (0, toHapiPath_1.toHapiPath)(path),
                    options,
                    handler: (_request, h) => {
                        const { name } = handler();
                        const basePath = this.basePath.endsWith('/') ? this.basePath : `${this.basePath}/`;
                        const uiConfig = JSON.stringify(this.uiConfig)
                            .replace(/</g, '\\u003c')
                            .replace(/>/g, '\\u003e');
                        return h.view(name, { basePath, uiConfig });
                    },
                }));
                const errorHandler = this.errorHandler;
                this.apiRoutes.forEach((route) => {
                    server.route({
                        method: route.method,
                        path: route.path,
                        options,
                        handler: async (request, h) => {
                            try {
                                const response = await route.handler({
                                    queues: this.bullBoardQueues,
                                    params: request.params,
                                    query: request.query,
                                });
                                return h.response(response.body).code(response.status || 200);
                            }
                            catch (e) {
                                const response = errorHandler(e);
                                return h.response(response.body).code(response.status);
                            }
                        },
                    });
                });
            },
        };
    }
}
exports.HapiAdapter = HapiAdapter;
//# sourceMappingURL=HapiAdapter.js.map