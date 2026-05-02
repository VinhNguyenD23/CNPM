import TextField, { TextFieldProps } from '@mui/material/TextField';

export function Select(props: TextFieldProps) {
  return <TextField select fullWidth size="small" {...props} />;
}
