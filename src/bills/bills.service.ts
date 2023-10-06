import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { Provider } from 'src/providers/entities/provider.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createBillDto: CreateBillDto) {
    const { number_bill, provider, price, credit, date_input } = createBillDto;

    let providerFind: Provider;

    try {
      providerFind = await this.providerRepository.findOne({
        where: { name: provider.toLowerCase() },
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }

    const bill = new Bill({
      number_bill,
      provider: providerFind,
      price,
      credit,
      date_input,
    });

    try {
      await this.billRepository.save(bill);
      console.log(bill);
      return bill;
    } catch (error) {
      this.numberBillExistOnThisProvider(error);
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all bills`;
  }

  async findAllBillsByProvider(id: string) {
    try {
      const bills = await this.billRepository
        .createQueryBuilder('bill')
        .where('bill.provider.id = :providerId', { providerId: id })
        .orderBy('bill.date_input', 'DESC')
        .getMany();
      return bills;
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} bill`;
  }

  update(id: number, updateBillDto: UpdateBillDto) {
    return `This action updates a #${id} bill`;
  }

  remove(id: number) {
    return `This action removes a #${id} bill`;
  }

  private handleDBExceptions(error: any) {
    throw new BadRequestException(error.message);
  }

  private numberBillExistOnThisProvider(error: any) {
    if (error.code === '23505')
      throw new HttpException(
        'Ya existe registro de esta factura en este proveedor',
        HttpStatus.BAD_REQUEST,
      );
  }
}
