import { Button, Container, Flex, Grid, GridCol, Image, Input, Loader, Modal, Paper, Table, Tabs, Text, Textarea, Tooltip, rem } from '@mantine/core';
import classes from './styles.module.css';
import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDisclosure } from '@mantine/hooks';
import { FlareContext, sendRequest } from './data.jsx';

const BoardChat = ({ messages }) => {
    const panelRef = useRef(null);

    const [opened, { open, close }] = useDisclosure(false);
    const [current, setCurrent] = useState(null);

    const fullScreen = message => {
        setCurrent(message);
        open();
    }

    useEffect(() => {
        if (panelRef.current) {
            panelRef.current.scrollTop = panelRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            {current && <Modal
                opened={opened}
                onClose={close}
                title="Generated image"
                size="auto"
                radius={0}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Grid columns={12}>
                    <Grid.Col span={8}>
                        <Image radius="md" src={current.src} />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <span style={{ wordBreak: 'break-all' }}>
                            {JSON.stringify(current)}
                        </span>
                    </Grid.Col>
                </Grid>

            </Modal>}

            <Paper ref={panelRef} style={{ width: '100%', overflowY: 'scroll', minHeight: '100%', paddingBottom: 100, background: 'white' }}>
                <Container style={{ borderRadius: 10, minWidth: '60%', marginLeft: '20%', display: 'table', minHeight: 'calc(100% + -5px)', marginTop: 5 }}>
                    {messages.map(message => (
                        <div key={message.id}>
                            {message.type == 'input' &&
                                <div className={classes.inputContent}>
                                    <Tooltip multiline label={JSON.stringify(message.data)} position="top" offset={5}>
                                        <span className={classes.messageInfo}>?</span>
                                    </Tooltip>
                                    <span className={classes.messageText}>{message.content}</span>
                                </div>
                            }
                            {message.type == 'output' &&
                                <div className={classes.outputContent}>
                                    <Tooltip multiline label={JSON.stringify(message.data)} position="top" offset={5}>
                                        <span className={classes.messageInfo}>?</span>
                                    </Tooltip>
                                    <span className={classes.messageText}>{message.content}</span>
                                </div>}

                            {message.type == 'image' &&
                                <div className={classes.outputImage}>
                                    <Tooltip multiline label={JSON.stringify(message.data)} position="top" offset={5}>
                                        <span className={classes.messageInfo}>?</span>
                                    </Tooltip>
                                    <a href={`client/images/${message.image}`} target='_blank' title={message.content}>
                                        <Image radius="md" src={`client/images/${message.image}`} fit="contain" />
                                    </a>
                                </div>}

                            {message.type == 'loader' &&
                                <div className={classes.outputLoader}>
                                    <Loader color="gray" size="lg" type="dots" />
                                </div>
                            }
                        </div>
                    ))}
                </Container>
            </Paper>
        </>
    );
};

const BoardPrompt = ({ onSendPrompt }) => {
    const [message, setMessage] = useState({ id: uuidv4(), type: 'input', content: 'Girl on the summer beach with a cat, plane in the sky', image: '', data: {} });

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
            event.preventDefault();
        }
    };

    const handleMessageChange = (event) => {
        setMessage({ ...message, ...{ content: event.target.value } });
    };

    const handleSendMessage = () => {
        if (message.content.trim() !== '') {
            onSendPrompt(message);
            setMessage({ id: uuidv4(), type: 'input', content: '', image: '', data: {} });
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: 0, left: 3, height: 100, width: 'calc(100% - 20px)', padding: 5, backgroundColor: 'white', display: 'flex' }}>
            <Textarea autosize minRows={3} maxRows={3} className={classes.flarePrompt} onChange={handleMessageChange} value={message.content}
                onKeyDown={handleKeyDown}
                style={{ width: 'calc(60% - 100px)', height: '80px', marginRight: '10px', marginLeft: 'calc(20% + -5px)' }}
                placeholder="Prompt"
            ></Textarea>
            <Button onClick={handleSendMessage} disabled={message.content.trim() === ''} style={{ height: 80, width: 100 }}>Send</Button>
        </div>
    );
};

export function BoardUI() {
    const { settings, defaultOps } = useContext(FlareContext);

    const [history, setHistory] = useState([]);
    const [messages, setMessages] = useState([{
        id: uuidv4(), type: 'output', content: 'Hey, nothing drawn so far 🙂 Make a request!', image: '', data: {}
    }]);

    const sendPrompt = async message => {
        setMessages(m => [...m, ...[message, { id: uuidv4(), type: 'loader', content: '', image: '', data: {} }]]);

        const response = await sendRequest({
            message, settings, defaultOps, history
        });

        const { outputPrompt, outputImage, error } = response;

        let newMessage = { id: uuidv4(), type: 'image', content: outputPrompt, image: outputImage, data: {} };
        if (!!error) {
            newMessage.type = 'output';
            newMessage.content = error;
        } else {
            setHistory(h => [...h, { prompt: outputPrompt, image: outputImage }]);
            newMessage.data = { prompt: outputPrompt, image: outputImage };
        }

        setMessages(m => [...m.filter(_ => _.type !== 'loader'), ...[newMessage]]);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: 0, width: '100%', height: 'calc(100vh - 40px)' }}>
                <BoardChat messages={messages} />
                <BoardPrompt onSendPrompt={sendPrompt} />
            </div>
        </>
    );
}