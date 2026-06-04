"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingModule = void 0;
const common_1 = require("@nestjs/common");
const coding_service_1 = require("./coding.service");
const coding_controller_1 = require("./coding.controller");
const gamification_module_1 = require("../gamification/gamification.module");
let CodingModule = class CodingModule {
};
exports.CodingModule = CodingModule;
exports.CodingModule = CodingModule = __decorate([
    (0, common_1.Module)({
        imports: [gamification_module_1.GamificationModule],
        providers: [coding_service_1.CodingService],
        controllers: [coding_controller_1.CodingController],
        exports: [coding_service_1.CodingService],
    })
], CodingModule);
//# sourceMappingURL=coding.module.js.map