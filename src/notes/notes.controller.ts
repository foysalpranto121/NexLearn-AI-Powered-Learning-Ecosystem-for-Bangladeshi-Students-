import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('uploads/init')
  async initUpload(@Req() req: any, @Body() body: { title: string; mime_type: string; file_size_bytes: number }) {
    const data = await this.notesService.initUpload(req.user.id, body.title, body.mime_type, body.file_size_bytes);
    return { success: true, data };
  }

  @Post(':documentId/process')
  @HttpCode(HttpStatus.ACCEPTED)
  async processDocument(@Req() req: any, @Param('documentId') documentId: string) {
    const data = await this.notesService.processDocument(req.user.id, documentId);
    return { success: true, data };
  }

  @Get()
  async list(@Req() req: any) {
    const data = await this.notesService.listDocuments(req.user.id);
    return { success: true, data };
  }

  @Get(':documentId')
  async getDocument(@Req() req: any, @Param('documentId') documentId: string) {
    const data = await this.notesService.getDocument(req.user.id, documentId);
    return { success: true, data };
  }

  @Post(':documentId/summaries')
  @HttpCode(HttpStatus.ACCEPTED)
  async generateSummaries(@Req() req: any, @Param('documentId') documentId: string) {
    const data = await this.notesService.generateSummaries(req.user.id, documentId);
    return { success: true, data };
  }

  @Get(':documentId/summaries/latest')
  async getLatest(@Req() req: any, @Param('documentId') documentId: string) {
    const data = await this.notesService.getLatestSummary(req.user.id, documentId);
    return { success: true, data };
  }

  @Delete(':documentId')
  async deleteDocument(@Req() req: any, @Param('documentId') documentId: string) {
    const data = await this.notesService.deleteDocument(req.user.id, documentId);
    return { success: true, data };
  }
}
