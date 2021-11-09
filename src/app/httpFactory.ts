import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthHttp } from './global-utils/services/authHttp.service'
import { IdleTimeoutService } from "./global-utils/services/idleTimeout.service";
import { SocketService } from "./global-utils/services/socket.service";

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, router: Router, idleTimeoutService: IdleTimeoutService, socketService: SocketService) {
        return new AuthHttp(backend, defaultOptions, router, idleTimeoutService, socketService);
}