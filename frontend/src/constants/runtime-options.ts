import { OutputType, Runtime } from '@/types/deploy-config';

export const runtimeOptions: { label: string; value: Runtime }[] = [
  { label: 'Node.js', value: 'node' },
  { label: 'Python', value: 'python' },
  { label: 'Go', value: 'go' },
];

export const outputTypeOptions: { label: string; value: OutputType }[] = [
  { label: 'JSON', value: 'json' },
  { label: 'docker-compose.yml', value: 'docker-compose' },
  { label: 'Docker Swarm compose', value: 'swarm-compose' },
];
