import { AppStateModal, EventType } from '../../types/models/AppState';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ModalView } from './View';

export class DetailsFormModalView extends ModalView<{ detailsError: string }> {
	private _altButtons: HTMLButtonElement[];
	private _input: HTMLInputElement;
	private _orderButton: HTMLButtonElement;
	private _formErrors: HTMLElement;

	constructor(broker: IEvents, element: HTMLElement, template: HTMLElement) {
		super(broker, element, template);
		this._altButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.template
		);
		this._input = ensureElement<HTMLInputElement>(
			'.form__input',
			this.template
		);
		this._orderButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.template
		);
		this._formErrors = ensureElement<HTMLElement>(
			'.form__errors',
			this.template
		);
		this._altButtons[0].addEventListener('click', () => {
			this._altButtonHandler(this._altButtons, 0);
		});
		this._altButtons[1].addEventListener('click', () => {
			this._altButtonHandler(this._altButtons, 1);
		});
		this._input.addEventListener('input', () => this._changeFormHandler());
		this._orderButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.nextModal();
		});
	}

	nextModal(): void {
		this.broker.emit(EventType.nextModal, { modal: AppStateModal.contacts });
	}

	render(error: { detailsError: string }): HTMLElement {
		if (error.detailsError) {
			this._formErrors.textContent = error.detailsError;
			this._orderButton.disabled = true;
		} else {
			this._formErrors.textContent = '';
			this._orderButton.disabled = false;
		}
		return this.element;
	}

	private _altButtonHandler(
		buttons: HTMLButtonElement[],
		toggleElement: number
	): void {
		buttons[toggleElement].classList.toggle('button_alt-active');
		buttons[buttons.length - toggleElement - 1].classList.remove(
			'button_alt-active'
		);
		this._changeFormHandler();
	}

	private _changeFormHandler(): void {
		const activeButton = this._altButtons.find((b) =>
			b.classList.contains('button_alt-active')
		);
		const paymentType = activeButton ? activeButton.getAttribute('name') : null;
		const address = this._input.value;
		this.broker.emit(EventType.changeDetailsForm, {
			payment: paymentType,
			address: address,
		});
	}
}
