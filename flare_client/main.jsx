import { Tabs, rem } from '@mantine/core';
import React from 'react';
import { IconPhoto, IconPlug, IconSettings } from '@tabler/icons-react';
import { SettingsUI } from './settings';
import { BoardUI } from './drawing-board';
import { PluginsUI } from './plugins';

export function FlareUI() {
    const iconStyle = { width: rem(12), height: rem(12) };

    return (
        <Tabs defaultValue="canvas">
            <Tabs.List style={{ height: 40 }} justify='center'>
                <Tabs.Tab value="canvas" leftSection={<IconPhoto style={iconStyle} />}>
                    Board
                </Tabs.Tab>
                <Tabs.Tab value="plugins" leftSection={<IconPlug style={iconStyle} />}>
                    Plugins
                </Tabs.Tab>
                <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
                    Settings
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="canvas">
                <BoardUI />
            </Tabs.Panel>

            <Tabs.Panel value="plugins">
                <PluginsUI />
            </Tabs.Panel>

            <Tabs.Panel value="settings">
                <SettingsUI />
            </Tabs.Panel>
        </Tabs>
    );
}