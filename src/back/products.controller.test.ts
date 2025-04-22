import { describe, it, expect, vi } from 'vitest';
import { ProductsController } from '../../src/back/products.controller';
import type { Request, Response, NextFunction } from 'express';

const mockRepo = {
    read: vi.fn(),
    readById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

const mockProducts = [
    { id: '1', name: 'Product 1', price: 100, category: 'electronics' },
    { id: '2', name: 'Product 2', price: 200, category: 'clothing' },
];

const controller = new ProductsController(mockRepo);

describe('ProductsController', () => {
    const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    describe('getAll', () => {
        it('should return all products', async () => {
            mockRepo.read.mockResolvedValue(mockProducts);
            await controller.getAll({} as Request, res, next);
            expect(res.json).toHaveBeenCalledWith({
                results: mockProducts,
                error: '',
            });
        });
    });

    describe('getById', () => {
        it('should return a product by id', async () => {
            const mockProduct = mockProducts[0];
            mockRepo.readById.mockResolvedValue(mockProduct);
            await controller.getById(
                { params: { id: '1' } } as Request,
                res,
                next,
            );
            expect(res.json).toHaveBeenCalledWith({
                results: [mockProduct],
                error: '',
            });
        });

        it('should call next if product is not found', async () => {
            mockRepo.readById.mockRejectedValue(new Error('Not found'));
            await controller.getById(
                { params: { id: '99' } } as Request,
                res,
                next,
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create a new product', async () => {
            const newProduct = {
                name: 'New Product',
                price: 300,
                category: 'food',
            };
            const createdProduct = { ...newProduct, id: '3' };
            mockRepo.create.mockResolvedValue(createdProduct);
            await controller.create({ body: newProduct } as Request, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                results: [createdProduct],
                error: '',
            });
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            const updatedData = { name: 'Updated Product' };
            const updatedProduct = { ...mockProducts[0], ...updatedData };
            mockRepo.update.mockResolvedValue(updatedProduct);
            await controller.update(
                { params: { id: '1' }, body: updatedData } as Request,
                res,
                next,
            );
            expect(res.json).toHaveBeenCalledWith({
                results: [updatedProduct],
                error: '',
            });
        });

        it('should call next if product is not found during update', async () => {
            mockRepo.update.mockRejectedValue(new Error('Not found'));
            await controller.update(
                { params: { id: '99' }, body: {} } as Request,
                res,
                next,
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete a product', async () => {
            const deletedProduct = mockProducts[0];
            mockRepo.delete.mockResolvedValue(deletedProduct);
            await controller.delete(
                { params: { id: '1' } } as Request,
                res,
                next,
            );
            expect(res.json).toHaveBeenCalledWith({
                results: [deletedProduct],
                error: '',
            });
        });

        it('should call next if product is not found during delete', async () => {
            mockRepo.delete.mockRejectedValue(new Error('Not found'));
            await controller.delete(
                { params: { id: '99' } } as Request,
                res,
                next,
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
