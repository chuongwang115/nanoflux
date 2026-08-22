import { md5Hex } from "./utils/hash";
import {
  getFeverState,
  loadAppConfig,
  updateFeverState,
  type FeverConfig,
} from "./config";

export type { FeverConfig };

export type FeverPublicConfig = {
  enabled: boolean;
  user: string;
  hasPassword: boolean;
};

export function getFeverPublicConfig(): FeverPublicConfig {
  const { enabled, user, password } = getFeverState();
  return {
    enabled,
    user,
    hasPassword: password.length > 0,
  };
}

export function isFeverEnabled(): boolean {
  return getFeverState().enabled;
}

export function getFeverApiKey(): string | null {
  const { enabled, user, password } = getFeverState();
  if (!enabled || !user.trim() || !password) {
    return null;
  }
  return md5Hex(`${user.trim()}:${password}`);
}

export async function loadFeverConfig(): Promise<void> {
  await loadAppConfig();
}

export async function updateFeverConfig(partial: {
  enabled?: boolean;
  user?: string;
  password?: string;
}): Promise<FeverPublicConfig> {
  await updateFeverState(partial);
  return getFeverPublicConfig();
}
