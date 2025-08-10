import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Lift from "../src/views/Lift";
import LiftHistory from '../src/views/LiftHistory';
import LiftOptions from '../src/views/LiftOptions';
import LiftSession from '../src/views/LiftSession';
import { TSQTestWrapper } from '../setupTests';

describe('Lift', () => {
    it('renders the element with the correct test-id', async () => {
        render(<Lift />, { wrapper: TSQTestWrapper })
        await waitFor(() => {
            const element = screen.getByTestId('main-nav')
            expect(element).toBeInTheDocument()
        })
    })
})

describe('LiftHistory', () => {
    it('renders the element with the correct test-id', async () => {
        render(<LiftHistory />, { wrapper: TSQTestWrapper })
        await waitFor(() => {
            const element = screen.getByTestId('lift-history')
            expect(element).toBeInTheDocument()
        })
    })
})

describe('LiftOptions', () => {
    it('renders the element with the correct test-id', async () => {
        render(<LiftOptions />, { wrapper: TSQTestWrapper })
        await waitFor(() => {
            const listElement = screen.getByTestId('options-list')
            const addElement = screen.getByTestId('add-options')
            expect(listElement).toBeInTheDocument()
            expect(addElement).toBeInTheDocument()
        })
    })
})

describe('LiftSession', () => {
    it('renders the element with the correct test-id', async () => {
        render(<LiftSession />, { wrapper: TSQTestWrapper })
        const element = screen.getByTestId('lift-session')
        await waitFor(() => {
            expect(element).toBeInTheDocument()
        })
    })
})
