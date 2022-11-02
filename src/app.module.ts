import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';
import entities from './entities';
import { ScheduleModule } from '@nestjs/schedule';
import { CitiesModule } from './cities/cities.module';
import { PhotosModule } from './photos/photos.module';
import { VisitsCountMiddleware } from './middlewares/visits-count.middleware';
import { CityScoresModule } from './city-scores/city-scores.module';

@Module({
  imports: [
    CountriesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities,
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CitiesModule,
    PhotosModule,
    CityScoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VisitsCountMiddleware)
      .exclude({ path: '/cities', method: RequestMethod.GET })
      .forRoutes({ path: 'cities/*', method: RequestMethod.GET });
  }
}
