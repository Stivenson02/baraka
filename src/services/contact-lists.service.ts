import { lukranFetch } from "@/lib/lukranClient";
import type { ApiSuccess } from "@/types/api.type";
import type {
  Contact,
  ContactList,
  CreateContactInput,
  CreateContactListInput,
} from "@/types/contact-list.type";

const NEWSLETTER_LIST_NAME = "newsletter";

export async function getContactLists() {
  return lukranFetch<ApiSuccess<ContactList[]>>({
    endpoint: "/api/connect/v1/contact-lists",
    method: "GET",
  });
}

export async function createContactList(input: CreateContactListInput) {
  return lukranFetch<ApiSuccess<ContactList>>({
    endpoint: "/api/connect/v1/contact-lists",
    method: "POST",
    body: input,
  });
}

export async function createContactInList(
  listId: string,
  input: CreateContactInput,
  clientIp?: string | null
) {
  return lukranFetch<ApiSuccess<Contact>>({
    endpoint: `/api/connect/v1/contact-lists/${encodeURIComponent(listId)}/contacts`,
    method: "POST",
    body: input,
    clientIp,
  });
}

function listMatches(list: ContactList, name: string) {
  return list.active && list.name === name;
}

export async function ensureNewsletterContactList() {
  const lists = (await getContactLists()).data;
  const existing = lists.find((list) => listMatches(list, NEWSLETTER_LIST_NAME));

  if (existing) {
    return existing;
  }

  try {
    return (
      await createContactList({
        name: NEWSLETTER_LIST_NAME,
        description: "Contactos capturados desde el newsletter del home BARAKA",
        active: true,
        rules: [
          { type: "REQUIRED", field: "PHONE", active: true },
          { type: "REQUIRED", field: "EMAIL", active: true },
          { type: "UNIQUE", field: "EMAIL", active: true },
        ],
      })
    ).data;
  } catch {
    const refreshed = (await getContactLists()).data;
    return refreshed.find((list) => listMatches(list, NEWSLETTER_LIST_NAME)) ?? null;
  }
}
