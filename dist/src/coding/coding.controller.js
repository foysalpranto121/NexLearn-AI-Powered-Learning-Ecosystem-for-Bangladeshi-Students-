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
exports.CodingController = void 0;
const common_1 = require("@nestjs/common");
const coding_service_1 = require("./coding.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CodingController = class CodingController {
    codingService;
    constructor(codingService) {
        this.codingService = codingService;
    }
    async listChallenges(difficulty, skillTag, limit) {
        const data = await this.codingService.listChallenges({ difficulty, skillTag, limit: limit ? Number(limit) : undefined });
        return { success: true, data };
    }
    async getChallenge(slug) {
        const data = await this.codingService.getChallengeBySlug(slug);
        return { success: true, data };
    }
    async runSample(req, id, body) {
        const data = await this.codingService.runSample(req.user.id, id, body.language, body.source_code);
        return { success: true, data };
    }
    async submit(req, id, body) {
        const data = await this.codingService.submit(req.user.id, id, body.language, body.source_code);
        return { success: true, data };
    }
    async getSubmission(req, id) {
        const data = await this.codingService.getSubmission(req.user.id, id);
        return { success: true, data };
    }
    async feedback(req, id) {
        const data = await this.codingService.generateFeedback(req.user.id, id);
        return { success: true, data };
    }
};
exports.CodingController = CodingController;
__decorate([
    (0, common_1.Get)('challenges'),
    __param(0, (0, common_1.Query)('difficulty')),
    __param(1, (0, common_1.Query)('skill_tag')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], CodingController.prototype, "listChallenges", null);
__decorate([
    (0, common_1.Get)('challenges/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CodingController.prototype, "getChallenge", null);
__decorate([
    (0, common_1.Post)('challenges/:id/run-sample'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CodingController.prototype, "runSample", null);
__decorate([
    (0, common_1.Post)('challenges/:id/submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CodingController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('submissions/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CodingController.prototype, "getSubmission", null);
__decorate([
    (0, common_1.Post)('submissions/:id/feedback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CodingController.prototype, "feedback", null);
exports.CodingController = CodingController = __decorate([
    (0, common_1.Controller)('coding'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [coding_service_1.CodingService])
], CodingController);
//# sourceMappingURL=coding.controller.js.map