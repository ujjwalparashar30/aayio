import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanParams(params: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value] // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
};

// Define proper types for the function parameters
interface User {
  userId: string;
  username: string;
}

interface IdToken {
  payload?: {
    email?: string;
  };
}

interface FetchWithBQOptions {
  url: string;
  method: string;
  body: {
    cognitoId: string;
    username: string;
    email: string;
  };
}

interface FetchWithBQResponse {
  error?: boolean;
  [key: string]: unknown;
}

type FetchWithBQFunction = (options: FetchWithBQOptions) => Promise<FetchWithBQResponse>;

export const createNewUserInDatabase = async (
  user: User,
  idToken: IdToken,
  userRole: string,
  fetchWithBQ: FetchWithBQFunction
) => {
  // Map user roles to their respective creation endpoints
  const roleToEndpointMap: Record<string, string> = {
    student: "/students",
    mentor: "/mentors",
    librarian: "/librarians",
  };

  const lowerRole = userRole?.toLowerCase();

  const createEndpoint = roleToEndpointMap[lowerRole];
  if (!createEndpoint) {
    throw new Error(`Invalid user role: ${userRole}`);
  }

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: "POST",
    body: {
      cognitoId: user.userId,
      username: user.username,
      email: idToken?.payload?.email || ""
    },
  });

  if (createUserResponse.error) {
    throw new Error("Failed to create user record");
  }

  return createUserResponse;
};
