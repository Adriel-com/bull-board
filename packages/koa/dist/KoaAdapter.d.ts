import { AppControllerRoute, AppViewRoute, BullBoardQueues, ControllerHandlerReturnType, IServerAdapter, UIConfig } from '@bull-board/api/dist/typings/app';
import Koa from 'koa';
export declare class KoaAdapter implements IServerAdapter {
    private basePath;
    private bullBoardQueues;
    private errorHandler;
    private statics;
    private viewPath;
    private entryRoute;
    private apiRoutes;
    private uiConfig;
    setBasePath(path: string): KoaAdapter;
    setStaticPath(staticsRoute: string, staticsPath: string): KoaAdapter;
    setViewsPath(viewPath: string): KoaAdapter;
    setErrorHandler(handler: (error: Error) => ControllerHandlerReturnType): this;
    setApiRoutes(routes: AppControllerRoute[]): KoaAdapter;
    setEntryRoute(routeDef: AppViewRoute): KoaAdapter;
    setQueues(bullBoardQueues: BullBoardQueues): KoaAdapter;
    setUIConfig(config?: UIConfig): KoaAdapter;
    registerPlugin(options?: Partial<{
        mount: string;
    }>): Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any>;
}
