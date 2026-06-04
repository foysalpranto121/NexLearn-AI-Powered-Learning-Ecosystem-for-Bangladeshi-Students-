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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const notes_service_1 = require("./notes.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NotesController = class NotesController {
    notesService;
    constructor(notesService) {
        this.notesService = notesService;
    }
    async initUpload(req, body) {
        const data = await this.notesService.initUpload(req.user.id, body.title, body.mime_type, body.file_size_bytes);
        return { success: true, data };
    }
    async processDocument(req, documentId) {
        const data = await this.notesService.processDocument(req.user.id, documentId);
        return { success: true, data };
    }
    async list(req) {
        const data = await this.notesService.listDocuments(req.user.id);
        return { success: true, data };
    }
    async getDocument(req, documentId) {
        const data = await this.notesService.getDocument(req.user.id, documentId);
        return { success: true, data };
    }
    async generateSummaries(req, documentId) {
        const data = await this.notesService.generateSummaries(req.user.id, documentId);
        return { success: true, data };
    }
    async getLatest(req, documentId) {
        const data = await this.notesService.getLatestSummary(req.user.id, documentId);
        return { success: true, data };
    }
    async deleteDocument(req, documentId) {
        const data = await this.notesService.deleteDocument(req.user.id, documentId);
        return { success: true, data };
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Post)('uploads/init'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "initUpload", null);
__decorate([
    (0, common_1.Post)(':documentId/process'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "processDocument", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getDocument", null);
__decorate([
    (0, common_1.Post)(':documentId/summaries'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "generateSummaries", null);
__decorate([
    (0, common_1.Get)(':documentId/summaries/latest'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Delete)(':documentId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "deleteDocument", null);
exports.NotesController = NotesController = __decorate([
    (0, common_1.Controller)('notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map