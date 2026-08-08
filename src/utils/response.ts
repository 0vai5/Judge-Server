export class APIError {
  success: false;
  message: string;

  constructor(message: string) {
    this.success = false;
    this.message = message;
  }
}

export class APIResponse<T> {
  success: true;
  data?: T;
  message: string;

  constructor(message: string = "Request was successful", data?: T) {
    this.success = true;
    this.data = data;
    this.message = message;
  }
}
