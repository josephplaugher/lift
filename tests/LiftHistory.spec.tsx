import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TSQTestWrapper } from '../setupTests';
import LiftHistoryTable from '../src/components/LiftHistoryTable';
import { FakeLifts } from './FakeData';

describe('Lift History Table', () => {
    it('renders the element with a table and table rows', async () => {
        render(<LiftHistoryTable lifts={FakeLifts} />, { wrapper: TSQTestWrapper })
        await waitFor(() => {
            const table = screen.getByTestId('lift-history-table');
            const rows = within(table).getAllByRole("row");
            expect(rows.length).toBeGreaterThan(0);
        })
    })
})
