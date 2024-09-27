import React, { useState } from 'react';
import { util } from 'plebnames';

/** Allowed Keys */
type AlterOptionKey =
	| 'nostr'
	| 'website'
	| 'owner'
	| 'lightningAddress'
	| 'any';

const AlterConfigForName: React.FC<{
	queryString: string;
	currentOwner: string;
	// We might want to add later a config object.
}> = ({ queryString, currentOwner }) => {
	const [selectedOption, setSelectedOption] =
		useState<AlterOptionKey>('website');

	/** Only needed when any is selected */
	const [alterKeyInput, setAlterKeyInput] = useState<string | undefined>(
		undefined,
	);
	/** The value which will be altered to the name. */
	const [alterValueInput, setAlterValueInput] = useState('');

	const handleOptionChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = event.target.value as AlterOptionKey;
		setSelectedOption(value);
		setAlterKeyInput(value === 'any' ? '' : undefined);
	};

	const RAW_ASCII_ScriptValue = `${queryString}.${selectedOption === 'any' ? alterKeyInput : selectedOption}=${alterValueInput}`;
	const opReturnScript =
		`script(OP_RETURN ${util.asciiToHex(RAW_ASCII_ScriptValue)})` as const;

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
		<div className="flex flex-col text-white">
			<h3 className="mb-2 text-2xl font-bold">
				Modify Configuration for: "{queryString}"
			</h3>

			<div className="modifyConfigSelect inline-flex items-center space-x-2">
				<select
					name="alterKeySelect"
					className="rounded px-3 py-2 font-bold"
					value={selectedOption}
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
						className="rounded bg-black/15 px-3 py-2 text-white placeholder:text-gray-200"
					/>
				)}
				<span className="text-white">=</span>
				<input
					type={valueInputHMLType}
					placeholder={valueInputHTMLPlaceholder}
					id="alterValue"
					value={alterValueInput}
					onChange={(e) => {
						e.preventDefault();
						setAlterValueInput(e.target.value.trim());
					}}
					className="flex-1 rounded bg-black/15 px-3 py-2 text-white placeholder:text-gray-200"
				/>
			</div>

			{!healthyInput && (
				<p className="mb-3 mt-5 rounded-lg bg-red-300 p-2 text-black">
					Please fill in all required fields.
				</p>
			)}

			<p className="mb-4">
				To update the data for '{queryString}', send the following
				OP_RETURN script from the address '{currentOwner}' (e.g., using
				Electrum) with an amount of 0:
			</p>

			<div className="mb-4 flex items-center">
				<span className="mr-2 rounded bg-black/15 px-4 py-2 text-white">
					{opReturnScript}
				</span>
				<button
					className="rounded bg-white px-4 py-2 font-mono text-lg font-bold text-black transition hover:scale-95 hover:opacity-80"
					onClick={() => {
						if (healthyInput) {
							navigator.clipboard.writeText(opReturnScript);
						} else {
							alert('Please fill in all required fields!');
						}
					}}
					style={{
						opacity: healthyInput ? 'unset' : 0.4,
					}}
				>
					📋 Copy
				</button>
			</div>

			{selectedOption === 'owner' && (
				<p className="mb-3 rounded-lg bg-yellow-300 p-2 text-black">
					<b>Warning: </b>
					Changing the owner transfers control of '{queryString}' to
					another address. Please double-check the new owner address,
					as this action cannot be undone.
					<br />
					There are no checksums put in yet! (TODO)
				</p>
			)}

			<p>
				The script value is encoded in hexadecimal. In ASCII, it reads:
				"{RAW_ASCII_ScriptValue}"
			</p>
		</div>
	);
};

export default AlterConfigForName;
