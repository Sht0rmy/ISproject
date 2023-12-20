import React from 'react';
import { Box, Typography } from '@mui/material';


export default function EmptyPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
            }}
        >
            <Typography variant="h3" style={{ color: 'white' }}>
                Сторінка порожня!
            </Typography>
        </Box>
    );
}