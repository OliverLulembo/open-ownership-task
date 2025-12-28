export interface ParsedReference {
  type: 'task' | 'instance';
  id: string;
  original: string;
}

export function parseReferences(text: string): ParsedReference[] {
  const references: ParsedReference[] = [];
  
  // Match TASK-123 or INST-456 patterns (case insensitive)
  const taskPattern = /TASK-(\d+)/gi;
  const instancePattern = /INST-(\d+)/gi;
  
  let match;
  const processed = new Set<string>();
  
  while ((match = taskPattern.exec(text)) !== null) {
    const key = `${match[0]}-${match.index}`;
    if (!processed.has(key)) {
      references.push({
        type: 'task',
        id: match[1],
        original: match[0],
      });
      processed.add(key);
    }
  }
  
  while ((match = instancePattern.exec(text)) !== null) {
    const key = `${match[0]}-${match.index}`;
    if (!processed.has(key)) {
      references.push({
        type: 'instance',
        id: match[1],
        original: match[0],
      });
      processed.add(key);
    }
  }
  
  return references;
}

export function extractTaskIds(text: string): string[] {
  return parseReferences(text)
    .filter(ref => ref.type === 'task')
    .map(ref => ref.id);
}

export function extractInstanceIds(text: string): string[] {
  return parseReferences(text)
    .filter(ref => ref.type === 'instance')
    .map(ref => ref.id);
}

export function generateReferenceLink(type: 'task' | 'instance', id: string): string {
  return type === 'task' ? `TASK-${id}` : `INST-${id}`;
}

