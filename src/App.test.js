import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home join form', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/RoomID/i)).toBeInTheDocument();
});
