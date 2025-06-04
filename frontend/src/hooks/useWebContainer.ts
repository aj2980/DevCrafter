import { useState, useEffect } from 'react';
import { WebContainer } from '@webcontainer/api';

let webContainerInstance: WebContainer | null = null;

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

    useEffect(() => {
        async function main() {
            if (!webContainerInstance) {
                webContainerInstance = await WebContainer.boot();
            }
            setWebcontainer(webContainerInstance);
        }

        main();

        return () => {
            // Optionally, you can add cleanup logic here if needed
        };
    }, []);

    return webcontainer;
}