import FormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox, { CheckboxProps } from '@mui/material/Checkbox';

interface Props extends CheckboxProps {
  label: string;
}

export function Checkbox({ label, ...props }: Props) {
  return <FormControlLabel control={<MuiCheckbox {...props} />} label={label} />;
}
