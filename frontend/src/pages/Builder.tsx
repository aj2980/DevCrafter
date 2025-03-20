import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { FileExplorer } from '../components/FileExplorer';
import { StepsList } from '../components/StepsList';
import { FileNode, Step } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../../Config';
import { parseXml } from '../steps';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [files, setFiles] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'App.tsx',
          type: 'file',
          content: 'export default function App() {\n  return <div>Hello World</div>;\n}'
        },
        {
          name: 'components',
          type: 'folder',
          isOpen: false,
          children: []
        }
      ]
    }
  ]);

  const [steps, setSteps] = useState<Step[]>([]);

  const handleFileSelect = (content: string) => {
    setSelectedFileContent(content);
  };

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });

    const { prompts, uiPrompts } = response.data;


    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: 'user',
        content
      }))
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-gray-200 flex">
      {/* Sidebar - Steps List */}
      <div className="w-1/4 border-r border-gray-700 p-4 overflow-auto bg-gray-800">
        <h2 className="text-lg font-semibold mb-4">Steps</h2>
        <StepsList steps={steps} onStepClick={() => {}} />
      </div>

      {/* Sidebar - File Explorer */}
      <div className="w-1/4 border-r border-gray-700 p-4 overflow-auto bg-gray-800">
        <h2 className="text-lg font-semibold mb-4">File Explorer</h2>
        <FileExplorer files={files} onFileSelect={handleFileSelect} />
      </div>

      {/* Main Content - Editor & Preview */}
      <div className="w-1/2 flex flex-col bg-gray-900">
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-700 bg-gray-800 text-gray-300">
          <button
            className={`px-6 py-2 transition-all ${activeTab === 'code' ? 'bg-gray-700 text-white font-bold' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
          <button
            className={`px-6 py-2 transition-all ${activeTab === 'preview' ? 'bg-gray-700 text-white font-bold' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'code' ? (
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={selectedFileContent}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: true
              }}
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="h-full w-full bg-white p-4 rounded-lg shadow-lg overflow-auto">
              <iframe
                title="preview"
                className="w-full h-full border rounded-lg"
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <body>
                      <div id="root"></div>
                      <script type="module">
                        ${selectedFileContent}
                      </script>
                    </body>
                  </html>
                `}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
