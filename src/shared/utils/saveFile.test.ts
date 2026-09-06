import { afterEach, describe, expect, it, vi } from 'vitest';
const native = vi.hoisted(() => ({ save: vi.fn(), getPlatform: vi.fn(() => 'android') }));
vi.mock('@capacitor/core', () => ({ Capacitor: { getPlatform: native.getPlatform }, registerPlugin: () => ({ save: native.save }) }));
import { saveFile } from './saveFile';
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
const stubReader = () => vi.stubGlobal('FileReader', class {
  result = 'data:application/pdf;base64,JVBERg==';
  onload = () => {};
  readAsDataURL() { this.onload(); }
});
describe('Android export delivery', () => {
  it('waits for native saving and sends the filename, MIME type and binary data', async () => {
    stubReader(); native.save.mockResolvedValue({ cancelled: false });
    expect(await saveFile(new Blob(['%PDF'], { type: 'application/pdf' }), 'hipoteca.pdf')).toBe('saved');
    expect(native.save).toHaveBeenCalledWith({ filename: 'hipoteca.pdf', mimeType: 'application/pdf', data: 'JVBERg==' });
  });
  it('reports cancellation separately from successful saving', async () => {
    stubReader(); native.save.mockResolvedValue({ cancelled: true });
    expect(await saveFile(new Blob(['%PDF'], { type: 'application/pdf' }), 'hipoteca.pdf')).toBe('cancelled');
  });
  it('propagates native write failures so the UI can offer a retry', async () => {
    stubReader(); native.save.mockRejectedValue(new Error('No storage'));
    await expect(saveFile(new Blob(['%PDF']), 'hipoteca.pdf')).rejects.toThrow('No storage');
  });
});
