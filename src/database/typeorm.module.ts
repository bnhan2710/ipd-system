import { DataSource } from 'typeorm';
import { Global, Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseConnection'); 
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            logging: configService.get<string>('BUILD_MODE') == 'development',
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
            migrations: [`${__dirname}/../migrations/**.{.ts,.js}`],
            synchronize: true
          });
          await dataSource.initialize();
          logger.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          logger.error('Error connecting to database', error.stack); 
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
