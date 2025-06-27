import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
    section: ({ children }) => <section>{children}</section>,
    span: ({ children }) => <span>{children}</span>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    p: ({ children }) => <p>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));
