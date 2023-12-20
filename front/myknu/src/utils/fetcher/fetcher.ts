import { ApiError as IApiError } from "./api-error.interface";
import { isApiError } from "./is-api-error";

import { ExtendableError } from './errors';

export class ApiError extends ExtendableError {
    statusCode: number;

    constructor(error: IApiError) {
        super(error.message);

        this.statusCode = error.statusCode;
    }
}

export default async function fetcher<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const token = localStorage.getItem('token')

    if(options.method==='POST' ||options.method==='PUT'){
      options.headers={
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token
      }
    }

    const res = await fetch(`http://localhost:5000/` + url, {
        credentials: 'same-origin',
        headers: {'authorization': 'Bearer ' + token},
        ...options,
    });

    const contentType = res.headers.get('Content-Type');
    const contentLength = res.headers.get('Content-Length');



    if (!res.ok) {
        if (needRedirectToLogin(res)) {
            localStorage.setItem('isAuth', '')
            window.location.replace(`/login`);
        } else if (contentType?.includes('application/json')) {
            const data: unknown = await res.json();

            if (isApiError(data)) {
                if (data.statusCode !== res.status) {
                    throw new TypeError('status code in response and body do not match');
                }

                throw new ApiError(data);
            }
        }

        throw new ApiError({
            statusCode: res.status,
            message: res.statusText,
        });
    }

    if (contentType?.includes('application/json')) {
        return res.json();
    }

    if (contentLength && +contentLength === 0) {
        return undefined as unknown as T;
    }

    return res.text() as unknown as T;
}

function needRedirectToLogin(res: Response): boolean {
    const onLoginPage = window.location.pathname.includes('login');
    const onAcceptInvitePage = window.location.pathname.includes('accept-invite');

    return (
        res.status === 401 &&
        !localStorage.getItem('hasCookie') &&
        !onLoginPage &&
        !onAcceptInvitePage
    );
}
