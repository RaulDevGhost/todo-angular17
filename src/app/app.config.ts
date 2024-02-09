import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {KeycloakService} from "keycloak-angular";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), {
    provide: APP_INITIALIZER,
    useFactory: initKeycloak,
    multi: true,
    deps: [KeycloakService]
  },
    KeycloakService
  ],
};

function initKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init({
    config: {
      url: 'http://localhost:8080',
      realm: 'master',
      clientId: 'test-client'
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin
        + '/assets/silent-check-sso.html'
    },
  });
}
