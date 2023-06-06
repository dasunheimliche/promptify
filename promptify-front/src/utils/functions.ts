export function getUserToken(): string | null {
    let tkn: string | null = null;
    if (typeof window !== "undefined") {
      tkn = sessionStorage.getItem('user-token');
    }
    return tkn;
}