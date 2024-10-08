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
	  }
	| {
			status: StatusTypes.Loading;
			queryString: string;
			history: null;
			paExplanation: null;
	  }
	| {
			status: StatusTypes.Claimed;
			history: PlebNameHistory;
			queryString: string;
			paExplanation: PlebAddressExplainedType;
	  }
	| {
			status: StatusTypes.Unclaimed;
			queryString: string;
			history: null;
			paExplanation: PlebAddressExplainedType;
	  };

/**
 * Hook for the plebName Search.
 */
const usePlebNameSearch = () => {
	const [data, setData] = useState<DataTypes>({
		status: StatusTypes.NotSearched,
		history: null,
		queryString: null,
		paExplanation: null,
	});
	/** Handles Search Input */
	const handleSearch = async (_query: string) => {
		if (_query.length < 1) {
			setData({
				status: StatusTypes.NotSearched,
				history: null,
				queryString: null,
				paExplanation: null,
			});
			alert('Please enter a name.');
			return;
		}
		setData({
			status: StatusTypes.Loading,
			history: null,
			queryString: _query,
			paExplanation: null,
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
				history: null,
				queryString: null,
				paExplanation: null,
			});
			alert('An error occurred while searching. Please try again.');
		}
	};

	return { handleSearch, data };
};

export default usePlebNameSearch;
