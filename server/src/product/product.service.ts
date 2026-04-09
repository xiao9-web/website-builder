import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: ProductStatus;
  }): Promise<{ list: Product[]; total: number }> {
    const { page = 1, pageSize = 10, status } = params;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (status !== undefined) {
      queryBuilder.where('product.status = :status', { status });
    }

    queryBuilder
      .orderBy('product.sort', 'ASC')
      .addOrderBy('product.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await queryBuilder.getManyAndCount();

    return { list, total };
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async updateSort(id: number, sort: number): Promise<Product> {
    await this.productRepository.update(id, { sort });
    return this.findOne(id);
  }
}
