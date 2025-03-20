import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { FileNode } from '../types';

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (content: string) => void;
  onToggleFolder: (path: string[]) => void;
}

const FileExplorerItem: React.FC<{
  node: FileNode;
  path: string[];
  onFileSelect: (content: string) => void;
  onToggleFolder: (path: string[]) => void;
}> = ({ node, path, onFileSelect, onToggleFolder }) => {
  const isFolder = node.type === 'folder';
  const currentPath = [...path, node.name];

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer"
        onClick={() => {
          if (isFolder) {
            onToggleFolder(currentPath);
          } else if (node.content) {
            onFileSelect(node.content);
          }
        }}
      >
        <span className="w-4">
          {isFolder && (node.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </span>
        {isFolder ? <Folder size={16} /> : <FileText size={16} />}
        <span className="text-sm">{node.name}</span>
      </div>
      {isFolder && node.isOpen && node.children && (
        <div className="ml-4">
          {node.children.map((child, index) => (
            <FileExplorerItem
              key={index}
              node={child}
              path={currentPath}
              onFileSelect={onFileSelect}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
  onToggleFolder,
}) => {
  return (
    <div className="h-full bg-gray-800 text-gray-200 overflow-y-auto">
      {files.map((file, index) => (
        <FileExplorerItem
          key={index}
          node={file}
          path={[]}
          onFileSelect={onFileSelect}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </div>
  );
};