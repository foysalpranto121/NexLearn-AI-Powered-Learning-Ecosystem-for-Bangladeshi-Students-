"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsController = void 0;
const common_1 = require("@nestjs/common");
const goals_service_1 = require("./goals.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let GoalsController = class GoalsController {
    goalsService;
    constructor(goalsService) {
        this.goalsService = goalsService;
    }
    async getToday(req, tz) {
        const data = await this.goalsService.getToday(req.user.id, tz || 'UTC');
        return { success: true, data };
    }
    async create(req, body) {
        const data = await this.goalsService.create(req.user.id, body);
        return { success: true, data };
    }
    async update(req, id, body) {
        const data = await this.goalsService.update(req.user.id, id, body);
        return { success: true, data };
    }
    async complete(req, id) {
        const data = await this.goalsService.complete(req.user.id, id);
        return { success: true, data };
    }
    async suggest(req) {
        const data = await this.goalsService.suggest(req.user.id);
        return { success: true, data };
    }
};
exports.GoalsController = GoalsController;
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('timezone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "getToday", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)('suggest'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "suggest", null);
exports.GoalsController = GoalsController = __decorate([
    (0, common_1.Controller)('goals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [goals_service_1.GoalsService])
], GoalsController);
//# sourceMappingURL=goals.controller.js.map