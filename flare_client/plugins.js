import { Group, Paper, Radio, Stack, Title, createTheme } from '@mantine/core';
import React from 'react';
import { useContext } from "react";
import { FlareContext } from "./data.jsx";

export function PluginsUI() {
    const { availableOps, defaultOps, updateOps } = useContext(FlareContext);

    return (
        <>
            <Group justify="center">
                <Title style={{ marginTop: 20 }} order={2}>Modules</Title>
            </Group>
            <Group justify="center">
                <Paper style={{ width: 'calc(50% - 20px)', margin: '20px 10px 0 10px' }} shadow="xs" p="xl">
                    <Stack>
                        {Object.keys(availableOps).map(k => {
                            return (
                                <div key={k}>
                                    <Radio.Group name={k} value={defaultOps[k]}>
                                        <div>
                                            Operation: <span style={{ fontWeight: 'bold' }}>{k}</span>
                                        </div>
                                        <Group>
                                            {availableOps[k].map(v => {
                                                return <div style={{ marginTop: 10 }} key={v}>
                                                    <Radio value={v} label={v} style={{ cursor: 'pointer' }} onChange={(event) => updateOps(k, v)} />
                                                </div>
                                            })}
                                        </Group>
                                    </Radio.Group>
                                </div>
                            )
                        })}
                    </Stack>
                </Paper>
            </Group>
        </>
    );
};