import {invoke} from '@tauri-apps/api'
import {moveWindow, Position} from "tauri-plugin-positioner-api";
import {register, isRegistered} from '@tauri-apps/api/globalShortcut';
import {appWindow} from "@tauri-apps/api/window";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { ref, onMounted } from 'vue'

export function useAppSetup() {

    const msgResponse = ref('')
    const isControlAltKRegistered = ref('')

    moveWindow(Position.TopRight);

    const isFistLoad = localStorage.getItem('isFirstLoad');
    localStorage.setItem('isOpen', true);

    if(isFistLoad === null) {
        localStorage.setItem('isFirstLoad', false);

        appWindow.hide();
        localStorage.setItem('isOpen', false);
        console.log('First load');
    }

    onMounted(async () => {
        try {
            msgResponse.value = await invoke('greet', {name: 'World'});
        } catch (error) {
            console.error(error);
        }

        isControlAltKRegistered.value = await isRegistered('CommandOrControl+Alt+K');

        if (!isControlAltKRegistered.value) {
            await register('CommandOrControl+Alt+K', async () => {
                isControlAltKRegistered.value = await isRegistered('CommandOrControl+Alt+K');

                const isOpen = localStorage.getItem('isOpen');

                console.log('isOpen', isOpen);
                // if (isOpen === 'true') {
                //   appWindow.hide();
                localStorage.setItem('isOpen', false);
                // } else {
                localStorage.setItem('isOpen', true);
                //   appWindow.show();
                //   moveWindow(Position.TopRight);
                // }

                sendNotification({ title: 'TIME\'S UP!', body: 'Tauri is awesome!', sound: 'default' });
            });
        }

        let permissionGranted = await isPermissionGranted();

        console.log('permissionGranted', permissionGranted);
        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
        }

        if (permissionGranted) {
            sendNotification('Tauri is awesome!');
            sendNotification({ title: 'TAURI', body: 'Tauri is awesome!', sound: 'purr' });
        }
    });
    return { isControlAltKRegistered, msgResponse }
}