import { inject, Injectable } from "@angular/core";
import { AppState } from "../models/app-state.model";
import { BlobService } from "./blob-service";

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  
  private blobService = inject(BlobService);
  
  public download(fofo: AppState, filename: string) {
    this.blobService.download([JSON.stringify(fofo)], filename);
  }
  
  public load(): null | AppState {
    const fromStorage = localStorage.getItem('fofo');
    if (fromStorage) {
      try {
        return new AppState(JSON.parse(fromStorage));
      } catch (error: any) {
        console.log(error);
      }
    }
    return null;
  }
  
  public store(fofo: AppState) {
    localStorage.setItem('fofo', JSON.stringify(fofo));
  }
  
}