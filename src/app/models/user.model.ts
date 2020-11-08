export class User {
	constructor(
		public id: string,
		public email: string,
		private token: string,
		public expiryDate: Date,
		public refreshToken: string
	) {}

	getToken() {
		return this.expiryDate.getTime() > new Date().getTime() ? this.token : null;
	}
}
