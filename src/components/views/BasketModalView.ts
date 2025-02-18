import { EventType, AppStateModal } from '../../types/models/AppState';
import { IBasket } from '../../types/models/ShopApi';
import { ensureElement, priceWithUnit } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ModalView } from './View';

export class BasketModalView extends ModalView<IBasket> {
	private _list: HTMLElement;
	private _basketButton: HTMLButtonElement;
	private _basketPrice: HTMLElement;
	items?: HTMLElement[];

	constructor(broker: IEvents, element: HTMLElement, template: HTMLElement) {
		super(broker, element, template);
		this._list = ensureElement<HTMLElement>('.basket__list', this.template);
		this._basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.template
		);
		this._basketPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.template
		);
		this._basketButton.addEventListener('click', () => this.nextModal());
		this._basketPrice.textContent = 'Корзина пуста';
		this._basketButton.disabled = true;
	}

	nextModal(): void {
		this.broker.emit(EventType.nextModal, { modal: AppStateModal.details });
	}
	render(data?: Partial<IBasket>): HTMLElement {
		if (this.items.length) {
			this._list.replaceChildren(...this.items);
			this._basketButton.disabled = false;
			this._basketPrice.textContent = data.total
				? priceWithUnit(data.total)
				: '0 синапсов';
		} else {
			this._list.replaceChildren();
			this._basketPrice.textContent = 'Корзина пуста';
			this._basketButton.disabled = true;
		}
		return this.template;
	}
}
