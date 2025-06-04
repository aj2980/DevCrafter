import { Step, StepType } from './types';

// Global stepId counter to ensure unique IDs
let globalStepId = 1;

export function parseXml(response: string | undefined): Step[] {
  if (!response || typeof response !== 'string' || response.trim() === '') {
    console.warn('Invalid or empty response:', response);
    return [{
      id: globalStepId++,
      title: 'Error Response',
      description: 'Received an invalid or empty response',
      type: StepType.CreateFile,
      status: 'pending',
      code: String(response || 'No content'),
      path: '/error.txt'
    }];
  }

  // Extract <boltArtifact> section
  const boltArtifactMatch = /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/i.exec(response);
  const xmlContent = boltArtifactMatch ? boltArtifactMatch[0] : response; // Use full match to include tags
  console.log('Extracted XML Content:', xmlContent);

  const steps: Step[] = [];

  // Extract artifact title
  const titleMatch = /title="([^"]*)"/i.exec(response);
  const artifactTitle = titleMatch?.[1] || 'Project Files';

  // Add initial artifact step
  steps.push({
    id: globalStepId++,
    title: artifactTitle,
    description: '',
    type: StepType.CreateFolder,
    status: 'pending'
  });

  // Parse boltAction tags
  const actionRegex = /<boltAction\s+type\s*=\s*"([^"]*)"(?:\s+filePath\s*=\s*"([^"]*)")?\s*>([\s\S]*?)<\/boltAction>/gi;
  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const type = match[1]?.toLowerCase();
    const filePath = match[2];
    const content = match[3]?.trim() || '';

    if (!type) {
      console.warn('Skipping invalid boltAction with missing type:', match[0]);
      continue;
    }

    if (type === 'file') {
      steps.push({
        id: globalStepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: StepType.CreateFile,
        status: 'pending',
        code: content,
        path: filePath || `/unnamed-${globalStepId}.txt`
      });
    } else if (type === 'shell') {
      steps.push({
        id: globalStepId++,
        title: 'Run command',
        description: '',
        type: StepType.RunScript,
        status: 'pending',
        code: content
      });
    }
  }

  // Fallback for non-XML or malformed responses
  if (steps.length === 1 && !xmlContent.includes('<boltAction')) {
    steps.push({
      id: globalStepId++,
      title: 'Generated Content',
      description: 'Non-XML response captured',
      type: StepType.CreateFile,
      status: 'pending',
      code: response,
      path: '/generated.txt'
    });
  }

  console.log('Parsed Steps:', steps);
  return steps;
}