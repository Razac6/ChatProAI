import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import axios from 'axios';

function Hello() {
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const env = await window.electron.getEnvironmentVariables();
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: inputValue }],
          max_tokens: 100,
          temperature: 0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line prettier/prettier
            Authorization: `Bearer ${env.BASE_URL}`
          },
        }
      );
      const { data } = response;
      setResponseMessage(data.choices[0].message.content);
      setInputValue('');
      console.log(response.data); // Możesz dostosować tę linię w zależności od oczekiwanej odpowiedzi z serwera
      setInputValue(''); // Czyścimy wartość pola wejściowego po wysłaniu
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            width: 500,
            maxWidth: '100%',
          }}
        >
          <TextField
            fullWidth
            label="Zadaj mi pytanie"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
          />
        </Box>
        {responseMessage && <p>AI: {responseMessage}</p>}
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
