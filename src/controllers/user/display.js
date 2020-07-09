import DisplaySettings from 'displaySettings';
import * as userSettings from 'userSettings';
import autoFocuser from 'autoFocuser';

/* eslint-disable indent */

    // Shortcuts
    const UserSettings = userSettings.UserSettings;

    export default function (view, params) {
        function onBeforeUnload(e) {
            if (hasChanges) {
                e.returnValue = 'You currently have unsaved changes. Are you sure you wish to leave?';
            }
        }

        var settingsInstance;
        var hasChanges;
        var userId = params.userId || ApiClient.getCurrentUserId();
        var currentSettings = userId === ApiClient.getCurrentUserId() ? userSettings : new UserSettings();
        view.addEventListener('viewshow', function () {
            window.addEventListener('beforeunload', onBeforeUnload);

            if (settingsInstance) {
                settingsInstance.loadData();
            } else {
                settingsInstance = new DisplaySettings({
                    serverId: ApiClient.serverId(),
                    userId: userId,
                    element: view.querySelector('.settingsContainer'),
                    userSettings: currentSettings,
                    enableSaveButton: true,
                    enableSaveConfirmation: true,
                    autoFocus: autoFocuser.isEnabled()
                });
            }
        });
        view.addEventListener('change', function () {
            hasChanges = true;
        });
        view.addEventListener('viewbeforehide', function () {
            window.removeEventListener('beforeunload', onBeforeUnload);
            hasChanges = false;

            if (settingsInstance) {
                settingsInstance.submit();
            }
        });
        view.addEventListener('viewdestroy', function () {
            if (settingsInstance) {
                settingsInstance.destroy();
                settingsInstance = null;
            }
        });
    }

/* eslint-enable indent */
