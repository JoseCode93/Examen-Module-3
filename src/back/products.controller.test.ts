import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ProductsController } from './products.controller';
import type { Request, Response, NextFunction } from 'express';

const mockRepo = {
    read: vi.fn(),
    readById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

const controller = new ProductsController(mockRepo as any);

const mockRes = () => {
    const res: Partial<Response> = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
    };
    return res as Response;
};

const next = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
});

describe('ProductsController', () => {
    it('should get all products', async () => {
        const req = {} as Request;
        const res = mockRes();
        const fakeProducts = [{ id: '1', name: 'Test Product' }];
        mockRepo.read.mockResolvedValueOnce(fakeProducts);

        await controller.getAll(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            results: fakeProducts,
            error: '',
        });
    });

    it('should get product by id', async () => {
        const req = { params: { id: '1' } } as unknown as Request;
        const res = mockRes();
        const product = { id: '1', name: 'Product 1' };
        mockRepo.readById.mockResolvedValueOnce(product);

        await controller.getById(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            results: [product],
            error: '',
        });
    });

    it('should create a product', async () => {
        const req = { body: { name: 'New Product' } } as Request;
        const res = mockRes();
        const product = { id: '2', name: 'New Product' };
        mockRepo.create.mockResolvedValueOnce(product);

        await controller.create(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            results: [product],
            error: '',
        });
    });

    it('should update a product', async () => {
        const req = {
            params: { id: '1' },
            body: { name: 'Updated Product' },
        } as unknown as Request;
        const res = mockRes();
        const updatedProduct = { id: '1', name: 'Updated Product' };
        mockRepo.update.mockResolvedValueOnce(updatedProduct);

        await controller.update(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            results: [updatedProduct],
            error: '',
        });
    });

    it('should delete a product', async () => {
        const req = { params: { id: '1' } } as unknown as Request;
        const res = mockRes();
        const deletedProduct = { id: '1', name: 'Deleted Product' };
        mockRepo.delete.mockResolvedValueOnce(deletedProduct);

        await controller.delete(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            results: [deletedProduct],
            error: '',
        });
    });

    it('should handle error in getById', async () => {
        const req = { params: { id: '999' } } as unknown as Request;
        const res = mockRes();
        mockRepo.readById.mockRejectedValueOnce(new Error('Not found'));

        await controller.getById(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle error in delete', async () => {
        const req = { params: { id: '1' } } as unknown as Request;
        const res = mockRes();
        mockRepo.delete.mockRejectedValueOnce(new Error('Delete failed'));

        await controller.delete(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle error in update', async () => {
        const req = {
            params: { id: '1' },
            body: { name: 'Fail Update' },
        } as unknown as Request;
        const res = mockRes();
        mockRepo.update.mockRejectedValueOnce(new Error('Update failed'));

        await controller.update(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
