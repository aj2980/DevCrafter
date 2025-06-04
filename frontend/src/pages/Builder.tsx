import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../../Config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcontainer = useWebContainer();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    if (!webcontainer) return;

    let updatedFiles = JSON.parse(JSON.stringify(files)); // Deep copy to avoid mutating state
    let updateHappened = false;
    const executedScripts = new Set<number>();

    steps
      .filter(({ status }) => status === "pending")
      .forEach(step => {
        if (step.type === StepType.CreateFile && step.path) {
          updateHappened = true;
          const pathParts = step.path.split('/').filter(Boolean);
          let current = updatedFiles;

          // Navigate or create folder structure
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            let folder = current.find(f => f.name === folderName && f.type === 'folder');
            if (!folder) {
              folder = {
                name: folderName,
                type: 'folder',
                path: `/${pathParts.slice(0, i + 1).join('/')}`,
                children: []
              };
              current.push(folder);
            }
            current = folder.children || (folder.children = []);
          }

          // Add or update file
          const fileName = pathParts[pathParts.length - 1];
          const existingFileIndex = current.findIndex(f => f.name === fileName && f.type === 'file');
          if (existingFileIndex >= 0) {
            current[existingFileIndex].content = step.code || '';
            console.log(`Updated file: ${step.path}`);
          } else {
            current.push({
              name: fileName,
              type: 'file',
              path: step.path,
              content: step.code || ''
            });
            console.log(`Created file: ${step.path}`);
          }
        } else if (step.type === StepType.RunScript && step.code && !executedScripts.has(step.id)) {
          updateHappened = true;
          executedScripts.add(step.id);
          console.log(`Executing script: ${step.code}`);
          webcontainer.spawn('sh', ['-c', step.code]).then(process => {
            process.output.pipeTo(
              new WritableStream({
                write(data) {
                  console.log(`Script output: ${data}`);
                }
              })
            );
          }).catch(err => {
            console.error(`Script error: ${err}`);
            setError(`Failed to execute script: ${step.code}`);
          });
        }
      });

    if (updateHappened) {
      console.log('Updated Files:', updatedFiles);
      setFiles(updatedFiles);
      setSteps(steps.map(s => executedScripts.has(s.id) || s.type === StepType.CreateFile ? { ...s, status: 'completed' } : s));
    }
  }, [steps, files, webcontainer]);

  useEffect(() => {
    if (files.length > 0) {
      const appFile = files
        .flatMap(f => f.type === 'folder' && f.children ? f.children : f)
        .find(f => f.type === 'file' && f.path === 'src/App.tsx');
      if (appFile && (!selectedFile || selectedFile.path !== appFile.path)) {
        console.log('Selecting updated src/App.tsx');
        setSelectedFile(appFile);
      } else if (!selectedFile) {
        const firstFile = files.find(f => f.type === 'file') || files[0];
        setSelectedFile(firstFile);
      }
    }
  }, [files, selectedFile]);

  useEffect(() => {
    if (!webcontainer || files.length === 0) return;

    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem) => {
        const parts = file.path.split('/').filter(Boolean);
        let current = mountStructure;

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current[part]) {
            current[part] = { directory: {} };
          }
          current = current[part].directory;
        }

        const fileName = parts[parts.length - 1];
        if (file.type === 'file') {
          current[fileName] = {
            file: {
              contents: file.content || ''
            }
          };
        } else {
          current[fileName] = { directory: {} };
        }
      };

      files.forEach(file => processFile(file));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    console.log('Mount Structure:', mountStructure);
    webcontainer.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim()
      });
      setTemplateSet(true);

      const { prompts, uiPrompts } = response.data;
      const parsedUiPrompts = parseXml(uiPrompts[0] || '');
      console.log('Parsed UI Prompts:', parsedUiPrompts);
      setSteps(parsedUiPrompts.map((x: Step) => ({
        ...x,
        status: "pending"
      })));

      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      });

      console.log('Raw /chat Response:', stepsResponse.data);
      const responseContent = stepsResponse.data.message || stepsResponse.data;
      const parsedSteps = parseXml(responseContent);
      console.log('Parsed /chat Response:', parsedSteps);
      setSteps(s => [...s, ...parsedSteps.map(x => ({
        ...x,
        status: "pending"
      }))]);

      setLlmMessages([
        ...prompts.map(content => ({ role: "user" as const, content })),
        { role: "user" as const, content: prompt },
        { role: "assistant" as const, content: responseContent }
      ]);
    } catch (error) {
      console.error('Error initializing:', error);
      setError('Failed to initialize. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>
      <div className="flex-1 overflow-hidden">
        {loading || !templateSet ? (
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-400">
            {error}
          </div>
        ) : steps.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            No steps available. Try sending a prompt.
          </div>
        ) : (
          <div className="h-full grid grid-cols-4 gap-6 p-6">
            <div className="col-span-1 space-y-6 overflow-auto">
              <div>
                <div className="max-h-[75vh] overflow-scroll">
                  <StepsList steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
                </div>
                <div className="mt-4">
                  <div className="flex">
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="p-2 w-full bg-gray-800 text-gray-200 rounded"
                      placeholder="Enter your prompt..."
                    />
                    <button
                      onClick={async () => {
                        const newMessage = {
                          role: "user" as const,
                          content: userPrompt
                        };
                        setLoading(true);
                        try {
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages: [...llmMessages, newMessage]
                          });
                          console.log('Raw /chat Response (button):', stepsResponse.data);
                          const responseContent = stepsResponse.data.message || stepsResponse.data;
                          const parsedSteps = parseXml(responseContent);
                          console.log('Parsed /chat Response (button):', parsedSteps);
                          setLlmMessages(x => [
                            ...x,
                            newMessage,
                            { role: "assistant" as const, content: responseContent }
                          ]);
                          setSteps(s => [...s, ...parsedSteps.map(x => ({
                            ...x,
                            status: "pending"
                          }))]);
                        } catch (error) {
                          console.error('Error sending prompt:', error);
                          setError('Failed to process prompt. Please try again.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-purple-400 px-4 ml-2 rounded"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <FileExplorer files={files} onFileSelect={setSelectedFile} />
            </div>
            <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
              <TabView activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="h-[calc(100%-4rem)]">
                {activeTab === 'code' ? (
                  <CodeEditor file={selectedFile} />
                ) : (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}