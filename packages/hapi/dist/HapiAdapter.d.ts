import { AppControllerRoute, AppViewRoute, BullBoardQueues, ControllerHandlerReturnType, IServerAdapter, UIConfig } from '@bull-board/api/dist/typings/app';
import { PluginBase, PluginPackage } from '@hapi/hapi';
export declare class HapiAdapter implements IServerAdapter {
    private basePath;
    private bullBoardQueues;
    private errorHandler;
    private statics;
    private viewPath;
    private entryRoute;
    private apiRoutes;
    private uiConfig;
    setBasePath(path: string): HapiAdapter;
    setStaticPath(staticsRoute: string, staticsPath: string): HapiAdapter;
    setViewsPath(viewPath: string): HapiAdapter;
    setErrorHandler(handler: (error: Error) => ControllerHandlerReturnType): this;
    setApiRoutes(routes: AppControllerRoute[]): HapiAdapter;
    setEntryRoute(routeDef: AppViewRoute): HapiAdapter;
    setQueues(bullBoardQueues: BullBoardQueues): HapiAdapter;
    setUIConfig(config?: UIConfig): HapiAdapter;
    registerPlugin(): PluginBase<any> & PluginPackage;
}
