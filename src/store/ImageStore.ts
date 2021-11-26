import { makeAutoObservable, ObservableMap } from "mobx";
import {RootStore} from "./RootStore";

export const emptyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGQUUzMzExNEU5OTExRUM4MjdDOTA0QUE1NjYwRUQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGQUUzMzEyNEU5OTExRUM4MjdDOTA0QUE1NjYwRUQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZBRTMzMEY0RTk5MTFFQzgyN0M5MDRBQTU2NjBFRDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZBRTMzMTA0RTk5MTFFQzgyN0M5MDRBQTU2NjBFRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58K1+WAAADxElEQVR42uzdXVLbMBAH8NXCBdrnDEcgF+Ao2BAcLkWwGQI3gBNwgU56g7Z5bU8AdWVM29ApQR+7q41GmgyPGumXyEibvx3T9z2U5tawEBSsglWwClbBKliFoGBpxfrWdavZrH960jlDO7DV2ZkdJEVfce1r294Zcwfw6eTk5+Njr6zZIdmB2eHdI9qhRvYGJFLjS5vXH6mXlzGRXhi1+uZz2Dharq+vV02jZD0Oq69p7JA2F5EdcMx6RCopVV7/kaLwQkIpJV5vSkV7Ia1Ucq93pOK8kFwqoZeTVIQXckgl8fKQCvVCJilhL2+pIC8nLLs9CZAS8wqU8vdCF6nP5+cQUapn9YqS8vRCbilWLwIpHy8UkGLyIpNy9tqG9ePhAUi/KCP0Ipb67fXdTjkMa9p1k6qiXTgkXixSAJO6nrZtIJbZ25teXWnzYpTqOjvl8Au8Nq+EUk5bBz1eaaVcN6UavJJL2bbv2OnoNczw5obWa/hP0rbbhzvW0dfLZUIpv4N0qs+XEinvEo28lx4pCCj+SXqpkoKwsrKMlzYpjwu88PXe/tUmNcw6JiY5vPmzGa3XOCV7TOPoNkYqFovPi7zFS0F81oHp+qVQCkiCIcq9qKSAKnKk1otQCgjzWQq9aKWANsymyotcCsiTf0q8OKSAIyaZ3ItJCpgypQm9+KSAL4CbxItVCljTysJe3FLAHe0W8xKQAoEcvICXjBTBQdrjvH16ur69pZeqKvtmCEiB6B0WxuxSt6mwXmqePGWc9XIpli9EISnqmucrL6l8Ie66lKQXZiAl5oV5SMl4YTZSAl6YkxS3F2YmxeqF+UnxeWGWUkxemKsUhxdmLEXuhXlL0XqhQqlJVU2OjxV67auTeq7kjbWXJPlVeiyBpFnCvC/lMpTJ5Cm8vwN1Sun0QrVSCr1Qs5Q2L1QupcoL9Uvp8cKdkFLihbsipcELd0gqude2Hfxwf58yqU0vjv29MWbs2fuT9fHoiPbLccIEB8vny5gPdsphy/BgPj+8uKDyIs+6EHsZc7hYHDRN+AWeyospFUTm5SDltHWI92LNTxF4uUm5bkpjvASSZlFezlIex50wL7lMXpiXj5TfQXrwWizcvcSkAr08pbxLNLZrRy9hKW8vfykIKP65eCWR8vAKkoKwsvJ2r4RSTl6hUhD8VdhbXsml3vGKkHo+LUe0L5eXrx5EXdfqHkRdVZsPorYDTvbU7k0vbVL/ekVLEWCNXjofBv/Xq67jpWwTusMij1Z+w6JgFayCVbAKVmkFq2DxtF8CDABaPNAdUdhnOwAAAABJRU5ErkJggg==";

export interface ImageFile {
  name: string;
  content: string;
  id: string;
}

export class ImageStore {
  private images: ObservableMap<string, ImageFile> = new ObservableMap<string, ImageFile>();
  constructor(private readonly store: RootStore) {
    makeAutoObservable(this);
  }
  addFile(file: File, content: string, id: string) {
    if (!this.images.has(id)) {
      this.images.set(id, {
        name: file.name,
        content,
        id
      });
    } else {
      console.error("Image already exists: " + id);
      this.store.errors.push("Image already exists: " + id);
    }
  }
  get imageArray() {
    return Array.from(this.images.values());
  }
  getImage(imgId: string): ImageFile | undefined {
    return this.images.get(imgId);
  }
  getImageContent(imgId: string): string {
    const file = this.images.get(imgId);
    return file?.content || emptyImage;
  }
}
