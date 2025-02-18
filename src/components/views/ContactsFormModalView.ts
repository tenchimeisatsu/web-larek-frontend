import { EventType, AppStateModal } from '../../types/models/AppState';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ModalView } from './View';

export class ContactsFormModalView extends ModalView<{
	contactsError: string;
}> {
	private _inputs: HTMLInputElement[];
	private _button: HTMLButtonElement;
	private _formErrors: HTMLElement;

	constructor(broker: IEvents, element: HTMLElement, template: HTMLElement) {
		super(broker, element, template);
		this._inputs = ensureAllElements<HTMLInputElement>(
			'.form__input',
			this.template
		);
		this._button = ensureElement<HTMLButtonElement>('.button', this.template);
		this._formErrors = ensureElement<HTMLElement>(
			'.form__errors',
			this.template
		);
		this._inputs.forEach((input) =>
			input.addEventListener('input', () => this._changeFormHandler())
		);
		this._button.addEventListener('click', (e) => {
			e.preventDefault();
			this.nextModal();
		});
	}

	nextModal(): void {
		this.broker.emit(EventType.nextModal, { modal: AppStateModal.success });
		this.broker.emit(EventType.createOrder);
	}

	render(error: { contactsError: string }): HTMLElement {
		console.log(error);
		if (error.contactsError) {
			this._formErrors.textContent = error.contactsError;
			this._button.disabled = true;
		} else {
			this._formErrors.textContent = '';
			this._button.disabled = false;
		}
		return this.element;
	}

	private _changeFormHandler(): void {
		const data = this._inputs.map((input) => input.value);
		this.broker.emit(EventType.changeContactsForm, {
			email: data[0],
			phone: data[1],
		});
	}
}
