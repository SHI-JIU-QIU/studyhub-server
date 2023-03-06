import { Request, Response } from "express";

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseWsExceptionFilter } from "@nestjs/websockets";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
    catch(exception: any, host: ArgumentsHost) {

        const { httpAdapter } = this.httpAdapterHost;

        // const ctx = host.switchToWs();


        if (host.getType() === 'http') {
            const ctx = host.switchToHttp()
            const httpStatus =
                exception instanceof HttpException
                    ? exception.getStatus()
                    : HttpStatus.INTERNAL_SERVER_ERROR;

            const responseBody = {
                code: httpStatus,
                data: exception.getResponse().message,
                timestamp: new Date().toISOString(),
                path: httpAdapter.getRequestUrl(ctx.getRequest()),
            };

            httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
        }

        if (host.getType() === 'ws') {
            const ctx = host.switchToWs()

            const responseBody = {
                code: 0,
                data: exception.error,
                timestamp: new Date().toLocaleString(),
            };
         
            
            ctx.getClient().emit('exception',responseBody)

        }




        //     const ctx = host.switchToHttp();
        //     const response = ctx.getResponse<Response>();
        //     const request = ctx.getRequest<Request>();


        //     console.log(exception);
        //     const status = exception.getStatus()
        //     // console.log(exception);
        //     const data = exception.getResponse() as any
        //     let validResult = null

        //     if (typeof data.message != 'string') {
        //         validResult = data.message
        //     }

        //     response.status(status).send({
        //         data: {},
        //         code: status,
        //         timestamp: new Date().toLocaleString(),
        //         path: request.url,
        //         message: validResult || exception.message,
        //     });
    }
} 