import { HttpException, HttpStatus } from '@nestjs/common';
import { addDays } from 'date-fns';
import { Provider } from 'src/providers/entities/provider.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
@Index(['number_bill', 'provider'], { unique: true })
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  number_bill: string;

  @ManyToOne(() => Provider)
  @JoinColumn()
  provider: Provider;

  @Column('text')
  date_input: Date;

  @Column('int', { default: 0 })
  price: number;

  @CreateDateColumn()
  date_programing_pay: Date;

  @Column('int', { default: 0 })
  pay: number;

  @Column('int', { default: 0 })
  value_pending_bill: number;

  @Column({ nullable: true, type: 'date' })
  date_done_pay: Date;

  @Column({ type: 'boolean', default: false })
  credit: boolean;

  @BeforeInsert()
  checkValidationProvider() {
    this.providerNotAllowedCredit();
    this.billTypeCredit();
  }

  @BeforeUpdate()
  datePaymentBill() {
    this.checkValidationPay();
    this.payDateRegister();
  }

  providerNotAllowedCredit() {
    if (!this.provider.credit && this.credit === true) {
      throw new HttpException(
        { message: `El proveedor no permite credito` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  billTypeCredit() {
    const dateInput = new Date(this.date_input);
    this.date_programing_pay = this.credit
      ? addDays(dateInput, 30)
      : (this.date_programing_pay = this.date_input);
  }

  checkValidationPay() {
    if (this.value_pending_bill < this.pay)
      throw new HttpException(
        `El pago no puede ser mayor al valor de la factura`,
        HttpStatus.BAD_REQUEST,
      );
  }

  payDateRegister() {
    this.value_pending_bill = this.value_pending_bill - this.pay;
    if (this.value_pending_bill === 0) {
      this.credit = false;
      this.date_done_pay = new Date();
    }
  }

  constructor(data: Partial<Bill> = {}) {
    Object.assign(this, data);
  }
}
