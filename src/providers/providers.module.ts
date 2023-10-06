import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [TypeOrmModule.forFeature([Provider])],
})
export class ProvidersModule {}
