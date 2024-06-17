import Product from "../../../domain/product/entity/product";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";
import OutputMapperInterface from "../../../domain/@shared/mapper/output.mapper.interface";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

export default class ListProductUseCase implements OutputMapperInterface<Product, OutputListProductDto>{

    productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this.productRepository.findAll();

        return this.toOutput(products);
    }

    toOutput(products: Product[]): OutputListProductDto {
       
        return {
            products: products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
            }))
        }
    }
}