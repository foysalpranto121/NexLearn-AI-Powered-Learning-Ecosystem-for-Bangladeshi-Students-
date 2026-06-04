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
exports.HackathonController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const hackathon_service_1 = require("./hackathon.service");
let HackathonController = class HackathonController {
    hackathonService;
    constructor(hackathonService) {
        this.hackathonService = hackathonService;
    }
    async listHackathons() {
        const data = await this.hackathonService.listHackathons();
        return { success: true, data };
    }
    async createTeam(req, hackathonId, body) {
        const data = await this.hackathonService.createTeam(req.user.id, hackathonId, body.name);
        return { success: true, data };
    }
    async inviteMember(req, teamId, body) {
        const data = await this.hackathonService.inviteMember(req.user.id, teamId, body.email);
        return { success: true, data };
    }
    async updateProject(req, teamId, body) {
        const data = await this.hackathonService.updateProject(req.user.id, teamId, body);
        return { success: true, data };
    }
    async submitProject(req, teamId, body) {
        const data = await this.hackathonService.submitProject(req.user.id, teamId, body);
        return { success: true, data };
    }
};
exports.HackathonController = HackathonController;
__decorate([
    (0, common_1.Get)('hackathons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "listHackathons", null);
__decorate([
    (0, common_1.Post)('hackathons/:id/teams'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Post)('hackathon-teams/:id/members'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "inviteMember", null);
__decorate([
    (0, common_1.Patch)('hackathon-teams/:id/project'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Post)('hackathon-teams/:id/submit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "submitProject", null);
exports.HackathonController = HackathonController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [hackathon_service_1.HackathonService])
], HackathonController);
//# sourceMappingURL=hackathon.controller.js.map