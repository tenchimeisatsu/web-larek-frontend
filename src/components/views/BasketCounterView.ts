import { IEvents } from '../base/events';
import { View } from './View';

export class BasketCounterView extends View<{ counter: number }> {
	private _basketCounter: HTMLElement;

	constructor(broker: IEvents, element: HTMLElement, onClick: () => void) {
		super(broker, element);
		this._basketCounter = this.element.querySelector('.header__basket-counter');
		this.element.addEventListener('click', onClick);
	}
	render(data?: { counter: number }): HTMLElement {
		this._basketCounter.textContent = data.counter.toString();
		return this.element;
	}
}
