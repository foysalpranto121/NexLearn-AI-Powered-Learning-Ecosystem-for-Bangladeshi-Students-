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
exports.ProductivityController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const productivity_service_1 = require("./productivity.service");
let ProductivityController = class ProductivityController {
    productivityService;
    constructor(productivityService) {
        this.productivityService = productivityService;
    }
    async getActiveSession(req) {
        const data = await this.productivityService.getActiveSession(req.user.id);
        return { success: true, data };
    }
    async getHistory(req) {
        const data = await this.productivityService.getHistory(req.user.id);
        return { success: true, data };
    }
    async startSession(req, body) {
        const data = await this.productivityService.startSession(req.user.id, {
            goalId: body.goal_id,
            roadmapNodeId: body.roadmap_node_id,
            plannedMinutes: body.planned_minutes,
            energyBefore: body.energy_before,
        });
        return { success: true, data };
    }
    async endSession(req, id, body) {
        const data = await this.productivityService.endSession(req.user.id, id, {
            status: body.status,
            energyAfter: body.energy_after,
        });
        return { success: true, data };
    }
};
exports.ProductivityController = ProductivityController;
__decorate([
    (0, common_1.Get)('focus/active'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductivityController.prototype, "getActiveSession", null);
__decorate([
    (0, common_1.Get)('focus/history'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductivityController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('focus/start'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductivityController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('focus/:id/end'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProductivityController.prototype, "endSession", null);
exports.ProductivityController = ProductivityController = __decorate([
    (0, common_1.Controller)('productivity'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [productivity_service_1.ProductivityService])
], ProductivityController);
//# sourceMappingURL=productivity.controller.js.map