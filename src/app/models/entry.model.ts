export interface Entry {
	id?: string;
	name: string;
	duration: number;
	start: Date;
	end?: Date;
	isOpen?: boolean;
}
