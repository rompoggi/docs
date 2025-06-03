import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Box } from './Box';
import { Icon } from './Icon';
import { Text } from './Text';

const ChatPromptContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 1rem;
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

const OpenMoodleButton = styled.button`
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
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MoodleWindow = styled(Box)`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 380px;
  height: 300px;
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

const MoodleDivider = styled.hr`
  border: none;
  border-top: 2px solid orange;
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

const UpdateMoodleButton = styled.button`
  background: var(--cunningham-theme-primary-500);
  color: orange;
  border: none;
  border-radius: 20px;
  width: calc(50% - 0.25rem);
  height: 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const RefreshMoodleButton = styled.button`
  background: var(--cunningham-theme-primary-500);
  color: red;
  border: none;
  border-radius: 20px;
  width: calc(50% - 0.25rem);
  height: 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const ButtonRow = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div<{ visible: boolean }>`
  position: absolute;
  right: calc(4rem + 1.5rem - (var(--message-width) / 2));
  bottom: 3.8rem;
  color: green;
  font-size: 0.95rem;
  background: white;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
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
  const [isMoodleOpen, setIsMoodleOpen] = useState(false);
  const [moodleUsername, setMoodleUsername] = useState('');
  const [moodleSession, setMoodleSession] = useState('');
  const [moodlePassword, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const successMessageRef = React.useRef<HTMLDivElement>(null);

  // Listen for the custom event to open chat and set input
  React.useEffect(() => {
    const handler = (e: CustomEvent<{ text: string }>) => {
      setIsOpen(true);
      setInputValue(e.detail.text || '');
      // Wait for inputValue to be set, then send the message
      setTimeout(() => {
        // Only send if text is not empty
        if ((e.detail.text || '').trim()) {
          handleSend(e.detail.text || '');
        }
      }, 0);
    };
    window.addEventListener('open-chat-with-input', handler as EventListener);
    return () => {
      window.removeEventListener(
        'open-chat-with-input',
        handler as EventListener,
      );
    };
  }, []);

  // Keyboard shortcut: Ctrl+i to toggle chat, Ctrl+m to toggle moodle, Esc to close
  useEffect(() => {
    const handleKeyDown = (event: Event) => {
      const e = event as unknown as KeyboardEvent;
      // Ctrl+i or Cmd+i toggles chat
      if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) setIsMoodleOpen(false);
          return !prev;
        });
      }
      // Ctrl+m or Cmd+m toggles moodle
      if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setIsMoodleOpen((prev) => {
          if (!prev) setIsOpen(false);
          return !prev;
        });
      }
      // Esc closes chat and moodle
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMoodleOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown as EventListener);
    return () => {
      window.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, []);

  // Accept an optional override value for sending (for programmatic send)
  const handleSend = (overrideValue?: string) => {
    const valueToSend = overrideValue !== undefined ? overrideValue : inputValue;
    if (!valueToSend.trim() || isLoading) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: valueToSend,
      sender: 'user',
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    void queryAlbert(valueToSend).then((responseText) => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
      };
      setMessages((prev: Message[]) => [...prev, response]);
      setIsLoading(false);
    });
  };

  const handleMoodleConnect = async (isUpdate: boolean) => {
    if (!moodleUsername || !moodleSession || !moodlePassword) {
      console.error('Moodle credentials are incomplete');
      return;
    }

    try {
      const result = await handleMoodle({
        username: moodleUsername,
        session: moodleSession,
        password: moodlePassword,
        isUpdate: isUpdate,
      });
      console.log('Moodle connection successful:', result);
      setIsMoodleOpen(false);
      setSuccessMessage(isUpdate ? 'Updated!' : 'Refreshed!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Moodle connection error:', error);
    }
  };

  useEffect(() => {
    if (successMessageRef.current) {
      const messageWidth = successMessageRef.current.offsetWidth;
      successMessageRef.current.style.setProperty(
        '--message-width',
        `${messageWidth}px`,
      );
    }
  }, [successMessage, showSuccess]);

  return (
    <ChatPromptContainer>
      {successMessage && (
        <SuccessMessage visible={showSuccess} ref={successMessageRef}>
          {successMessage}
        </SuccessMessage>
      )}
      <OpenMoodleButton
        onClick={() => {
          if (isMoodleOpen) {
            setIsMoodleOpen(false);
          } else {
            setIsMoodleOpen(true);
            setIsOpen(false);
          }
        }}
      >
        <Icon iconName={isMoodleOpen ? 'close' : 'moodle'} />
      </OpenMoodleButton>

      <OpenChatButton
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
            setIsMoodleOpen(false);
          }
        }}
      >
        <Icon iconName={isOpen ? 'close' : 'chat'} />
      </OpenChatButton>

      {isMoodleOpen && (
        <MoodleWindow>
          <ChatHeader>
            <Text color="white" $weight="bold">
              Moodle Session
            </Text>
          </ChatHeader>
          <MoodleDivider />
          <Box
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Input
              type="text"
              placeholder="Username"
              value={moodleUsername}
              onChange={(e) => setMoodleUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Moodle Link (foo.moodle.bar)"
              value={moodleSession}
              onChange={(e) => setMoodleSession(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={moodlePassword}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ButtonRow>
              <RefreshMoodleButton onClick={() => handleMoodleConnect(false)}>
                Refresh
              </RefreshMoodleButton>
              <UpdateMoodleButton onClick={() => handleMoodleConnect(true)}>
                Update
              </UpdateMoodleButton>
            </ButtonRow>
          </Box>
        </MoodleWindow>
      )}

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

export async function handleMoodle({
  username,
  session,
  password,
  isUpdate,
}: {
  username: string;
  session: string;
  password: string;
  isUpdate: boolean;
}): Promise<string> {
  let action: string;
  if (isUpdate) {
    action = 'update';
  } else {
    action = 'reset';
  }
  console.log(username, session, password, action);
  try {
    const response = await fetch('http://localhost:8000/moodle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        session,
        password,
        action,
      }),
    });

    const data = await response.json();
    // You can adjust this depending on your backend's response structure
    return data.response || 'No response from Moodle endpoint.';
  } catch (error) {
    console.error('Network error:', error);
    return 'Network error: Unable to reach Moodle API.';
  }
}
