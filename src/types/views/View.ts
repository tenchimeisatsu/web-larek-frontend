export interface IView<T> {
	render(data?: Partial<T>): HTMLElement;
}

export interface IModalView {
	nextModal(): void;
	closeModal(): void;
	openModal(): void;
}
