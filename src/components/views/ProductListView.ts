import { IProduct } from '../../types/models/ShopApi';
import { IEvents } from '../base/events';
import { View } from './View';

export class ProductListView extends View<IProduct[]> {
	items: HTMLElement[];

	constructor(broker: IEvents, element: HTMLElement) {
		super(broker, element);
		this.items = [];
	}

	render(): HTMLElement {
		this.items.forEach((elem) => this.element.appendChild(elem));

		return this.element;
	}
}
