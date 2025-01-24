import { IController } from '../../types/controllers/Controller';
import { EventType } from '../../types/models/AppState';
import { IProduct } from '../../types/models/ShopApi';
import { createElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ProductView } from './ProductView';
import { View } from './View';

export class ProductListView extends View<IProduct[]> {
	private _isCompact: boolean;

	constructor(broker: IEvents, controller: IController, isCompact: boolean) {
		super(broker, controller);
		this._isCompact = isCompact;

		if (this._isCompact) {
			this.element = createElement('ul');
			this.element.classList.add('basket__list');
		} else {
			const template = document.querySelector('.gallery') as HTMLElement;
			this.element = template;
			this.broker.on(EventType.getProductList, (data: IProduct[]) =>
				this.render(data)
			);
		}
	}

	render(data?: IProduct[]): void {
		const newData = this._isCompact
			? data.map((el, i) => ({ ...el, index: i + 1 }))
			: data;
		newData.forEach((elem) => {
			const productView = new ProductView(
				this.broker,
				this.controller,
				this._isCompact
			);
			productView.render(elem);
			this.element.appendChild(productView.element);
		});
	}
}
