import { GeneralExplorerAdapter } from './GeneralExplorerAdapter.ts';
import { Transaction } from './Transaction.ts';
import { Transactions } from './Transactions.ts';
import { type UTXO, sortUTXOs } from './UTXO.ts';

export interface BlockstreamAuthCredentials {
	CLIENT_ID: string;
	CLIENT_SECRET: string;
}

export interface BlockstreamAccessTokenResponse {
	access_token: string;
	id_token: string;
	expires_in: number;
	refresh_expires_in: number;

	expiryDate: Date;
}

export class BlockstreamExplorerAdapter extends GeneralExplorerAdapter {
	private readonly PUBLIC_API_URL = 'https://blockstream.info/api';
	private readonly ENTERPRISE_API_URL = 'https://enterprise.blockstream.info/api';
	private readonly TOKEN_REFRESH_BUFFER_IN_MS = 10_000;

	private readonly auth?: BlockstreamAuthCredentials;
	private authResponse?: BlockstreamAccessTokenResponse;

	constructor(auth?: BlockstreamAuthCredentials) {
		super();
		this.auth = auth;
	}

	private isAccessTokenValid(): boolean {
		return (
			!!this.authResponse &&
			this.authResponse.expiryDate.getTime() >
				Date.now() + this.TOKEN_REFRESH_BUFFER_IN_MS
		);
	}

	private async fetchAccessToken(): Promise<void> {
		if (!this.auth) {
			throw new Error(
				'BlockstreamExplorerAdapter::fetchAccessToken: No auth provided',
			);
		}

		const url =
			'https://login.blockstream.com/realms/blockstream-public/protocol/openid-connect/token';
		const params = new URLSearchParams();
		params.append('client_id', this.auth.CLIENT_ID);
		params.append('client_secret', this.auth.CLIENT_SECRET);
		params.append('grant_type', 'client_credentials');
		params.append('scope', 'openid');

		const response: Response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: params,
		}).catch((error) => {
			throw new Error(
				`BlockstreamExplorerAdapter::fetchAccessToken: ${error}`,
			);
		});

		if (!response.ok) {
			throw new Error(
				`BlockstreamExplorerAdapter::fetchAccessToken: ${response.status}, ${await response.text()}`,
			);
		}

		this.authResponse =
			(await response.json()) as BlockstreamAccessTokenResponse;
		this.authResponse.expiryDate = new Date(
			Date.now() + this.authResponse.expires_in * 1_000,
		);
	}

	private async fetchEndpoint(endpoint: string): Promise<Response> {
		const headers: HeadersInit = {};
		let baseUrl = this.PUBLIC_API_URL;

		if (this.auth) {
			if (!this.isAccessTokenValid()) {
				await this.fetchAccessToken();
			}

			if (this.authResponse) {
				headers.Authorization = `Bearer ${this.authResponse.access_token}`;
				baseUrl = this.ENTERPRISE_API_URL;
			} else {
				console.warn(
					'BlockstreamExplorerAdapter::fetch: No auth response',
				);
			}
		}

		return await fetch(baseUrl + endpoint, { headers });
	}

	public override async getTransactionsOfAddress(
		address: string,
	): Promise<Transactions> {
		const query: string = `/address/${address}/txs`;
		const response: Response = await this.fetchEndpoint(query);
		if (!response.ok) {
			throw new Error(
				`BlockstreamExplorerAdapter::getTransactionsOfAddress(${address}) failed: ${response.status}, ${await response.text()}`,
			);
		}
		const json: any = await response.json();
		return {
			n_tx: json.length,
			txs: json.map(Transaction.fromBlockstreamOrMempoolTransaction),
		};
	}

	public override async getUtxosOfAddress(address: string): Promise<UTXO[]> {
		const query: string = `/address/${address}/utxo`;
		const response: Response = await this.fetchEndpoint(query);
		if (!response.ok) {
			throw new Error(
				`BlockstreamExplorerAdapter::getUtxosOfAddress(${address}) failed: ${response.status}, ${await response.text()}`,
			);
		}
		const json: any = await response.json();
		return sortUTXOs(json);
	}
}
