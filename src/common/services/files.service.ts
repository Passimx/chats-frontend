import { FilesType } from '../../root/types/files/types.ts';

export class FilesService {
    public static async resizeImage(file: FilesType, MAX_WIDTH = 100, MAX_HEIGHT = 100) {
        return new Promise<FilesType>((resolve) => {
            const element: HTMLImageElement = document.createElement('img');

            const finish = (payload = file) => {
                URL.revokeObjectURL(element.src);
                resolve(payload);
            };

            element.src = URL.createObjectURL(file);
            element.onload = () => {
                const canvas = document.createElement('canvas');
                let width = element.width;
                let height = element.height;

                const newWidth = width;
                const newHeight = height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                // если размер не стал меньше
                if (newWidth >= width && newHeight >= height) return finish(file);

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return finish();

                ctx.drawImage(element, 0, 0, width, height);
                canvas.toBlob(async (blob) => {
                    if (!blob) return finish();
                    const newFile = new File([blob], file.name);
                    finish(newFile);
                });
            };
            element.onerror = () => finish();
        });
    }
}
