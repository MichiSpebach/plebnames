import { useState } from 'react'
import MarkedTextWithCopy from './MarkedTextWithCopy'

export const TransactionCopyAreaWithInstructions: React.FC<{transactionInHex: string, copyAreaDisabled?: boolean}> = ({ transactionInHex, copyAreaDisabled }) => {
	const [selectedTab, setSelectedTab] = useState<'hex'|'electrum'|'sparrow'>('hex')
	
	return (
		<div>
	
			{selectedTab === 'hex' &&
				<div style={copyAreaDisabled ? {pointerEvents: 'none', userSelect: 'none', opacity: '0.5'} : {}}>	
					<MarkedTextWithCopy clickToCopy>
						{transactionInHex}
					</MarkedTextWithCopy>
				</div>
			}
		
		</div>
	)

}
