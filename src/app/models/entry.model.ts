import { Tag } from './tag.model';

export interface Entry {
	id?: string;
	name: string;
	duration: number;
	start: Date;
	end: Date;
	tags?: Tag[];
	isOpen?: boolean;
}
