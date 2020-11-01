

export const fromCenter = (x: number, y: number, width: number, height: number) => {
    return [x - width / 2, y - height / 2];
}

export const image2obj = (file: File): Promise<MBE.Image> => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const url = URL.createObjectURL(file);
    const img = new Image();

    let resolve: (data: MBE.Image) => void;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0, img.width, img.height);
        const base64 = canvas.toDataURL(file.type);
        URL.revokeObjectURL(img.src);
        resolve({
            name: file.name,
            src: base64,
            width: img.width,
            height: img.height
        });
    }
    img.src = url;

    return new Promise(r => resolve = r)
}

export const loadLsNumber = (key: string): number => {
    const val = localStorage.getItem(key);
    if (!val) return 0;
    const number = Number.parseFloat(val);
    if (Number.isNaN(number)) return 0;
    return number;
}

export function loadLsJson<T>(key: string, defaultValue?: T): T;
export function loadLsJson<T = undefined>(key: string, defaultValue?: T): T;

export function loadLsJson<T>(key: string, defaultValue?: T): T {
    const value = localStorage.getItem(key);
    try {
        if (value) return JSON.parse(value);
    } catch (e) { }
    return defaultValue as T;
}