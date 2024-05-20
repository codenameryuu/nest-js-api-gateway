import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class FormatResponse {
  sendResponse(request: any) {
    let result: any = {
      status: request.status,
      message: request.message,
      data: null,
    };

    if (request.data) {
      result.data = request.data;
    }

    if (request.pagination) {
      result.pagination = request.pagination;
    }

    if (request.token) {
      result.token = request.token;
    }

    if (!request.status) {
      throw new HttpException(result, 422);
    }

    return result;
  }
}
