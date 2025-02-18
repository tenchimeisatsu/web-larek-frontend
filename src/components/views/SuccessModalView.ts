import { IOrderResponse } from '../../types/models/ShopApi';
import { ensureElement, priceWithUnit } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ModalView } from './View';

export class SuccessModalView extends ModalView<IOrderResponse> {
	private _successParagraph: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(broker: IEvents, element: HTMLElement, template: HTMLElement) {
		super(broker, element, template);
		this._successParagraph = ensureElement<HTMLElement>(
			'.order-success__description',
			this.template
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.template
		);
		this._button.addEventListener('click', () => this.nextModal());
	}

	nextModal(): void {
		this.closeModal();
	}

	render(data?: Partial<IOrderResponse>): HTMLElement {
		this._successParagraph.textContent = `Списано ${priceWithUnit(data.total)}`;
		return this.element;
	}
}
