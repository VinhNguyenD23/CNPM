import { DeployConfigFormValues, GenerateDeployConfigResponse } from '@/types/deploy-config';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function generateDeployConfig(
  values: DeployConfigFormValues,
): Promise<GenerateDeployConfigResponse> {
  const response = await fetch(`${API_URL}/deploy-config/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...values,
      port: Number(values.port),
      replicas: Number(values.replicas),
      healthCheck: values.healthCheck || undefined,
      env: values.env.filter((item) => item.key.trim()),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data.message?.message)
      ? data.message.message.join('\n')
      : data.message?.message ?? data.message ?? 'Generate config failed';
    throw new Error(message);
  }

  return data;
}
