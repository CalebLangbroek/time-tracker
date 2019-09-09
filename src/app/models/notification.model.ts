type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export interface Notification {
	message: string;
	type: NotificationType;
}
