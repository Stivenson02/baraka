import { lukranFetch } from "@/lib/lukranClient";
import { AppError } from "@/lib/errors/AppError";

export type DocumentType =
  | "NIT"
  | "CC"
  | "CE"
  | "PASSPORT"
  | "DNI"
  | "RUT"
  | "PPT"
  | "PEP"
  | "OTHER";

export const VALID_DOCUMENT_TYPES: DocumentType[] = [
  "NIT", "CC", "CE", "PASSPORT", "DNI", "RUT", "PPT", "PEP", "OTHER",
];

export type SellerApplicationPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  cityId?: string | null;
};

type LukranApplicationResponse = {
  success: true;
  data: {
    id: string;
    status: string;
  };
};

function mapLukranError(code: string, message: string): AppError {
  if (
    code === "EXTERNAL_APPLICATION_DUPLICATED" ||
    code === "EXTERNAL_USER_ALREADY_EXISTS"
  ) {
    return new AppError(
      "Ya existe una solicitud activa con este correo o documento.",
      409,
      code
    );
  }

  if (code === "EXTERNAL_USER_BLACKLISTED") {
    return new AppError(
      "Esta persona no puede presentar una nueva solicitud. Comunícate con el equipo BARAKA para más información.",
      403,
      code
    );
  }

  if (code === "INVALID_EMAIL" || message.toLowerCase().includes("email")) {
    return new AppError("El correo electronico no es valido.", 422, code);
  }

  if (code === "INVALID_PHONE" || message.toLowerCase().includes("phone")) {
    return new AppError("El numero de celular no es valido.", 422, code);
  }

  if (code === "INVALID_DOCUMENT_TYPE" || message.toLowerCase().includes("document")) {
    return new AppError("El tipo de documento no es valido.", 422, code);
  }

  return new AppError(message || "Error al enviar la solicitud.", 500, code);
}

function normalizePayload(input: SellerApplicationPayload): SellerApplicationPayload {
  return {
    firstName: input.firstName.trim(),
    ...(input.middleName?.trim() ? { middleName: input.middleName.trim() } : {}),
    lastName: input.lastName.trim(),
    ...(input.secondLastName?.trim() ? { secondLastName: input.secondLastName.trim() } : {}),
    documentType: input.documentType,
    documentNumber: input.documentNumber.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim().replace(/\s+/g, ""),
    address: input.address.trim(),
    ...(input.cityId ? { cityId: input.cityId } : {}),
  };
}

export async function createSellerApplication(
  payload: SellerApplicationPayload,
  clientIp?: string | null
) {
  const normalized = normalizePayload(payload);

  try {
    const result = await lukranFetch<LukranApplicationResponse>({
      endpoint: "/api/connect/v1/external-users/applications",
      method: "POST",
      body: normalized,
      clientIp,
    });

    return result.data;
  } catch (error) {
    if (error instanceof AppError && error.code !== "LUKRAN_TIMEOUT" && error.code !== "INVALID_JSON") {
      throw mapLukranError(error.code, error.message);
    }

    throw error;
  }
}
