import {
  fetchAuthStatus,
  loginAdmin,
  logoutAdmin,
  onUnauthorized,
} from "./api";

export const authState = $state({
  loading: true,
  required: false,
  authenticated: true,
});

onUnauthorized(() => {
  authState.required = true;
  authState.authenticated = false;
});

export async function initAuth(): Promise<void> {
  try {
    const status = await fetchAuthStatus();
    authState.required = status.required;
    authState.authenticated = status.authenticated;
  } catch {
    authState.required = false;
    authState.authenticated = true;
  } finally {
    authState.loading = false;
  }
}

export async function submitLogin(password: string): Promise<void> {
  const status = await loginAdmin(password);
  authState.required = status.required;
  authState.authenticated = status.authenticated;
}

export async function submitLogout(): Promise<void> {
  const status = await logoutAdmin();
  authState.required = status.required;
  authState.authenticated = status.authenticated;
}
