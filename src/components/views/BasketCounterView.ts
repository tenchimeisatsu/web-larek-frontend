import { IController } from '../../types/controllers/Controller';
import { EventType, AppStateModal } from '../../types/models/AppState';
import { IEvents } from '../base/events';
import { View } from './View';

export class BasketCounterView extends View<{ counter: number }> {
	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this.broker.on(EventType.updateBasket, (data: { counter: number }) =>
			this.render(data)
		);
		this.element = document.querySelector('.header__basket');
		this.element.addEventListener('click', () =>
			this.controller.setModal(AppStateModal.basket)
		);
	}
	render(data?: { counter: number }): void {
		this.element.querySelector('.header__basket-counter').textContent =
			data.counter.toString();
	}
}
