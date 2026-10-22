"use server";

import db from "@/lib/db";
import { REST_METHOD } from "../../../../prisma/generated/enums";
import axios, { AxiosRequestConfig } from "axios";

export type Request = {
    name: string;
    method: REST_METHOD;
    url: string;
    body?: string;
    headers?: string;
    parameters?: string;
};


export const addRequestToCollection = async (collectionId: string, value: Request) => {
    try {
        const request = await db.request.create({
            data: {
                collectionId,
                name: value.name,
                method: value.method,
                url: value.url,
                body: value.body,
                headers: value.headers,
                parameters: value.parameters,
            }
        });

        return request;
    } catch (error) {
        console.error('Error adding request to collection:', error);
        throw new Error(`Failed to add request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}



export const saveRequest = async (id: string, value: Request) => {
    try {
        console.log('Saving request:', value, id);
        
        const request = await db.request.update({
            where: {
                id: id
            },
            data: {
                name: value.name,
                method: value.method,
                url: value.url,
                body: value.body,
                headers: value.headers,
                parameters: value.parameters,
            },
        });

        return request;
    } catch (error) {
        console.error('Error saving request:', error);
        throw new Error(`Failed to save request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const getAllRequestFromCollection = async (collectionId: string) => {
    try {
        const requests = await db.request.findMany({
            where: {
                collectionId,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return requests;
    } catch (error) {
        console.error('Error fetching requests:', error);
        throw new Error(`Failed to fetch requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function sendRequest(req: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    body?: any;
}) {
    // Validate URL
    try {
        new URL(req.url);
    } catch {
        return {
            error: 'Invalid URL format',
            status: 0,
            statusText: 'Invalid URL',
            duration: 0,
        };
    }

    const config: AxiosRequestConfig = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        params: req.params,
        data: req.body,
        validateStatus: () => true, // ✅ capture errors too
        timeout: 30000, // 30 second timeout
    };

    const start = performance.now();
    try {
        const res = await axios(config);
        const end = performance.now();

        const duration = end - start;
        const size =
            res.headers["content-length"] ||
            new TextEncoder().encode(JSON.stringify(res.data)).length;

        console.log('Request completed:', {
            url: req.url,
            method: req.method,
            status: res.status,
            duration: Math.round(duration)
        });

        return {
            status: res.status,
            statusText: res.statusText,
            headers: Object.fromEntries(Object.entries(res.headers)),
            data: res.data,
            duration: Math.round(duration),
            size,
        };
    } catch (error: any) {
        const end = performance.now();
        console.error('Request failed:', error.message);
        
        return {
            error: error.code === 'ECONNABORTED' ? 'Request timeout' : error.message,
            duration: Math.round(end - start),
            status: 0,
            statusText: error.code || 'Error',
        };
    }
}


export async function run(requestId: string) {
    try {
        const request = await db.request.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            throw new Error(`Request with id ${requestId} not found`);
        }


        const requestConfig = {
            method: request.method,
            url: request.url,
            headers: request.headers as Record<string, string> || undefined,
            params: request.parameters as Record<string, any> || undefined,
            body: request.body || undefined
        };

        const result = await sendRequest(requestConfig);


        const requestRun = await db.requestRun.create({
            data: {
                requestId: request.id,
                status: result.status || 0,
                statusText: result.statusText || (result.error ? 'Error' : null),
                headers: result.headers || "",
                body: result.data ? (typeof result.data === 'string' ? result.data : JSON.stringify(result.data)) : null,
                durationMs: result.duration || 0
            }
        });


        if (result.data && !result.error) {
            await db.request.update({
                where: { id: request.id },
                data: {
                    response: result.data,
                    updatedAt: new Date()
                }
            });
        }

        return {
            success: true,
            requestRun,
            result
        };

    } catch (error: any) {
        try {
            const failedRun = await db.requestRun.create({
                data: {
                    requestId,
                    status: 0,
                    statusText: 'Failed',
                    headers: "",
                    body: error.message,
                    durationMs: 0
                }
            });

            return {
                success: false,
                error: error.message,
                requestRun: failedRun
            };
        } catch (dbError) {
            return {
                success: false,
                error: `Request failed: ${error.message}. DB save failed: ${(dbError as Error).message}`
            };
        }
    }
}


export async function runDirect(requestData: {
    id: string;
    method: string;
    url: string;
    headers?: Record<string, string>;
    parameters?: Record<string, any>;
    body?: any;
}) {
    try {
        const requestConfig = {
            method: requestData.method,
            url: requestData.url,
            headers: requestData.headers,
            params: requestData.parameters,
            body: requestData.body
        };

        const result = await sendRequest(requestConfig);

        // Only save to database if this is not a temporary request
        const isTemporaryRequest = requestData.id.startsWith("temp-");
        
        if (!isTemporaryRequest) {
            const requestRun = await db.requestRun.create({
                data: {
                    requestId: requestData.id,
                    status: result.status || 0,
                    statusText: result.statusText || (result.error ? 'Error' : null),
                    headers: result.headers || "",
                    body: result.data ? (typeof result.data === 'string' ? result.data : JSON.stringify(result.data)) : null,
                    durationMs: result.duration || 0
                }
            });

            // Update request with latest response if successful
            if (result.data && !result.error) {
                await db.request.update({
                    where: { id: requestData.id },
                    data: {
                        response: result.data,
                        updatedAt: new Date()
                    }
                });
            }

            return {
                success: true,
                requestRun,
                result
            };
        }

        // For temporary requests, just return the result without saving
        return {
            success: true,
            requestRun: null,
            result
        };

    } catch (error: any) {
        const isTemporaryRequest = requestData.id.startsWith("temp-");
        
        if (!isTemporaryRequest) {
            const failedRun = await db.requestRun.create({
                data: {
                    requestId: requestData.id,
                    status: 0,
                    statusText: 'Failed',
                    headers: "",
                    body: error.message,
                    durationMs: 0
                }
            });

            return {
                success: false,
                error: error.message,
                requestRun: failedRun
            };
        }

        return {
            success: false,
            error: error.message,
            requestRun: null,
            result: {
                error: error.message,
                status: 0,
                statusText: 'Error',
                duration: 0,
            }
        };
    }
}