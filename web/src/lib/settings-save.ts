export const SETTINGS_SAVE_KEY = Symbol("settingsSave");

export type SettingsSaveHost = {
  register: (handler: (() => Promise<void>) | undefined) => void;
  saveBeforeLeave: () => Promise<void>;
};

let leaveHandler: (() => Promise<void>) | undefined;

export async function saveSettingsBeforeLeave(): Promise<void> {
  await leaveHandler?.();
}

export function createSettingsSaveHost(): SettingsSaveHost {
  return {
    register(next) {
      leaveHandler = next;
    },
    saveBeforeLeave: saveSettingsBeforeLeave,
  };
}
