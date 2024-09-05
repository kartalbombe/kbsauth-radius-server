import fetch from 'node-fetch';
import { IAuthentication } from '../interfaces/Authentication.js';
import { IContextLogger, ILogger } from '../interfaces/Logger.js';

interface IHTTPAuthOptions {
	url: string;
	secret: string;
}

export class KBSAuth implements IAuthentication {
	private url: string;

	private secret: string;

	private logger: IContextLogger;

	constructor(config: IHTTPAuthOptions, logger: ILogger) {
		this.url = config.url;
		this.secret = config.secret;
		this.logger = logger.context('KBSAuth');

	}

	async authenticate(username: string, password: string) {
		const result = await fetch(this.url, {
			method: 'post',
			body: JSON.stringify({
				email: username,
				password,
				secret: this.secret,
			}),
			headers: { 'Content-Type': 'application/json' },
		});

		

		if (result.status === 200) {
			return true;
		}

		this.logger.log(`HTTP authentication failed, response code: ${result.status}`);

		return false;
	}
}
