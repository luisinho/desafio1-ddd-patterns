import express, { Request, Response } from "express";
import ProductRepository from "../../product/repository/sequilize/product.repository";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import UpdateProductUseCase from "../../../usecase/product/update/update.product.usecase";
import FindProductUsecase from "../../../usecase/product/find/find.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";

export const productRoute = express.Router();

productRoute.post('/product', async(req: Request, res: Response) => {
    const useCase = new CreateProductUseCase(new ProductRepository());
    try {
        const productDto = {
            type: req.body.type,
            name: req.body.name,
            price: req.body.price,
        }
        const output = await useCase.execute(productDto);
       res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.put('/product', async(req: Request, res: Response) => {
    const useCase = new UpdateProductUseCase(new ProductRepository());
    try {
        const productDto = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
        }
        const output = await useCase.execute(productDto);
       res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get('/product/:id', async(req: Request, res: Response) => {

    const useCase = new FindProductUsecase(new ProductRepository());

    try {
        const productDto = {
            id: req.body.id,
        }        
        const output = await useCase.execute(productDto);
       res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get('/product', async(req: Request, res: Response) => {

    const useCase = new ListProductUseCase(new ProductRepository());

    try {
        const output = await useCase.execute({});
       res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});