import { EventType } from '../../types/models/AppState';
import { IProduct } from '../../types/models/ShopApi';
import { CDN_URL } from '../../utils/constants';
import { setCategory, priceWithUnit, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ModalView } from './View';

export class ProductModalView extends ModalView<IProduct> {
	private _cardImage: HTMLImageElement;
	private _cardCategory: HTMLElement;
	private _cardTitle: HTMLElement;
	private _cardText: HTMLElement;
	private _cardPrice: HTMLElement;
	private _button: HTMLButtonElement;
	private _productId: string;
	private _buyHandler: () => void;
	private _nextHandler: () => void;

	constructor(
		broker: IEvents,
		element: HTMLElement,
		template: HTMLElement,
		onClick: (id: string) => void
	) {
		super(broker, element, template, onClick);
		this._productId = '';
		this._buyHandler = () => this.onClick(this._productId);
		this._nextHandler = () => this.nextModal();
		this._cardImage = ensureElement<HTMLImageElement>(
			'.card__image',
			this.template
		);
		this._cardCategory = ensureElement<HTMLElement>(
			'.card__category',
			this.template
		);
		this._cardTitle = ensureElement<HTMLElement>('.card__title', this.template);
		this._cardText = ensureElement<HTMLElement>('.card__text', this.template);
		this._cardPrice = ensureElement<HTMLElement>('.card__price', this.template);
		this._button = ensureElement<HTMLButtonElement>('.button', this.template);
		this.inBasket(false);
	}

	nextModal(): void {
		this.broker.emit(EventType.openBasket);
	}
	render(data?: Partial<IProduct>): HTMLElement {
		this._cardImage.src = CDN_URL + data.image;
		setCategory(this._cardCategory, data.category);
		this._cardTitle.textContent = data.title;
		this._cardText.textContent = data.description;
		this._cardPrice.textContent = priceWithUnit(data.price);
		this._productId = data.id;
		return this.template;
	}

	inBasket(inBasket: boolean) {
		if (inBasket) {
			this._button.textContent = 'В корзину';
			this._button.removeEventListener('click', this._buyHandler);
			this._button.addEventListener('click', this._nextHandler);
		} else {
			this._button.textContent = 'Купить';
			this._button.removeEventListener('click', this._nextHandler);
			this._button.addEventListener('click', this._buyHandler);
		}
	}
}
