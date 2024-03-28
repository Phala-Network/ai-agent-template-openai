export interface SerializedRequest {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT';
    path: string;
    queries: Record<string, string[]>;
    headers: Record<string, string>;
    body?: string;
    secret?: Record<string, unknown>;
}

export class Request implements SerializedRequest {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT';
    path: string;
    queries: Record<string, string[]>;
    headers: Record<string, string>;
    body?: string;
    secret?: Record<string, unknown>;
    constructor(raw: SerializedRequest) {
        this.body = raw.body;
        this.queries = raw.queries;
        this.headers = raw.headers;
        this.method = raw.method;
        this.path = raw.path;
        this.secret = raw.secret;
    }
    async json(): Promise<any> {
        return JSON.parse(this.body!)
    }
}

type ResponseOption = {
    status?: number,
    headers?: Record<string, string>
}
export class Response {
    status: number;
    body?: string;
    headers: Record<string, string>;
    constructor(body: string, options?: ResponseOption) {
        this.status = options?.status ?? 200;
        this.body = body;
        this.headers = {
            'Content-Type': 'text/html; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            ...options?.headers
        }
    }
}

export type RouteConfig = {
    GET?: (req: Request) => Promise<Response>,
    POST?: (req: Request) => Promise<Response>,
    PATCH?: (req: Request) => Promise<Response>,
    PUT?: (req: Request) => Promise<Response>,
}

export async function route(config: RouteConfig, request: string) {
    const reqObj: SerializedRequest = JSON.parse(request)
    let response: Response;
    const method = reqObj.method
    const req = new Request(reqObj)
    if (method == 'GET' && config.GET) {
        response = await config.GET(req);
    } else if (method == 'POST' && config.POST) {
        response = await config.POST(req);
    } else if (method == 'PATCH' && config.PATCH) {
        response = await config.PATCH(req);
    } else if (method == 'PUT' && config.PUT) {
        response = await config.PUT(req);
    } else {
        response = new Response('Not Found');
        response.status = 404
    }
    return JSON.stringify(response)
}

// Only works for ascii string
export function stringToHex(str: string): string {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return '0x' + hex;
}
