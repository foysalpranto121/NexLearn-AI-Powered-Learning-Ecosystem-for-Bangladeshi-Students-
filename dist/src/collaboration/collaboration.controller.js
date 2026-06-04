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
exports.CollaborationController = void 0;
const common_1 = require("@nestjs/common");
const collaboration_service_1 = require("./collaboration.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CollaborationController = class CollaborationController {
    collaborationService;
    constructor(collaborationService) {
        this.collaborationService = collaborationService;
    }
    async list(req) {
        const data = await this.collaborationService.listWorkspaces(req.user.id);
        return { success: true, data };
    }
    async create(req, body) {
        const data = await this.collaborationService.createWorkspace(req.user.id, body.name, body.description);
        return { success: true, data };
    }
    async addMember(req, id, body) {
        const data = await this.collaborationService.addMember(req.user.id, id, body.email, body.role || 'member');
        return { success: true, data };
    }
    async changeMemberRole(req, id, targetUserId, role) {
        const data = await this.collaborationService.changeMemberRole(req.user.id, id, targetUserId, role);
        return { success: true, data };
    }
    async postMessage(req, id, message) {
        const data = await this.collaborationService.postMessage(req.user.id, id, message);
        return { success: true, data };
    }
};
exports.CollaborationController = CollaborationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CollaborationController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CollaborationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CollaborationController.prototype, "addMember", null);
__decorate([
    (0, common_1.Patch)(':id/members/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __param(3, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CollaborationController.prototype, "changeMemberRole", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CollaborationController.prototype, "postMessage", null);
exports.CollaborationController = CollaborationController = __decorate([
    (0, common_1.Controller)('workspaces'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [collaboration_service_1.CollaborationService])
], CollaborationController);
//# sourceMappingURL=collaboration.controller.js.map