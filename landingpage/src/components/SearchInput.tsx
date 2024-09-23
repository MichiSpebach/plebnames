import React, { useEffect, useRef, useState } from 'react';
// import { Search } from 'lucide-react';
import { HiOutlineSearch } from 'react-icons/hi';

interface SearchInputProps {
	onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
	const [query, setQuery] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Automatically focus the input field when the component mounts
		inputRef?.current?.focus();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(query);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		/**
		 * Remove white spaces, as they are ignored by the standard.
		 * In almost every case, white space input is unintentional.
		 * If it is intentional, it's still beneficial to make it clear that it won't work,
		 * preventing potential confusion.
		 */
		const newValue = e.target.value.replace(/\s/g, '');
		setQuery(newValue);
	};

	return (
		<form onSubmit={handleSubmit} className="relative flex items-center">
			<input
				type="text"
				ref={inputRef}
				placeholder="Search names..."
				value={query}
				onChange={handleInputChange}
				className="w-full py-4 pl-6 pr-16 text-xl rounded-full border border-gray-100 bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
			/>
			<div className="absolute aspect-square h-full right-0 flex align-middle bg-red-500/0">
				<div className="w-full h-full flex items-center justify-center p-1 hover:p-0 transition-all bg-green-500/0">
					<button
						type="submit"
						className="flex-1 flex justify-center items-center text-white bg-amber-500 rounded-full"
						style={{
							aspectRatio: '1', // Keeps the button circular
						}}
					>
						<HiOutlineSearch size={23} />
					</button>
				</div>
			</div>
		</form>
	);
};

export default SearchInput;
