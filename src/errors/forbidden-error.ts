import { ApplicationError } from "@/protocols";

export function forbidderError(): ApplicationError {
  return {
    name: "ForbiddenError",
    message: "Not allowed",
  };
}
