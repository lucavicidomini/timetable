import { Component, input } from '@angular/core';
import { SafePipe } from '../../directives/safe.pipe';

@Component({
  selector: 'app-preview',
  imports: [SafePipe],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {

  url = input<string>()

}
