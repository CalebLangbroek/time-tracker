export interface TimeEntry {
	name: string;
	duration: number;
	start: Date;
	end?: Date;
	isOpen?: boolean;
}
