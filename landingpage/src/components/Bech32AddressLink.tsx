/**
 * Renders a link to the Bech32 address documentation, currently pointing to the Bitcoin wiki.
 */
const Bech32AddressLink: React.FC = () => (
	<a
		className="!text-current underline transition-opacity hover:opacity-75"
		href="https://en.bitcoin.it/wiki/Bech32"
		style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Learn more about Bech32 address"
	>
		Bech32 address
	</a>
);

export default Bech32AddressLink;
