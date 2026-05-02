'use client';

import { Control, Controller } from 'react-hook-form';
import { DeployConfigFormValues } from '@/types/deploy-config';
import { Checkbox } from '../ui/Checkbox';

interface Props {
  control: Control<DeployConfigFormValues>;
}

export function ServiceOptions({ control }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-ink">Optional services</h2>
      <p className="mb-2 text-sm text-slate-500">Enable supporting services in generated compose file.</p>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {(['redis', 'postgres', 'worker', 'haproxy'] as const).map((name) => (
          <Controller
            key={name}
            control={control}
            name={`services.${name}`}
            render={({ field }) => (
              <Checkbox
                label={name.toUpperCase()}
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            )}
          />
        ))}
      </div>
    </section>
  );
}
