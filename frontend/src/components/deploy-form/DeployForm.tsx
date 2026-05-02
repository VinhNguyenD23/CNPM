'use client';

import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { runtimeOptions } from '@/constants/runtime-options';
import { generateDeployConfig } from '@/lib/api';
import { DeployConfigFormValues, GenerateDeployConfigResponse } from '@/types/deploy-config';
import { ConfigPreview } from '../preview/ConfigPreview';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { EnvVariableInput } from './EnvVariableInput';
import { OutputTypeSelect } from './OutputTypeSelect';
import { ServiceOptions } from './ServiceOptions';

const defaultValues: DeployConfigFormValues = {
  appName: 'cindy-backend',
  runtime: 'node',
  image: 'cindy-backend:latest',
  port: 3000,
  replicas: 3,
  healthCheck: '/health',
  env: [
    { key: 'NODE_ENV', value: 'production' },
    { key: 'DATABASE_URL', value: 'postgresql://user:pass@postgres:5432/app' },
  ],
  services: {
    redis: true,
    postgres: true,
    worker: true,
    haproxy: false,
  },
  outputType: 'docker-compose',
};

export function DeployForm() {
  const [result, setResult] = useState<GenerateDeployConfigResponse>();
  const [error, setError] = useState<string>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeployConfigFormValues>({ defaultValues });

  async function onSubmit(values: DeployConfigFormValues) {
    setError(undefined);
    try {
      setResult(await generateDeployConfig(values));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generate config failed');
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,560px)_1fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-100">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Builder Pattern Demo</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">Deployment Config Generator</h1>
            <p className="mt-2 text-sm text-slate-500">
              Fill service options, generate JSON, docker-compose.yml, or Docker Swarm compose.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="appName"
              rules={{ required: 'App name is required', pattern: /^[a-zA-Z][a-zA-Z0-9-_]*$/ }}
              render={({ field }) => (
                <Input
                  label="App Name"
                  error={Boolean(errors.appName)}
                  helperText={errors.appName?.message ?? ' '}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="runtime"
              render={({ field }) => (
                <Select label="Runtime" {...field}>
                  {runtimeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              control={control}
              name="image"
              rules={{ required: 'Image name is required' }}
              render={({ field }) => (
                <Input label="Image name" error={Boolean(errors.image)} helperText={errors.image?.message ?? ' '} {...field} />
              )}
            />
            <Controller
              control={control}
              name="port"
              rules={{ required: 'Port is required', min: 1, max: 65535 }}
              render={({ field }) => (
                <Input
                  label="Port"
                  type="number"
                  error={Boolean(errors.port)}
                  helperText={errors.port ? 'Port must be 1-65535' : ' '}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="replicas"
              rules={{ required: 'Replicas is required', min: 1, max: 50 }}
              render={({ field }) => (
                <Input
                  label="Replicas"
                  type="number"
                  error={Boolean(errors.replicas)}
                  helperText={errors.replicas ? 'Replicas must be 1-50' : ' '}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="healthCheck"
              rules={{ pattern: /^\/[-a-zA-Z0-9/_]*$/ }}
              render={({ field }) => (
                <Input
                  label="Health check path"
                  error={Boolean(errors.healthCheck)}
                  helperText={errors.healthCheck ? 'Path must start with /' : ' '}
                  {...field}
                />
              )}
            />
          </div>
        </section>

        <EnvVariableInput control={control} errors={errors} />
        <ServiceOptions control={control} />

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <OutputTypeSelect control={control} />
        </section>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Button type="submit" size="large" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Generate Config'}
        </Button>
      </form>

      <ConfigPreview result={result} />
    </div>
  );
}
