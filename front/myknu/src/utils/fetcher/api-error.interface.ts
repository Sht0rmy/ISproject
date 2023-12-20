export enum HttpStatusCode {
    Ok = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
}

export interface ApiError {
    statusCode: HttpStatusCode;
    message: string;
}
