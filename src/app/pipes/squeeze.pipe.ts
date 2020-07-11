import { Pipe, PipeTransform } from '@angular/core';

const BEGINNING_LENGTH = 5;
const END_LENGTH = 5;

@Pipe({
	name: 'squeeze',
})
export class SqueezePipe implements PipeTransform {
	transform(value: string, ...args: any[]): String {
		const splitOnWhiteSpace = value.split(/\s+/g);
		const beginningLength = args[0] ? args[0] : BEGINNING_LENGTH;
		const endLength = args[1] ? args[1] : END_LENGTH;

		if (beginningLength + endLength >= splitOnWhiteSpace.length) {
			return value;
		}

		const beginning = splitOnWhiteSpace.slice(0, beginningLength).join(' ');
		const end = splitOnWhiteSpace.slice(-endLength).join(' ');

		return `${beginning}...${end}`;
	}
}
