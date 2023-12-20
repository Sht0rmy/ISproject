import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect, {SelectChangeEvent} from '@mui/material/Select';
import React, {memo} from 'react';

export interface SelectProps {
    id: string;
    label: string | React.ReactNode;
    value: string;
    onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
    children: React.ReactNode;
    fullWidth?: boolean;
    margin?: 'dense' | 'none' | 'normal';
    required?: boolean;
    disabled?: boolean;
}

const Select = ({
                    id,
                    label,
                    value,
                    onChange,
                    children,
                    fullWidth,
                    required,
                    margin = 'dense',
                    disabled = false,
                    ...props
                }: SelectProps) => {
    return (
        <FormControl fullWidth={fullWidth} margin={margin} {...props}>
            <InputLabel id={`${id}-label`} required={required}>
                {label}
            </InputLabel>

            <MuiSelect
                labelId={`${id}-label`}
                id={id}
                label={label as string}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                sx={{width: '300px', height: '50px'}}
            >
                {children}
            </MuiSelect>
        </FormControl>
    );
};

export default memo(Select);
