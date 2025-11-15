import { FilesType } from '../../root/types/files/types.ts';

export class FilesService {
    public static async resizeImage(file: FilesType, MAX_WIDTH = 100, MAX_HEIGHT = 100): Promise<FilesType> {
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

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return finish();

                ctx.drawImage(element, 0, 0, width, height);
                canvas.toBlob(async (blob) => {
                    if (!blob) return finish();
                    const newFile = new File([blob], file.name, { type: file.type });

                    if (file.size > newFile.size) finish(newFile);
                    else finish();
                });
            };
            element.onerror = () => finish();
        });
    }

    public static async getVideoPreview(file: FilesType): Promise<FilesType> {
        return new Promise<FilesType>((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            const finish = (payload = file) => {
                URL.revokeObjectURL(video.src);
                resolve(payload);
            };

            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                video.currentTime = Math.min(video.duration / 2, video.duration - 0.1);
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');

                const width = video.videoWidth;
                const height = video.videoHeight;

                if (!width || !height) return finish();

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return finish();

                ctx.drawImage(video, 0, 0, width, height);

                canvas.toBlob(async (blob) => {
                    if (!blob) return finish();

                    const previewFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                        type: 'image/jpeg',
                    });

                    const resizedFile = await this.resizeImage(previewFile);
                    finish(resizedFile);
                });
            };

            video.onerror = () => finish();
        });
    }
}
