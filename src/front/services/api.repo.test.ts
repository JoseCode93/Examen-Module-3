import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ApiRepo } from './api.repo';
import { type Product } from '../models/product';

const repo = new ApiRepo();
const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 9.99,
    stock: 5,
    category: 'test-category',
    image: 'image.jpg',
};

beforeEach(() => {
    vi.restoreAllMocks();
});

describe('ApiRepo service', () => {
    test('getProducts - debe devolver un array de productos', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => [mockProduct],
            }),
        );

        const products = await repo.getProducts();
        expect(products).toEqual([mockProduct]);
    });

    test('getProducts - lanza error si la respuesta no es ok', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Server Error',
            }),
        );

        await expect(repo.getProducts()).rejects.toThrow('500 Server Error');
    });

    test('createProduct - debe enviar y devolver un producto', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockProduct,
            }),
        );

        const result = await repo.createProduct(mockProduct);
        expect(result).toEqual(mockProduct);
    });

    test('createProduct - lanza error si la respuesta no es ok', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
            }),
        );

        await expect(repo.createProduct(mockProduct)).rejects.toThrow(
            '400 Bad Request',
        );
    });

    test('updateProduct - debe enviar y devolver el producto actualizado', async () => {
        const updated = { ...mockProduct, name: 'Updated Product' };

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => updated,
            }),
        );

        const result = await repo.updateProduct(mockProduct.id, updated);
        expect(result).toEqual(updated);
    });

    test('updateProduct - lanza error si la respuesta no es ok', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            }),
        );

        await expect(
            repo.updateProduct(mockProduct.id, mockProduct),
        ).rejects.toThrow('404 Not Found');
    });

    test('deleteProduct - debe devolver un producto borrado', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockProduct,
            }),
        );

        const result = await repo.deleteProduct(mockProduct.id);
        expect(result).toEqual(mockProduct);
    });

    test('deleteProduct - lanza error si la respuesta no es ok', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 403,
                statusText: 'Forbidden',
            }),
        );

        await expect(repo.deleteProduct(mockProduct.id)).rejects.toThrow(
            '403 Forbidden',
        );
    });
});
