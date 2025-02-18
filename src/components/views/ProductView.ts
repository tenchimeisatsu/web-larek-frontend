import { IProduct } from '../../types/models/ShopApi';
import { CDN_URL } from '../../utils/constants';
import { ensureElement, priceWithUnit, setCategory } from '../../utils/utils';
import { IEvents } from '../base/events';
import { View } from './View';

export class ProductView extends View<IProduct> {
	private _isCompact: boolean;
	private _cardTitle: HTMLElement;
	private _cardPrice: HTMLElement;
	private _itemIndex?: HTMLElement;
	private _deleteButton?: HTMLButtonElement;
	private _cardCategory?: HTMLElement;
	private _cardImage?: HTMLImageElement;
	private _productId: string;

	constructor(
		broker: IEvents,
		element: HTMLElement,
		isCompact: boolean,
		onClick: (id: string) => void
	) {
		super(broker, element, onClick);
		this._isCompact = isCompact;
		this._productId = '';
		this._cardTitle = ensureElement<HTMLElement>('.card__title', this.element);
		this._cardPrice = ensureElement<HTMLElement>('.card__price', this.element);

		if (isCompact) {
			this._itemIndex = ensureElement<HTMLElement>(
				'.basket__item-index',
				this.element
			);
			this._deleteButton = ensureElement<HTMLButtonElement>(
				'.basket__item-delete',
				this.element
			);
			this._deleteButton.addEventListener('click', () =>
				onClick(this._productId)
			);
		} else {
			this.element.addEventListener('click', () => onClick(this._productId));
			this._cardCategory = ensureElement<HTMLElement>(
				'.card__category',
				this.element
			);
			this._cardImage = ensureElement<HTMLImageElement>(
				'.card__image',
				this.element
			);
		}
	}

	render(data?: Partial<IProduct & { index: number }>): HTMLElement {
		this._productId = data.id;
		this._cardTitle.textContent = data.title;
		this._cardPrice.textContent = priceWithUnit(data.price);
		if (this._isCompact) {
			this._itemIndex.textContent = data.index.toString();
		} else {
			setCategory(this._cardCategory, data.category);
			this._cardImage.src = CDN_URL + data.image;
		}
		return this.element;
	}
}
