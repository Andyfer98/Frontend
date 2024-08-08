import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  async uploadFileAndGetURL(file: File): Promise<string> {
    const uniqueId = Date.now().toString();
    const fileName = `${uniqueId}_${file.name}`;
    const filePath = `imagenes/${fileName}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => console.log('Subiendo...'),
        (error) => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(fileRef);
            resolve(url);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

}
