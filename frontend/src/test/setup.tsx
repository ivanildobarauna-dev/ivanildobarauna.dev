import { vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
    span: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    a: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => <button {...props}>{children}</button>,
    h1: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
    h4: ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>,
    p: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
