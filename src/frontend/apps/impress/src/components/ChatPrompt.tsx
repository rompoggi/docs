import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import styled from 'styled-components';

import { Box } from './Box';
import { Icon } from './Icon';
import { Text } from './Text';

const ChatPromptContainer = styled(Box)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100vh;
`;

const OpenChatButton = styled.button`
  background: var(--cunningham-theme-primary-500);
  color: white;
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ChatWindow = styled(Box)`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled(Box)`
  padding: 1rem;
  background: var(--cunningham-theme-primary-500);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatDivider = styled.hr`
  border: none;
  border-top: 2px solid #ccc;
  margin: 0;
`;

const ChatMessages = styled(Box)`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled(Box)<{ sender: 'user' | 'assistant' }>`
  align-self: ${({ sender }) =>
    sender === 'user' ? 'flex-end' : 'flex-start'};
  background: ${({ sender }) => (sender === 'user' ? '#111' : '#fff')};
  color: ${({ sender }) => (sender === 'user' ? 'white' : 'black')};
  border-radius: 28px;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  max-width: 80%;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
`;

const ChatInput = styled(Box)`
  padding: 0.75rem;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  flex-direction: row;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: var(--cunningham-theme-primary-500);
  }
`;

const SendButton = styled.button`
  background: var(--cunningham-theme-primary-500);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

interface AlbertResponse {
  response?: string;
  error?: string;
}

export const ChatPrompt: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    void queryAlbert(inputValue).then((responseText) => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
      };
      setMessages((prev: Message[]) => [...prev, response]);
      setIsLoading(false);
    });
  };

  return (
    <ChatPromptContainer>
      <OpenChatButton onClick={() => setIsOpen(!isOpen)}>
        <Icon iconName={isOpen ? 'close' : 'chat'} />
      </OpenChatButton>

      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <Text color="white" $weight="bold">
              AI Assistant
            </Text>
          </ChatHeader>
          <ChatDivider />
          <ChatMessages>
            {messages.map((message: Message) => (
              <MessageBubble key={message.id} sender={message.sender}>
                <Text $color={message.sender === 'user' ? 'white' : 'black'}>
                  {message.text}
                </Text>
              </MessageBubble>
            ))}
          </ChatMessages>

          <ChatInput>
            <Input
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder="Type your message..."
              onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <SendButton onClick={() => handleSend()} disabled={isLoading}>
              <Icon iconName="send" color="white" />
            </SendButton>
          </ChatInput>
        </ChatWindow>
      )}
    </ChatPromptContainer>
  );
};

export async function queryAlbert(prompt: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    let data: AlbertResponse;
    try {
      data = (await response.json()) as AlbertResponse;
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return 'Error parsing response from Albert.';
    }
    return data.response || 'No response from Albert.';
  } catch (error) {
    console.error('Network error:', error);
    return 'Network error: Unable to reach Albert API.';
  }
}
