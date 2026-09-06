import { Capacitor, registerPlugin } from '@capacitor/core';

interface FileExportPlugin {
  save(options: { filename: string; mimeType: string; data: string }): Promise<{ cancelled: boolean }>;
}
const FileExport = registerPlugin<FileExportPlugin>('FileExport');
export type SaveResult = 'saved' | 'downloaded' | 'cancelled';

export const saveFile = async (blob: Blob, filename: string): Promise<SaveResult> => {
  if (Capacitor.getPlatform() === 'android') {
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error('No se pudo preparar el archivo.'));
      reader.readAsDataURL(blob);
    });
    const result = await FileExport.save({ filename, mimeType: blob.type, data });
    return result.cancelled ? 'cancelled' : 'saved';
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser time to consume the URL before releasing it.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return 'downloaded';
};
