import { useState } from 'react'
import MarkedTextWithCopy from './MarkedTextWithCopy'

export const TransactionCopyAreaWithInstructions: React.FC<{transactionInHex: string, copyAreaDisabled?: boolean}> = ({ transactionInHex, copyAreaDisabled }) => {
	const [selectedTab, setSelectedTab] = useState<'hex'|'electrum'|'sparrow'>('hex')
	
	return (
		<div>
			<div>
				{createTabHead('hex', 'Copy transaction in hex')}
				{/* {createTabHead('electrum', 'Electrum instructions')}
				{createTabHead('sparrow', 'Sparrow instructions')} */}
			</div>
			{selectedTab === 'hex' &&
				<div style={copyAreaDisabled ? {pointerEvents: 'none', userSelect: 'none', opacity: '0.5'} : {}}>	
					<MarkedTextWithCopy clickToCopy>
						{transactionInHex}
					</MarkedTextWithCopy>
				</div>
			}
			{selectedTab === 'electrum' &&
				<div>
					<div>{'Tools -> Load Transaction -> From text'}</div>
				
				</div>
			}
			{selectedTab === 'sparrow' &&
				<div>TODO: instructions with screenshots</div>
			}
		</div>
	)

	function createTabHead(option: 'hex'|'electrum'|'sparrow', title: string): JSX.Element {
		return <span
			className={`border-gray-30 rounded-t-md border-x border-t ${selectedTab === option ? '' : 'border-b bg-gray-100'} px-2 py-1 mx-1`}
			style={{display: 'inline-block', cursor: 'pointer'}}
			onClick={() => setSelectedTab(option)}
		>
			{title}
		</span>
	}
}
