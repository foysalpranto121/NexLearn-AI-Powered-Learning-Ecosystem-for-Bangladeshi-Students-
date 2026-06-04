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
exports.AiTutorController = void 0;
const common_1 = require("@nestjs/common");
const ai_tutor_service_1 = require("./ai-tutor.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const profile_completed_guard_1 = require("../profile/profile-completed.guard");
let AiTutorController = class AiTutorController {
    aiTutorService;
    constructor(aiTutorService) {
        this.aiTutorService = aiTutorService;
    }
    async createSession(req, body) {
        const data = await this.aiTutorService.createSession(req.user.id, body.title, body.subject, body.mode);
        return { success: true, data };
    }
    async getSessions(req, limit) {
        const data = await this.aiTutorService.getSessions(req.user.id, limit ? Number(limit) : undefined);
        return { success: true, data };
    }
    async getSessionById(req, id) {
        const data = await this.aiTutorService.getSessionById(req.user.id, id);
        return { success: true, data };
    }
    async postMessage(req, id, message) {
        const data = await this.aiTutorService.postMessage(req.user.id, id, message);
        return { success: true, data };
    }
    async deleteSession(req, id) {
        const data = await this.aiTutorService.deleteSession(req.user.id, id);
        return { success: true, data };
    }
};
exports.AiTutorController = AiTutorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiTutorController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AiTutorController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiTutorController.prototype, "getSessionById", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, common_1.UseGuards)(profile_completed_guard_1.ProfileCompletedGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AiTutorController.prototype, "postMessage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiTutorController.prototype, "deleteSession", null);
exports.AiTutorController = AiTutorController = __decorate([
    (0, common_1.Controller)('ai/study/sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_tutor_service_1.AiTutorService])
], AiTutorController);
//# sourceMappingURL=ai-tutor.controller.js.map