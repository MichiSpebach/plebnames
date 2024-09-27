import { useState } from 'react';
// import * as plebNames from 'plebnames';
import { PlebNameHistory, bitcoinExplorer } from 'plebnames';

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
			status: StatusTypes.Claimed;
			history: PlebNameHistory;
			queryString: string;
	  }
	| {
			status: StatusTypes.Loading;
			queryString: string;
			history: null;
	  }
	| {
			status: StatusTypes.NotSearched;
			queryString: null;
			history: null;
	  }
	| {
			status: StatusTypes.Unclaimed;
			queryString: string;
			history: null;
	  };

/**
 * Hook for the plebName Search.
 */
const usePlebNameSearch = () => {
	const [data, setData] = useState<DataTypes>({
		status: StatusTypes.NotSearched,
		history: null,
		queryString: null,
	});

	/** Handles Search Input */
	const handleSearch = async (_query: string) => {
		if (_query.length < 1) {
			setData({
				status: StatusTypes.NotSearched,
				history: null,
				queryString: null,
			});
			alert('Please enter a name.');
			return;
		}
		setData({
			status: StatusTypes.Loading,
			history: null,
			queryString: _query,
		});

		console.log('Searching for:', _query);

		try {
			const history = await bitcoinExplorer.followNameHistory(_query);

			if (history === 'unclaimed') {
				setData({
					status: StatusTypes.Unclaimed,
					history: null,
					queryString: _query,
				});
			} else {
				setData({
					status: StatusTypes.Claimed,
					history,
					queryString: _query,
				});
			}
		} catch (error) {
			console.error('Error searching for name:', error);
			setData({
				status: StatusTypes.NotSearched,
				history: null,
				queryString: null,
			});
			alert('An error occurred while searching. Please try again.');
		}
	};

	return { handleSearch, ...data };
};

export default usePlebNameSearch;
