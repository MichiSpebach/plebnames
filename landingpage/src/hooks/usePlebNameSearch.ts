import { useState } from 'react';
// import * as plebNames from 'plebnames';
import { PlebNameHistory, bitcoinExplorer } from 'plebnames';
import generatePAExplanationForName, {
	PlebAddressExplainedType,
} from '../utils/explainPlebAddress';
import * as localStorageAdapter from '../localStorageAdapter';

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
			queryString?: null;
			history?: null;
			paExplanation?: null;
			tipToInscribeWebsite?: false;
	  }
	| {
			status: StatusTypes.Loading;
			queryString: string;
			history?: null;
			paExplanation?: null;
			tipToInscribeWebsite?: false;
	  }
	| {
			status: StatusTypes.Claimed;
			history: PlebNameHistory;
			queryString: string;
			paExplanation: PlebAddressExplainedType;
			tipToInscribeWebsite?: boolean;
	  }
	| {
			status: StatusTypes.Unclaimed;
			queryString: string;
			history?: null;
			paExplanation: PlebAddressExplainedType;
			tipToInscribeWebsite?: false;
	  };

const getInitialData: () => DataTypes = () => {
	const name: string|null = localStorageAdapter.popPlebName()
	if (!name) {
		return {
			status: StatusTypes.NotSearched,
		}
	}
	const history: PlebNameHistory|null = localStorageAdapter.popPlebNameHistory()
	const tipToInscribeWebsite: boolean = localStorageAdapter.popTipToInscribeWebsite()
	if (history instanceof PlebNameHistory) {
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
			});
			alert('Please enter a name.');
			return;
		}
		setData({
			status: StatusTypes.Loading,
			queryString: _query,
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
				});
			} else {
				setData({
					status: StatusTypes.Claimed,
					history,
					queryString: _query,
					paExplanation,
				});
			}
		} catch (error) {
			console.error('Error searching for name:', error);
			setData({
				status: StatusTypes.NotSearched,
			});
			alert('An error occurred while searching. Please try again.');
		}
	};

	return { handleSearch, data };
};

export default usePlebNameSearch;
