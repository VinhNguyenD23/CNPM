'use client';

import MenuItem from '@mui/material/MenuItem';
import { Control, Controller } from 'react-hook-form';
import { outputTypeOptions } from '@/constants/runtime-options';
import { DeployConfigFormValues } from '@/types/deploy-config';
import { Select } from '../ui/Select';

interface Props {
  control: Control<DeployConfigFormValues>;
}

export function OutputTypeSelect({ control }: Props) {
  return (
    <Controller
      control={control}
      name="outputType"
      render={({ field }) => (
        <Select label="Output type" {...field}>
          {outputTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
}
