import React from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { FlareUI } from './main.jsx';
import { FlareProvider } from './data.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
const theme = createTheme({
    cursorType: 'pointer',
});

root.render(
    <FlareProvider>
        <MantineProvider theme={theme}>
            <FlareUI />
        </MantineProvider>
    </FlareProvider>
);
