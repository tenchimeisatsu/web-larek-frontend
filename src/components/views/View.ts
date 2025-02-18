import { EventType } from '../../types/models/AppState';
import { IModalView, IView } from '../../types/views/View';
import { createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export abstract class View<T> implements IView<T> {
	element: HTMLElement;
	protected broker: IEvents;
	protected onClick?: (data?: any) => void;

	constructor(
		broker: IEvents,
		element: HTMLElement,
		onClick?: (data?: any) => void
	) {
		this.broker = broker;
		this.element = element;
		this.onClick = onClick;
	}
	abstract render(data?: Partial<T>): HTMLElement;
}

export abstract class ModalView<T> extends View<T> implements IModalView {
	protected template: HTMLElement;

	constructor(
		broker: IEvents,
		element: HTMLElement,
		template: HTMLElement,
		onClick?: (data?: any) => void
	) {
		super(broker, element, onClick);
		this.template = template;
		this.element
			.querySelector('.modal__close')
			.addEventListener('click', () => this.closeModal());
		this.element.addEventListener('click', (e) => {
			if (e.target === this.element) {
				this.closeModal();
			}
		});
	}
	abstract nextModal(): void;
	closeModal(): void {
		this.element.classList.remove('modal_active');
		this.broker.emit(EventType.closeModal);
	}
	openModal(): void {
		this.applyTemplate();
		this.element.classList.add('modal_active');
		this.broker.emit(EventType.openModal);
	}
	private applyTemplate(): void {
		const oldContent = ensureElement<HTMLElement>(
			'.modal__content',
			this.element
		);
		const newContent = createElement('div');
		newContent.classList.add('modal__content');
		newContent.appendChild(this.template);
		oldContent.replaceWith(newContent);
	}
}
