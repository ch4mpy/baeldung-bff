import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};

export const reverseProxyUri = 'https://localhost:7080';
export const baseUri = `${reverseProxyUri}/angular-ui/`;
