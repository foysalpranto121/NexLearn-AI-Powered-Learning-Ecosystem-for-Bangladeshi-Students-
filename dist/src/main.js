"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const allowedOrigins = (process.env.APP_ORIGIN ||
        'http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8080').split(',');
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        },
        credentials: true,
    });
    const frontendPath = (0, path_1.join)(__dirname, '..', '..', 'frontend');
    app.useStaticAssets(frontendPath, { index: ['index.html'] });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`NexLearn app running on: http://localhost:${port}`);
    console.log(`API available at: http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map