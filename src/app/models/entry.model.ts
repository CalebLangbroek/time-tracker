import { Tag } from './tag.model';
import { Project } from './project.model';

export interface Entry {
	id?: string;
	name: string;
	duration: number;
	start: Date;
	end: Date;
	tags?: Tag[];
	project?: Project;
	isOpen?: boolean;
}
