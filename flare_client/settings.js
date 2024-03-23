import { createRoot } from 'react-dom/client';

import { Checkbox, Group, Paper, Text, Title, UnstyledButton } from '@mantine/core';
import classes from './styles.module.css';
import React, { useContext } from 'react';

import { FlareContext } from './data.jsx';

export function SettingsUI({ }) {
    const { settings, updateSettings } = useContext(FlareContext);

    return (
        <>
            <Group justify="center">
                <Title style={{ marginTop: 20 }} order={2}>Optimization</Title>
            </Group>
            <Group justify="center">
                <Paper style={{ width: 'calc(50% - 20px)', margin: '20px 10px 0 10px' }} shadow="xs" p="xs">
                    {Object.keys(settings).map(s => {
                        return (
                            <div key={s}>
                                {settings[s].type == 'boolean' &&
                                    <UnstyledButton onClick={() => updateSettings(s, !settings[s].value)} className={classes.checkButton}>
                                        <Checkbox
                                            checked={settings[s].value}
                                            onChange={() => { }}
                                            tabIndex={-1}
                                            size="sm"
                                            mr="sm"
                                        />

                                        <div>
                                            <Text size="18px" mb={7} lh={1}>
                                                {settings[s].title}
                                            </Text>
                                        </div>
                                    </UnstyledButton>
                                }
                            </div>
                        )
                    })}
                </Paper>
            </Group >
        </>
    );
};