import CopyButton from './CopyButton';

const LinkWithCopyButton: React.FC<{
	text: string,
	link: string,
	additionalClassName?: string
}> = ({ text, link, additionalClassName }) => {
	return (
		<>
			<a
				href={link}
				target='_blank'
				rel="noopener noreferrer"
				className={`underline ${additionalClassName ?? ''}`}
				title={`Link to ${link}`}
			>
				{text}
			</a>
			<CopyButton text={text} />
		</>
	)
}

export default LinkWithCopyButton;