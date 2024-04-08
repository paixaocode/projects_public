import { Directive, ElementRef, HostBinding, OnInit, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appTabsBackgroundCustom]'
})
export class PoTabsCustomDirective implements OnInit {

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ){}

    ngOnInit(): void {
        this.renderer.setStyle(this.el.nativeElement.children[0],'background-color', '#D6E4F3');
        this.renderer.setStyle(this.el.nativeElement.children[0],'border-radius', '5px');
    }

}