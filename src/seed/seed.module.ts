import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, AuthModule], //IMPORTO EL MODULO. (TRAE TODO SUS 'EXPORTS')
})
export class SeedModule {}
