import { useCallback, useState } from 'react';
import { LuCheck as Check, LuCopy as Copy } from 'react-icons/lu';

const CopyButton: React.FC<{text: string}> = ({ text }) => {
	const [copied, setCopied] = useState(false);
	
	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [text]);

	return (
		<span
			className="group inline-flex items-center justify-center pl-2 align-middle text-sm cursor-pointer"
			aria-live="polite"
			aria-label={copied ? 'Text copied' : 'Copy text'}
			title={copied ? 'Text copied' : 'Copy to clipboard'}
			onClick={handleCopy}
		>
			{copied ? (
				<Check className="text-green-500" aria-hidden="true" />
			) : (
				<Copy
					className="text-gray-500 group-hover:text-blue-500"
					aria-hidden="true"
				/>
			)}
		</span>
	)
}

export default CopyButton;