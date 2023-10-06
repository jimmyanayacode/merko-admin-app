import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination-common.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    try {
      const provider = this.providerRepository.create(createProviderDto);
      await this.providerRepository.save(provider);
      return provider;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationdto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationdto;

    try {
      return await this.providerRepository.find({
        take: limit,
        skip: offset,
        order: {
          name: 'ASC',
        },
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let provider: Provider;
    try {
      if (isUUID(term)) {
        provider = await this.providerRepository.findOneBy({ id: term });
      } else {
        const queryBuilder =
          this.providerRepository.createQueryBuilder('provider');
        provider = await queryBuilder
          .where('UPPER(name) =:name', {
            name: term.toUpperCase(),
          })
          .getOne();
      }
      this.notFoundProvider(provider);
      return provider;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    try {
      const provider = await this.providerRepository.preload({
        id,
        ...updateProviderDto,
      });
      this.notFoundProvider(provider);
      const providerUpdated = await this.providerRepository.save(provider);
      return providerUpdated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async changeStatusProvider(id: string) {
    try {
      let provider: Provider = await this.findOne(id);
      this.notFoundProvider(provider);
      provider.status = !provider.status;
      await this.providerRepository.update(id, provider);
      return `${provider.name} estado ${provider.status}`;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /* Errors Control */
  private handleDBExceptions(error: any) {
    console.log(error);
    if ((error.code = '23505')) throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  private notFoundProvider(provider: Provider) {
    if (!provider || provider === undefined)
      throw new NotFoundException(`Provider not found`);
  }
}
