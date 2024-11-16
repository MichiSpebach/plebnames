import React, { useEffect, useRef, useState } from 'react';
// import { Search } from 'lucide-react';
import { HiOutlineSearch } from 'react-icons/hi';

interface SearchInputProps {
	onSearch: (query: string) => void;
	initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, initialQuery = '' }) => {
	const [query, setQuery] = useState(initialQuery);

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
				className="w-full rounded-full border border-gray-100 bg-white/15 py-4 pl-6 pr-16 text-xl placeholder-white transition focus:border-transparent focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500"
				// style={{
				// 	borderTopLeftRadius: '2rem',
				// 	borderTopRightRadius: '2rem',
				// 	borderBottomLeftRadius: '2rem',
				// 	borderBottomRightRadius: '0rem',
				// }}
			/>
			<div className="absolute right-0 flex aspect-square h-full bg-red-500/0 align-middle">
				<div className="flex h-full w-full items-center justify-center bg-green-500/0 p-1 transition-all hover:p-0">
					<button
						type="submit"
						className="flex flex-1 items-center justify-center rounded-full bg-amber-500 text-white"
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
