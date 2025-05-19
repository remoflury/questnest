export type CustomFileProps<Type extends string = string> = {
	fileBase64: string;
	name: string;
	type: Type;
};

export type HeadingTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HttpStatus =
	| 200
	| 201
	| 202
	| 203
	| 204
	| 205
	| 206
	| 300
	| 301
	| 302
	| 303
	| 304
	| 305
	| 307
	| 400
	| 401
	| 402
	| 403
	| 404
	| 405
	| 406
	| 407
	| 408
	| 409
	| 410
	| 411
	| 412
	| 413
	| 414
	| 415
	| 416
	| 417
	| 500
	| 501
	| 502
	| 503
	| 504
	| 505;

export type ApiResponse<T = undefined> = T extends undefined
	? {
			payload?: T;
			message?: string;
			status: HttpStatus;
		}
	: {
			payload: T;
			message?: string;
			status: HttpStatus;
		};

export type SeoProps = {
	seoPageTitle: string | null;
	seoPageDescription: string | null;
	seoKeywords?: string | null;
	seoCanonical?: string | null;
	seoRobots?: string[];
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogUrl?: string;
};
