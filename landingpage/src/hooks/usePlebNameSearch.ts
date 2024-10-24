import { useState } from 'react';
// import * as plebNames from 'plebnames';
import { PlebNameHistory, bitcoinExplorer } from 'plebnames';
import generatePAExplanationForName, {
	PlebAddressExplainedType,
} from '../utils/explainPlebAddress';

/**
 * The different statuses our query can have.
 */
export enum StatusTypes {
	/** When the User has not done a search. */
	NotSearched = 'not-searched',
	/** Loading the data */
	Loading = 'loading',
	/** Name is not claimed */
	Unclaimed = 'unclaimed',
	/** Name is claimed */
	Claimed = 'claimed',
}

type DataTypes =
	| {
			status: StatusTypes.NotSearched;
			queryString: null;
			history: null;
			paExplanation: null;
			tipToInscribeWebsite: false;
	  }
	| {
			status: StatusTypes.Loading;
			queryString: string;
			history: null;
			paExplanation: null;
			tipToInscribeWebsite: false;
	  }
	| {
			status: StatusTypes.Claimed;
			history: PlebNameHistory;
			queryString: string;
			paExplanation: PlebAddressExplainedType;
			tipToInscribeWebsite: boolean;
	  }
	| {
			status: StatusTypes.Unclaimed;
			queryString: string;
			history: null;
			paExplanation: PlebAddressExplainedType;
			tipToInscribeWebsite: false;
	  };

const getInitialData: () => DataTypes = () => {
	const name: string|null = window.localStorage.getItem('plebName')
	if (!name) {
		return {
			status: StatusTypes.NotSearched,
			history: null,
			queryString: null,
			paExplanation: null,
			tipToInscribeWebsite: false,
		}
	}
	const historyJson: string|null = window.localStorage.getItem('plebNameHistory')
	const history: PlebNameHistory|null = !historyJson || historyJson === 'unclaimed'
		? null
		: Object.setPrototypeOf(JSON.parse(historyJson!), PlebNameHistory.prototype)
	const tipToInscribeWebsite: boolean = window.localStorage.getItem('tipToInscribeWebsite') ? true : false
	window.localStorage.removeItem('plebName')
	window.localStorage.removeItem('plebNameHistory')
	window.localStorage.removeItem('tipToInscribeWebsite')
	if (history) {
		return {
			status: StatusTypes.Claimed,
			history,
			queryString: name,
			paExplanation: generatePAExplanationForName(name),
			tipToInscribeWebsite,
		}
	} else {
		return {
			status: StatusTypes.Unclaimed,
			history,
			queryString: name,
			paExplanation: generatePAExplanationForName(name),
			tipToInscribeWebsite: false,
		}
	}
}

/**
 * Hook for the plebName Search.
 */
const usePlebNameSearch = () => {
	const [data, setData] = useState<DataTypes>(getInitialData());
	/** Handles Search Input */
	const handleSearch = async (_query: string) => {
		if (_query.length < 1) {
			setData({
				status: StatusTypes.NotSearched,
				history: null,
				queryString: null,
				paExplanation: null,
				tipToInscribeWebsite: false,
			});
			alert('Please enter a name.');
			return;
		}
		setData({
			status: StatusTypes.Loading,
			history: null,
			queryString: _query,
			paExplanation: null,
			tipToInscribeWebsite: false,
		});

		console.log('Searching for:', _query);

		try {
			const history = await bitcoinExplorer.followNameHistory(_query);

			const paExplanation = generatePAExplanationForName(_query);

			if (history === 'unclaimed') {
				setData({
					status: StatusTypes.Unclaimed,
					history: null,
					queryString: _query,
					paExplanation,
					tipToInscribeWebsite: false,
				});
			} else {
				setData({
					status: StatusTypes.Claimed,
					history,
					queryString: _query,
					paExplanation,
					tipToInscribeWebsite: false,
				});
			}
		} catch (error) {
			console.error('Error searching for name:', error);
			setData({
				status: StatusTypes.NotSearched,
				history: null,
				queryString: null,
				paExplanation: null,
				tipToInscribeWebsite: false,
			});
			alert('An error occurred while searching. Please try again.');
		}
	};

	return { handleSearch, data };
};

export default usePlebNameSearch;
