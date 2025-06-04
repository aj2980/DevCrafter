import { Step, StepType } from './types';

/*
 * Parse input XML and convert it into steps.
 * Eg: Input - 
 * <boltArtifact id=\"project-import\" title=\"Project Files\">
 *  <boltAction type=\"file\" filePath=\"eslint.config.js\">
 *      import js from '@eslint/js';\nimport globals from 'globals';\n
 *  </boltAction>
 * <boltAction type="shell">
 *      node index.js
 * </boltAction>
 * </boltArtifact>
 * 
 * Output - 
 * [{
 *      title: "Project Files",
 *      status: "Pending"
 * }, {
 *      title: "Create eslint.config.js",
 *      type: StepType.CreateFile,
 *      code: "import js from '@eslint/js';\nimport globals from 'globals';\n"
 * }, {
 *      title: "Run command",
 *      code: "node index.js",
 *      type: StepType.RunScript
 * }]
 * 
 * The input can have strings in the middle they need to be ignored
 */
export function parseXml(response: string): Step[] {
  if (!response || typeof response !== 'string') {
      return [];
  }

  // Try to extract XML content - be more permissive with tag matching
  const xmlMatch = /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/i.exec(response);
  const xmlContent = xmlMatch?.[1] || response; // Fallback to using entire response if no tags found

  const steps: Step[] = [];
  let stepId = 1;

  // Extract artifact title with fallback
  const titleMatch = /title="([^"]*)"/i.exec(response);
  const artifactTitle = titleMatch?.[1] || 'Project Files';

  // Add initial artifact step
  steps.push({
      id: stepId++,
      title: artifactTitle,
      description: '',
      type: StepType.CreateFolder,
      status: 'pending'
  });

  // More resilient action parsing
  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/gi;
  
  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
      const type = match[1]?.toLowerCase();
      const filePath = match[2];
      const content = match[3]?.trim() || '';

      if (!type) continue;

      if (type === 'file') {
          steps.push({
              id: stepId++,
              title: `Create ${filePath || 'file'}`,
              description: '',
              type: StepType.CreateFile,
              status: 'pending',
              code: content,
              path: filePath
          });
      } else if (type === 'shell') {
          steps.push({
              id: stepId++,
              title: 'Run command',
              description: '',
              type: StepType.RunScript,
              status: 'pending',
              code: content
          });
      }
  }

  return steps;
}