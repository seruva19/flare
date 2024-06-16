import { useState, useEffect, createContext } from "react";
import React from 'react';

export const FlareContext = createContext({ modules: {}, settings: {}, availableOps: {}, defaultOps: {}, updateSettings: (k, v) => { }, updateOps: (k, v) => { } });

export const FlareProvider = ({ children }) => {
  const [env, setEnv] = useState({ modules: {}, settings: {}, availableOps: {}, defaultOps: {} });

  useEffect(() => {
    (async () => {
      const response = await fetch('/environment');
      const data = await response.json();

      const { modules, settings, initOps } = JSON.parse(data);
      const availableOps = modulesToOps(modules);

      setEnv({ modules, settings, availableOps, defaultOps: defaultOperations(availableOps, initOps) });
    })();
  }, []);

  const updateSettings = async (key, value) => {
    setEnv(prevEnv => ({
      ...prevEnv,
      settings: { ...prevEnv.settings, ...{ [key]: { ...prevEnv.settings[key], ...{ value } } } }
    }));
  }

  const updateOps = async (key, value) => {
    setEnv(prevEnv => ({
      ...prevEnv,
      defaultOps: { ...prevEnv.defaultOps, ...{ [key]: value } }
    }));
  }

  return (
    <FlareContext.Provider value={{ ...env, updateSettings, updateOps }}>{children}</FlareContext.Provider>
  );
};

const defaultOperations = (availableOps, defaultOps) => {
  const selectedOps = {};
  Object.keys(availableOps).forEach(op => {
    selectedOps[op] = defaultOps?.[op] ?? availableOps[op][0];
  });

  return selectedOps;
}

export const modulesToOps = modules => {
  const ops = {};
  for (const key in modules) {
    const valueList = modules[key];
    valueList.forEach(value => {
      if (!ops[value]) {
        ops[value] = [];
      }

      ops[value].push(key);
    });
  }

  const sortedOpsKeys = Object.keys(ops).sort();
  const sortedOps = {};
  sortedOpsKeys.forEach(key => {
    sortedOps[key] = ops[key];
  });

  return sortedOps;
}

export const sendRequest = async input => {
  const { message: { content: prompt }, settings, defaultOps, history } = input;
  let lastPrompt = history.length ? history[history.length - 1].prompt : ''
  let lastImage = history.length ? history[history.length - 1].image : ''

  const transformedRequest = {
    prompt,
    lastPrompt,
    lastImage,
    ops: defaultOps,
    settings: Object.entries(settings).reduce((acc, [key, value]) => {
      acc[key] = value.value;
      return acc;
    }, {})
  }

  console.info('sending request: ', transformedRequest);

  const response = await fetch('/flare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transformedRequest)
  });

  let outputPrompt = '';
  let outputImage = '';
  let error = undefined;

  if (response.ok) {
    const data = await response.json();
    if (data.error) {
      error = `Sorry, error occured 😔 (${data.error})`;
    } else {
      outputPrompt = data.outPrompt;
      outputImage = data.image;
    }

  } else {
    error = 'Sorry, unknown error occured 😔';
  }

  return { outputPrompt, outputImage, error };
};
