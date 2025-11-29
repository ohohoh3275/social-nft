import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Canvas from '../Canvas';

// Mock the web3 utils
vi.mock('../../utils/web3', () => ({
    connectWallet: vi.fn(),
    mintNFT: vi.fn(),
    uploadToIPFS: vi.fn(),
}));

// Mock html2canvas
vi.mock('html2canvas', () => ({
    default: vi.fn(() => Promise.resolve({
        toDataURL: () => 'data:image/png;base64,mock',
    })),
}));

describe('Canvas Component', () => {
    it('renders the topic correctly', () => {
        render(<Canvas />);
        expect(screen.getByText(/Ziri's Awesome Project Launch/i)).toBeInTheDocument();
    });

    it('allows adding a new message', () => {
        render(<Canvas />);

        const input = screen.getByPlaceholderText('Leave a mark...');
        const addButton = screen.getByRole('button', { name: '' }); // The Plus icon button

        // Type a message
        fireEvent.change(input, { target: { value: 'Hello World' } });

        // Click add (assuming the first button is add, or we can use test-id)
        // Since we used Lucide icons, the button might be hard to select by text.
        // Let's assume the input works with Enter key as well.
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('shows connect wallet button initially', () => {
        render(<Canvas />);
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
});
