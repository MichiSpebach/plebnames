import { PlebNameData } from 'plebnames';
import React, { useState } from 'react';
import { InscriptionSelectOption } from './InscriptionSelectOption';
import { LuCheck as Check } from 'react-icons/lu';

export type InscriptionKey = 'custom' | keyof PlebNameData;
type SelectOption = {key: InscriptionKey, displayName: string, inputPlaceholder: string, inputType: 'text'|'url'}

export const predefinedSelectOptions: SelectOption[] = [
	{key: 'nostr', displayName: 'Nostr', inputPlaceholder: `enter your nostr address starting with 'npub'`, inputType: 'text'},
	{key: 'website', displayName: 'Website', inputPlaceholder: 'enter the website-url', inputType: 'url'},
	{key: 'lightningAddress', displayName: 'Lightning Address', inputPlaceholder: 'enter a lightning address', inputType: 'text'},
	{key: 'owner', displayName: 'Owner', inputPlaceholder: 'enter the new owner address', inputType: 'text'},
]
const customSelectOption: SelectOption = {key: 'custom', displayName: 'Custom Field', inputPlaceholder: 'your value', inputType: 'text'}

function getSelectOption(dataField: string): SelectOption {
	return predefinedSelectOptions.find(option => option.key === dataField)?? customSelectOption
}

const InscriptionForm: React.FC<{
	plebname: string;
	reservedFields: string[]
	inscription: InscriptionSelectOption;
	onInscriptionChange: (output: InscriptionSelectOption) => void;
	className?: string;
}> = ({ plebname, inscription, reservedFields, onInscriptionChange, className }) => { 
	const [selectedOption, setSelectedOption] = useState<SelectOption>(getSelectOption(inscription.dataField));
	const [customOption, setCustomOption] = useState<string | undefined>(undefined);
	const [value, setValue] = useState(inscription.value);

	let error: string|undefined = undefined
	if (inscription.dataField.length > 0 && reservedFields.filter(field => field === inscription.dataField).length > 1) {
		error = `Duplicate inscription for '${inscription.dataField}'.`
	}

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
		<div className={className}>
			{/* <div className="flex space-x-2 flex-row flex-wrap justify-start items-start"> */}
			{/* <div className="modifyConfigSelect inline-flex items-center space-x-2"> */}
			<div className="modifyConfigSelect flex flex-row flex-wrap items-center justify-start gap-x-3 gap-y-1">
				<label className='font-bold'>OP_RETURN:{' '}</label>

				<select
					name="alterKeySelect"
					className="!rounded-md !border !bg-gray-100 !px-3 !h-auto !text-lg !font-normal"
					value={inscription.option}

					onChange={(e) => {
						e.preventDefault();
						const newSelectedOption = getSelectOption(e.target.value);
						const newCustomOption = newSelectedOption.key === 'custom' ? '' : undefined
						setSelectedOption(newSelectedOption);
						setCustomOption(newCustomOption);
						onInscriptionChange(new InscriptionSelectOption(newSelectedOption.key, newCustomOption?? newSelectedOption.key, inscription.value));
					}}
				>
					{predefinedSelectOptions.filter(option => option.key === inscription.option || !reservedFields.includes(option.key)).map(option => 
						<option key={option.key} value={option.key}>{option.displayName}</option>
					)}
					<option value={customSelectOption.key}>{customSelectOption.displayName}</option>
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
						className="border-gray-300 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
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
					className="border-gray-300 flex-1 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
				/>

				{inscription.isValid() && <Check className="text-green-500" />}
			</div>

			{error &&
				<p className="mb-2 mt-2 rounded-md bg-yellow-300 p-2 text-black">
					{error}
				</p>
			}
		
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

			{(selectedOption.key === 'owner' || customOption === 'owner') && (
				<p className="mb-2 mt-2 rounded-md bg-yellow-300 p-2 text-black">
					<b>Warning: </b>
					Changing the owner transfers control of '{plebname}' to
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
};

export default InscriptionForm;
