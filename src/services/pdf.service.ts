import { Injectable } from "@angular/core";
import { AppState } from "../models/app-state.model";
import { PdfDoc } from "./pdf-doc.service";

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  
  public download(fofo: AppState) {
    new PdfDoc(fofo).doc.save('Orario.pdf');
  }

  public preview(fofo: AppState): string {
    const pdfDoc = new PdfDoc(fofo).doc;
    return pdfDoc.output('datauristring') ?? '';
  }

}