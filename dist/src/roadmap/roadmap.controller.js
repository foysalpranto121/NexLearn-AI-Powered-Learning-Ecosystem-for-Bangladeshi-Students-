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
exports.RoadmapController = void 0;
const common_1 = require("@nestjs/common");
const roadmap_service_1 = require("./roadmap.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const profile_completed_guard_1 = require("../profile/profile-completed.guard");
let RoadmapController = class RoadmapController {
    roadmapService;
    constructor(roadmapService) {
        this.roadmapService = roadmapService;
    }
    async generate(req, body) {
        const data = await this.roadmapService.generateRoadmap(req.user.id, body.target_career, body.current_level, body.timeline_weeks);
        return { success: true, data };
    }
    async getCurrent(req) {
        const data = await this.roadmapService.getCurrent(req.user.id);
        return { success: true, data };
    }
    async getById(req, id) {
        const data = await this.roadmapService.getRoadmapById(req.user.id, id);
        return { success: true, data };
    }
    async updateNodeStatus(req, id, nodeId, status) {
        const data = await this.roadmapService.updateNodeStatus(req.user.id, id, nodeId, status);
        return { success: true, data };
    }
    async regenerateNode(req, id, nodeId) {
        const data = await this.roadmapService.regenerateNode(req.user.id, id, nodeId);
        return { success: true, data };
    }
    async archive(req, id) {
        const data = await this.roadmapService.archiveRoadmap(req.user.id, id);
        return { success: true, data };
    }
};
exports.RoadmapController = RoadmapController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(profile_completed_guard_1.ProfileCompletedGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoadmapController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)('current'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoadmapController.prototype, "getCurrent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RoadmapController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id/nodes/:nodeId/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('nodeId')),
    __param(3, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], RoadmapController.prototype, "updateNodeStatus", null);
__decorate([
    (0, common_1.Post)(':id/regenerate-node'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('node_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], RoadmapController.prototype, "regenerateNode", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RoadmapController.prototype, "archive", null);
exports.RoadmapController = RoadmapController = __decorate([
    (0, common_1.Controller)('roadmaps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [roadmap_service_1.RoadmapService])
], RoadmapController);
//# sourceMappingURL=roadmap.controller.js.map