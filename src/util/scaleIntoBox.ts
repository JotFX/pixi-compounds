
export function scaleIntoBox(targetWidth: number, targetHeight: number, maxWidth: number, maxHeight: number, mayEnlarge: boolean = false): number {
    const factor = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
    if (factor > 1 && !mayEnlarge) {
        return 1;
    }
    return factor;
}
