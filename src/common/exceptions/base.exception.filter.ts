import { Request, Response } from "express";

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        
        
        // console.log(exception);
        const status = exception.getStatus()
        // console.log(exception);
        const data = exception.getResponse() as any
        let validResult = null
      
        
        if (typeof data.message != 'string') {
            validResult = data.message
        }



        response.status(status).send({
            data: {},
            code: status,
            timestamp: new Date().toLocaleString(),
            path: request.url,
            message: validResult || exception.message,
        });
    }
} 