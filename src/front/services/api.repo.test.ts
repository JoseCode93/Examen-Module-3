import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiRepo } from './api.repo';
import type { Product } from '../../types/product';

const mockProduct: Product = {
    id: 1,
    name: 'Producto test',
    description: 'Descripción de prueba',
    category: 'mobile',
    price: 200,
    hasPromo: false,
};

describe('Repo Service - ApiRepo', () => {
    const repo = new ApiRepo();

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('debería obtener productos (getProducts)', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([mockProduct]),
                }),
            ) as any,
        );

        const products = await repo.getProducts();
        expect(products).toEqual([mockProduct]);
    });

    it('debería crear un producto (createProduct)', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockProduct),
                }),
            ) as any,
        );

        const product = await repo.createProduct(mockProduct);
        expect(product).toEqual(mockProduct);
    });

    it('debería actualizar un producto (updateProduct)', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            ...mockProduct,
                            name: 'Actualizado',
                        }),
                }),
            ) as any,
        );

        const updated = await repo.updateProduct(mockProduct.id, {
            name: 'Actualizado',
        });
        expect(updated.name).toBe('Actualizado');
    });

    it('debería eliminar un producto (deleteProduct)', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                }),
            ) as any,
        );

        const result = await repo.deleteProduct(mockProduct.id);
        expect(result).toEqual([]);
    });
});
