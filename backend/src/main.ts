import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // ignore les propriétés non déclarées dans les DTOs
            forbidNonWhitelisted: true, // rejette les propriétés non autorisées
            transform: true, // transforme automatiquement les payloads en DTOs
        })
    );

    await app.listen(process.env.PORT ?? 3000);

    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
}
bootstrap();
