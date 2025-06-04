import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  async function updatePackageJson() {
    const packageJsonFile = files.find(f => f.path === 'package.json');
    if (!packageJsonFile) {
      throw new Error('package.json not found');
    }
    try {
      const packageJson = JSON.parse(packageJsonFile.content || '{}');
      const requiredDeps = ['lucide-react'];
      let updated = false;

      if (!packageJson.dependencies) {
        packageJson.dependencies = {};
      }
      requiredDeps.forEach(dep => {
        if (!packageJson.dependencies[dep]) {
          packageJson.dependencies[dep] = '^0.344.0';
          updated = true;
        }
      });

      if (updated) {
        console.log('Updating package.json with dependencies:', packageJson.dependencies);
        const updatedFiles = files.map(f =>
          f.path === 'package.json' ? { ...f, content: JSON.stringify(packageJson, null, 2) } : f
        );
        files.splice(0, files.length, ...updatedFiles);
      }
    } catch (err) {
      console.error('Failed to update package.json:', err);
    }
  }

  async function main() {
    try {
      setError(null);
      await updatePackageJson();

      if (!isInstalling) {
        console.log('Starting npm install...');
        setIsInstalling(true);
        const installProcess = await webContainer.spawn('npm', ['install']);

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log('npm install output:', data);
            }
          })
        );

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error('npm install failed');
        }
        console.log('npm install completed successfully');
      }

      console.log('Starting npm run dev...');
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);

      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log('npm run dev output:', data);
          }
        })
      );

      webContainer.on('server-ready', (port, url) => {
        console.log('Server ready:', { port, url });
        setUrl(url);
      });

      webContainer.on('error', ({ message }) => {
        console.error('WebContainer error:', message);
        setError(message);
      });
    } catch (err) {
      console.error('PreviewFrame error:', err);
      setError('Failed to start preview server. Check console for details.');
    }
  }

  useEffect(() => {
    if (webContainer && files.length > 0) {
      main();
    }
  }, [webContainer, files]);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {error ? (
        <div className="text-center text-red-400">
          <p>{error}</p>
        </div>
      ) : !url ? (
        <div className="text-center">
          <p className="mb-2">Loading preview...</p>
        </div>
      ) : (
        <iframe width="100%" height="100%" src={url} title="Preview" />
      )}
    </div>
  );
}