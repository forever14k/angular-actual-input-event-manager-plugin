import { Inject, Injectable, Provider } from '@angular/core';
import { EVENT_MANAGER_PLUGINS, DOCUMENT } from '@angular/platform-browser';


@Injectable()
export class ActualInputEventManagerPlugin {

    constructor(@Inject(DOCUMENT) private _document: Document) { console.log(1); }


    supports(eventName: string): boolean {
        return eventName === 'input';
    }

    addEventListener(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, eventName: string, originalHandler: (event: Event) => void): () => void {
        if (!isElementSupportsInputEvent(element)) {
            throw new Error(`Provided element is not HTMLInputElement, HTMLTextAreaElement or HTMLSelectElement`);
        }

        if (element instanceof HTMLSelectElement) {
            element.addEventListener(eventName, originalHandler, false);
            return () => element.removeEventListener(eventName, originalHandler, false);
        }

        let value: string = element.value;

        const beforeInputHandler = () => {
            value = element.value;
        };

        const inputHandler = (event: Event) => {
            if (element.value !== value) {
                value = element.value;
                originalHandler(event);
            }
        };

        element.addEventListener('keydown', beforeInputHandler, false);
        element.addEventListener(eventName, inputHandler, false);
        return () => {
            element.removeEventListener(eventName, inputHandler, false);
            element.removeEventListener('keydown', beforeInputHandler, false);
        };
    }

    addGlobalEventListener(selector: string, eventName: string, handler: (event: Event) => void): () => void {
        const element = this._document.querySelector(selector);
        if (!isElementSupportsInputEvent(element)) {
            throw new Error(`Element provided by selector is not HTMLInputElement, HTMLTextAreaElement or HTMLSelectElement`);
        }
        return this.addEventListener(element as HTMLInputElement |  HTMLTextAreaElement | HTMLSelectElement, eventName, handler);
    }

}


function isElementSupportsInputEvent(element: Element | null): boolean {
    return element instanceof HTMLInputElement
        || element instanceof HTMLTextAreaElement
        || element instanceof HTMLSelectElement;
}


export const ACTUAL_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER: Provider = {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: ActualInputEventManagerPlugin,
    multi: true
};
