import { PlebNameData, util } from 'plebnames';
import React, { useEffect, useState } from 'react';

/** Allowed Keys */
export type InscriptionKey = keyof PlebNameData
	| 'any';


type Output = { key: InscriptionKey, value: string };


const InscriptionForm: React.FC<{
	queryString: string;
	currentOwner: string;
	inscriptionKey?: InscriptionKey;
	value?: string;
	onInscriptionChange: (output: Output) => void;
	// We might want to add later a config object.
}> = ({ queryString, currentOwner, inscriptionKey: configKey, value, onInscriptionChange }) => { 
	console.log("key", configKey);
	const isReadOnlyOption = !!configKey;
	const [selectedOption, setSelectedOption] =
		useState<InscriptionKey>(configKey ?? 'website');
	const [inscription, setInscription] = useState<string>(value ?? '');

	/** Only needed when any is selected */
	const [alterKeyInput, setAlterKeyInput] = useState<string | undefined>(
		undefined,
	);
	/** The value which will be altered to the name. */
	const [alterValueInput, setAlterValueInput] = useState(value ?? '');

	const handleOptionChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = event.target.value as InscriptionKey;
		setSelectedOption(value);
		setAlterKeyInput(value === 'any' ? '' : undefined);
	};

	useEffect(() => {
		const RAW_ASCII_ScriptValue = `${queryString}.${selectedOption === 'any' ? alterKeyInput : selectedOption}=${alterValueInput}`;
		setInscription(RAW_ASCII_ScriptValue)
	}, [alterKeyInput, alterValueInput, selectedOption]);

	useEffect(() => {
		onInscriptionChange({ key: selectedOption, value: inscription });
	}, [inscription]);

	
	// const opReturnScript =
	// 	`script(OP_RETURN ${util.asciiToHex(inscriptions[0])})` as const;

	// For the value-input element
	let valueInputHTMLPlaceholder: string = 'text';
	let valueInputHMLType: React.HTMLInputTypeAttribute = 'text';
	switch (selectedOption) {
		case 'any':
			valueInputHTMLPlaceholder = 'your value';
			break;
		case 'lightningAddress':
			valueInputHTMLPlaceholder = 'enter a lightning address';
			break;
		case 'nostr':
			valueInputHTMLPlaceholder = 'enter your nostr address';
			break;
		case 'owner':
			valueInputHTMLPlaceholder = 'enter the new owner address';
			break;
		case 'website':
			valueInputHTMLPlaceholder = 'enter the website-url';
			valueInputHMLType = 'url';
			break;
	}

	/**
	 * If the inputs are fullfield
	 */
	let healthyInput = false;
	if (alterValueInput.length > 0) {
		if (selectedOption === 'any') {
			if (alterKeyInput !== undefined) {
				if (alterKeyInput.length > 0) healthyInput = true;
			}
		} else {
			healthyInput = true;
		}
	}

	return (
		<div>
			{/* <div className="flex space-x-2 flex-row flex-wrap justify-start items-start"> */}
			{/* <div className="modifyConfigSelect inline-flex items-center space-x-2"> */}
			<div className="modifyConfigSelect flex flex-row flex-wrap items-center justify-start gap-3">
				<select
					disabled={isReadOnlyOption}
					name="alterKeySelect"
					className="border-gray-30 rounded-md border bg-gray-100 px-3 py-2"
					value={configKey}
					onChange={handleOptionChange}
				>
					<option value="website">Website</option>
					<option value="nostr">Nostr</option>
					<option value="owner">Owner</option>
					<option value="lightningAddress">Lightning Address</option>
					<option value="any">Custom Field</option>
				</select>

				{selectedOption === 'any' && (
					<input
						type="text"
						id="alterKey"
						placeholder="Enter custom field name"
						value={alterKeyInput}
						onChange={(e) => {
							e.preventDefault();
							setAlterKeyInput(e.target.value.trim());
						}}
						className="border-gray-30 rounded-sm border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
					/>
				)}

				<span className="font-mono font-bold text-blue-950">=</span>

				<input
					type={valueInputHMLType}
					placeholder={valueInputHTMLPlaceholder}
					id="alterValue"
					value={alterValueInput}
					onChange={(e) => {
						e.preventDefault();
						setAlterValueInput(e.target.value.trim());
					}}
					className="border-gray-30 flex-1 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
				/>
			</div>

		
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

			{selectedOption === 'owner' && (
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
};

export default InscriptionForm;
