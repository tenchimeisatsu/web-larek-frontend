import { IController } from '../../types/controllers/Controller';
import { EventType, AppStateModal } from '../../types/models/AppState';
import { IContacts } from '../../types/models/ShopApi';
import { IFormView } from '../../types/views/View';
import { IEvents } from '../base/events';
import { ModalView } from './View';

export class ContactsFormModalView
	extends ModalView<void>
	implements IFormView
{
	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this.element.setAttribute('id', 'contactsModal');
		this.render();
	}

	render(): void {
		const template = document.querySelector('#contacts') as HTMLTemplateElement;
		const form = template.content.cloneNode(true) as HTMLFormElement;
		const inputs = Array.from(
			form.querySelectorAll('.form__input')
		) as HTMLInputElement[];
		inputs.forEach((input) =>
			input.addEventListener('input', this.checkFilled.bind(this))
		);

		const orderButton = form.querySelector('.button') as HTMLButtonElement;
		this.broker.on(
			EventType.detailsError,
			(error: { detailsError: string }) => {
				orderButton.disabled = true;
				form.querySelector('.form__errors').textContent = error.detailsError;
			}
		);
		orderButton.addEventListener('click', (e) => {
			e.preventDefault();
			const contacts = this._createContacts();
			this.controller.fillContacts(contacts);
			if (this.controller.validateContacts(contacts)) {
				this.controller.createOrder();
				this.controller.clearBasket();
				this.nextModal();
			}
		});

		this.element.querySelector('.modal__content').appendChild(form);
	}

	nextModal(): void {
		this.controller.setModal(AppStateModal.success);
		this.element.classList.remove('modal_active');
	}

	checkFilled(): void {
		this.element.querySelector('.form__errors').textContent = '';
		const inputs = Array.from(
			this.element.querySelectorAll('.form__input')
		) as HTMLInputElement[];
		const orderButton = this.element.querySelector(
			'.button'
		) as HTMLButtonElement;
		if (inputs.every((input) => input.value !== '')) {
			orderButton.disabled = false;
		} else {
			orderButton.disabled = true;
		}
	}

	private _createContacts(): IContacts {
		const inputs = Array.from(
			this.element.querySelectorAll('.form__input')
		) as HTMLInputElement[];
		const data = inputs.map((input) => input.value);
		return {
			email: data[0],
			phone: data[1],
		};
	}
}
