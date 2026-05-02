'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Control, Controller, FieldErrors, useFieldArray } from 'react-hook-form';
import { DeployConfigFormValues } from '@/types/deploy-config';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Props {
  control: Control<DeployConfigFormValues>;
  errors: FieldErrors<DeployConfigFormValues>;
}

export function EnvVariableInput({ control, errors }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'env' });

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Environment variables</h2>
          <p className="text-sm text-slate-500">Key/value pairs passed to app and worker.</p>
        </div>
        <Button size="small" startIcon={<AddIcon />} onClick={() => append({ key: '', value: '' })} type="button">
          Add env
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3">
            <Controller
              control={control}
              name={`env.${index}.key`}
              rules={{ pattern: /^[A-Z_][A-Z0-9_]*$/i }}
              render={({ field }) => (
                <Input
                  label="Key"
                  placeholder="NODE_ENV"
                  error={Boolean(errors.env?.[index]?.key)}
                  helperText={errors.env?.[index]?.key ? 'Use letters, numbers, underscore' : ' '}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name={`env.${index}.value`}
              render={({ field }) => <Input label="Value" placeholder="production" helperText=" " {...field} />}
            />
            <IconButton aria-label="Remove env" onClick={() => remove(index)} disabled={fields.length === 1}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </section>
  );
}
