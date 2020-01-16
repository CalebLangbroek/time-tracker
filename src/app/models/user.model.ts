export class User {
	constructor(
		public id: string,
		public email: string,
		private token: string,
		public expiryDate: Date
	) {}

	getToken() {
		return this.expiryDate.getTime() > new Date().getTime() ? this.token : null;
	}
}
