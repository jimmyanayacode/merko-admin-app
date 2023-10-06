import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column({ type: 'boolean', default: false })
  credit: boolean;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  //Before create or update a provider its name value is transform to lowercase
  @BeforeInsert()
  @BeforeUpdate()
  transformNameToLowerCase() {
    this.name = this.name.toLowerCase();
  }
}
