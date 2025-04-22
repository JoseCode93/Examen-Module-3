import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { createFormAdd } from './form.add';

describe('ProductForm - createFormAdd', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('debería renderizar el formulario correctamente', () => {
        createFormAdd();

        const form = screen.getByRole('form', { name: /add_form/i });
        expect(form).toBeInTheDocument();

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Esta en promoción/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Crear/i }),
        ).toBeInTheDocument();
    });

    it('debería llamar a handleSubmit con los datos del formulario', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const products = [
            {
                id: 1,
                name: 'Test',
                description: 'desc',
                price: 10,
                hasPromo: false,
                category: 'mobile',
            },
        ];

        createFormAdd(products);

        fireEvent.input(screen.getByLabelText(/Name/i), {
            target: { value: 'Nuevo producto' },
        });
        fireEvent.input(screen.getByLabelText(/Description/i), {
            target: { value: 'Una descripción' },
        });
        fireEvent.input(screen.getByLabelText(/Price/i), {
            target: { value: '100' },
        });
        fireEvent.click(screen.getByLabelText(/Esta en promoción/i));
        fireEvent.change(screen.getByLabelText(/Category/i), {
            target: { value: 'computer' },
        });

        fireEvent.submit(screen.getByRole('form', { name: /add_form/i }));

        expect(consoleSpy).toHaveBeenCalledWith(
            'Form submitted:',
            expect.objectContaining({
                id: 2,
                name: 'Nuevo producto',
                description: 'Una descripción',
                price: 100,
                hasPromo: true,
                category: 'computer',
            }),
        );
    });
});
