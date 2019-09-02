export interface TrackerEntry {
	name: string;
	duration: number;
	start: Date;
	end?: Date;
	opened?: boolean;
}
