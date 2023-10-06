import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { default: 'image' })
  image: string;

  @Column('boolean', { default: false })
  google: boolean;

  @Column('boolean', { default: true })
  status: boolean;

  @BeforeInsert()
  insertCaseLowerName() {
    this.name = this.name.toLowerCase();
  }

  @BeforeUpdate()
  updateNameLowerCase() {
    this.name = this.name.toLowerCase();
  }
}
