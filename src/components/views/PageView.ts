import { View } from './View';

export class PageView extends View<never> {
	set lock(active: boolean) {
		if (active) {
			this.element.classList.add('page__wrapper_locked');
		} else {
			this.element.classList.remove('page__wrapper_locked');
		}
	}

	render(): HTMLElement {
		return this.element;
	}
}
