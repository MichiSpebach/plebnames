import { useState } from 'react';
import { bitcoinExplorer } from 'plebnames';

const usePlebNameClaimedNames = () => {
	const [claimedNamesOfAddress, setClaimedNamesOfAddress] = useState<string[]>([]);
	
	const getClaimedNamesOfAddress = async (address: string) => {
		setClaimedNamesOfAddress(await bitcoinExplorer.getClaimedNamesOfAddress(address));
	}

	const clearClaimedNamesOfAddress = () => {
		setClaimedNamesOfAddress([]);
	}

	return { claimedNamesOfAddress, getClaimedNamesOfAddress, clearClaimedNamesOfAddress };
}

export default usePlebNameClaimedNames;