/**
 * error class
 * VitaxTeam 2026
 */
export class VitaxError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = "Error";
    this.statusCode = statusCode;
    this.details = details;
  }
}
