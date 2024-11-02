import { InscriptionKey } from './InscriptionForm'

export class InscriptionSelectOption {
	public constructor(
		public readonly option: InscriptionKey,
		public readonly dataField: string,
		public readonly value: string
	) {}

	public static ofOption(option: InscriptionKey): InscriptionSelectOption {
		if (option === 'custom') {
			return new InscriptionSelectOption(option, '', '')
		}
		return new InscriptionSelectOption(option, option, '')
	}

	public isValueEmpty(): boolean {
		return this.value.length < 1
	}

	public isValid(): boolean {
		return this.dataField.length > 0 && this.value.length > 0
	}

	public getEncodedInAscii(plebname: string): string {
		return `${plebname}.${this.dataField}=${this.value}`
	}
}