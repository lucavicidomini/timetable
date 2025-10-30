import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class BlobService {

    public download(content: any, filename: string) {
      const blob = this.makeBlob(content, filename);
      const el = document.createElement('a');
      const url = URL.createObjectURL(blob);
      el.href = url;
      el.download = filename;
      el.click();
      URL.revokeObjectURL(url);
    }

    protected makeBlob(content: any, filename: string): Blob {
      const extension = (filename.split('.').pop() ?? '').toLocaleLowerCase();
      if (extension === 'json') {
        return new Blob([content], { type: 'application/json' });
      }
      if (extension === 'pdf') {
        return new Blob([content], { type: 'application/pdf' });
      }
      return new Blob([content], { type: 'application/octet-stream' });
    }

}