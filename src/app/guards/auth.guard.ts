import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {inject} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean> => {
  const keycloak = inject(KeycloakService);
  const isLogged = await keycloak.isLoggedIn();

  if (!isLogged) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
    });
    return false;
  }
  return true;
};
