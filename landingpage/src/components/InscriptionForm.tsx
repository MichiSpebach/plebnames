import { PlebNameData } from 'plebnames';
import React, { useState } from 'react';
import { InscriptionSelectOption } from './InscriptionSelectOption';
import { LuCheck as Check } from 'react-icons/lu';

export type InscriptionKey = 'custom' | keyof PlebNameData;
type SelectOption = {key: InscriptionKey, inputPlaceholder: string, inputType: 'text'|'url'}

const selectOptions: {[key in InscriptionKey]: SelectOption} = {
	nostr: {key: 'nostr', inputPlaceholder: 'enter your nostr address', inputType: 'text'},
	website: {key: 'website', inputPlaceholder: 'enter the website-url', inputType: 'url'},
	linkTo: {key: 'linkTo', inputPlaceholder: 'deprecated use website instead', inputType: 'url'},
	lightningAddress: {key: 'lightningAddress', inputPlaceholder: 'enter a lightning address', inputType: 'text'},
	owner: {key: 'owner', inputPlaceholder: 'enter the new owner address', inputType: 'text'},
	custom: {key: 'custom', inputPlaceholder: 'your value', inputType: 'text'},
}

const InscriptionForm: React.FC<{
	queryString: string;
	reservedKeys: InscriptionKey[]
	inscription: InscriptionSelectOption;
	required?: boolean;
	onInscriptionChange: (output: InscriptionSelectOption) => void;
	// We might want to add later a config object.
}> = ({ queryString, inscription, reservedKeys, required, onInscriptionChange }) => { 
	const [selectedOption, setSelectedOption] = useState<SelectOption>(selectOptions[inscription.option]);
	const [customOption, setCustomOption] = useState<string | undefined>(undefined);
	const [value, setValue] = useState(inscription.value);

	let error: string|undefined = undefined
	if (required && value.length < 1) {
		error = "Inscription value must not be empty"
	} /*else if(isDuplicate) {
		error = "An inscription with this key already exists"
	}*/

	/**
	 * TODO: Move to Tx Tool. See also below.
	 * If the inputs are fullfield
	 */
	// let healthyInput = false;
	// if (alterValueInput.length > 0) {
	// 	if (selectedOption === 'any') {
	// 		if (alterKeyInput !== undefined) {
	// 			if (alterKeyInput.length > 0) healthyInput = true;
	// 		}
	// 	} else {
	// 		healthyInput = true;
	// 	}
	// }

	return (
		<div>
			{/* <div className="flex space-x-2 flex-row flex-wrap justify-start items-start"> */}
			{/* <div className="modifyConfigSelect inline-flex items-center space-x-2"> */}
			<div className="modifyConfigSelect flex flex-row flex-wrap items-center justify-start gap-3">
				<select
					name="alterKeySelect"
					className="border-gray-30 rounded-md border bg-gray-100 px-3 py-2"
					value={inscription.option}

					onChange={(e) => {
						e.preventDefault();
						const newSelectedOption = e.target.value as InscriptionKey;
						const newCustomOption = newSelectedOption === 'custom' ? '' : undefined
						setSelectedOption(selectOptions[newSelectedOption]);
						setCustomOption(newCustomOption);
						onInscriptionChange(new InscriptionSelectOption(newSelectedOption, newCustomOption?? newSelectedOption, inscription.value));
					}}
				>
					<option value="website">Website</option>
					<option value="nostr">Nostr</option>
					<option value="owner">Owner</option>
					<option value="lightningAddress">Lightning Address</option>
					<option value="custom">Custom Field</option>
				</select>

				{selectedOption.key === 'custom' && (
					<input
						type="text"
						id="alterKey"
						placeholder="Enter custom field name"
						value={customOption}
						onChange={(e) => {
							e.preventDefault();
							const newCustomOption: string = e.target.value.trim()
							setCustomOption(newCustomOption);
							onInscriptionChange(new InscriptionSelectOption(inscription.option, newCustomOption, inscription.value));
						}}
						className="border-gray-30 rounded-sm border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
					/>
				)}

				<span className="font-mono font-bold text-blue-950">=</span>

				<input
					type={selectedOption.inputType}
					placeholder={selectedOption.inputPlaceholder}
					id="alterValue"
					value={value}
					onChange={(e) => {
						e.preventDefault();
						const newValue: string = e.target.value.trim()
						setValue(newValue)
						onInscriptionChange(new InscriptionSelectOption(inscription.option, inscription.dataField, newValue));
					}}
					className="border-gray-30 flex-1 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
				/>

				{inscription.isValid() && <Check className="text-green-500" />}
			</div>

			
			<p hidden={!error} className="mb-3 mt-5 rounded-md bg-yellow-300 p-2 text-black">
				{error}
			</p>
		

		
			{/* 
			TODO: Move this to TransactionTool
			{!healthyInput && (
				<p className="mb-3 mt-5 rounded-md bg-yellow-300 p-2 text-black">
					You have to add at least one inscription to the name.
				</p>
			)} */}

			{/* <p className="mb-4">
				To update the data for '{queryString}', send the following
				OP_RETURN script from the address{' '}
				<span className="font-mono">'{currentOwner}'</span> (e.g., using
				Electrum) with an amount of 0:
			</p> */}

			{/* <div className="mb-4 flex flex-row flex-wrap items-center gap-2">
				<span className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-blue-950">
					{opReturnScript}
				</span>
				<button
					className="inline-flex items-center justify-center rounded-md bg-blue-950 px-4 py-2 font-mono text-lg font-bold text-white transition hover:scale-95 hover:opacity-80"
					onClick={() => {
						if (healthyInput) {
							navigator.clipboard.writeText(opReturnScript);
						} else {
							alert('Please ensure all fields are filled in!');
						}
					}}
					style={{
						opacity: healthyInput ? 'unset' : 0.4,
					}}
				>
					<FaCopy className="mr-2" />
					Copy
				</button>
			</div> */}

			{selectedOption.key === 'owner' && (
				<p className="mb-3 rounded-md bg-yellow-300 p-2 text-black">
					<b>Warning: </b>
					Changing the owner transfers control of '{queryString}' to
					another address. Please double-check the new owner address,
					as this action cannot be undone.
					<br />
					There are no checksums put in yet! (TODO)
				</p>
			)}

			{/* <p>
				The script value is encoded in hexadecimal. In ASCII, it reads:
				'{inscription}'.
			</p>
			<br></br> */}
		</div>
	);

	function chooseInscriptionKey(reservedKeys: InscriptionKey[], choice?: InscriptionKey): SelectOption {
		const customOption: SelectOption = {key: 'custom', inputPlaceholder: 'your value', inputType: 'text'}
		const allOptions: SelectOption[] = [
			{key: 'nostr', inputPlaceholder: 'enter your nostr address', inputType: 'text'},
			{key: 'website', inputPlaceholder: 'enter the website-url', inputType: 'url'},
			{key: 'lightningAddress', inputPlaceholder: 'enter a lightning address', inputType: 'text'},
			{key: 'owner', inputPlaceholder: 'enter the new owner address', inputType: 'text'},
			customOption
		]

		for (const option of allOptions) {
			if (option.key === choice) {
				return option
			}
			if (reservedKeys.includes(option.key) || option.key === 'owner') {
				continue
			}
			return option
		}
		return customOption
	}
};

export default InscriptionForm;
