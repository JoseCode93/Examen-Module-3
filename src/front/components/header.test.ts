import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { createHeader } from './header';

vi.mock('./base.js', () => ({
    render: (selector: string, position: InsertPosition, template: string) => {
        const container = document.querySelector(selector);
        container?.insertAdjacentHTML(position, template);
        return container?.firstElementChild;
    },
}));

describe('Header component', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        createHeader();
    });

    it('debería renderizar el logo, título y botón', () => {
        const logo = screen.getByAltText('Logo de la empresa');
        const title = screen.getByRole('heading', { name: /productos/i });
        const button = screen.getByRole('button', { name: /add/i });

        expect(logo).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it('el botón "Add" tiene atributos correctos', () => {
        const button = screen.getByRole('button', { name: /add/i });
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(button).toHaveAttribute('aria-controls', 'add');
    });

    it('debería existir el details con summary "Add"', () => {
        const summary = screen.getByText('Add', { selector: 'summary' });
        expect(summary).toBeInTheDocument();
    });
});
