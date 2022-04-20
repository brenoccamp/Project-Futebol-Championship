export default interface IAPIResponse {
  statusCode: number;
  err?: string | undefined;
  body?: string | undefined;
}
