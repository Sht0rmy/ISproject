import { DynamicModule } from '@nestjs/common';

import * as entities from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

async function getTypeOrmModule(): Promise<DynamicModule> {
  return TypeOrmModule.forRoot({
    type: 'postgres',
    port: 5433,
    password: '123456',
    username: 'postgres',
    database: 'sasha2',
    entities: Object.values(entities),
    synchronize: true,
    logging: false,
    host: 'localhost',
  });
}

export default getTypeOrmModule;
