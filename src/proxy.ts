import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protection de /admin :
 * - rafraîchit la session Supabase (cookies de session) à chaque requête admin ;
 * - redirige vers /admin/login si aucun utilisateur n'est connecté.
 * La vérification du rôle administrateur est refaite côté serveur (layout +
 * Server Actions) et en base (RLS) : ce proxy n'est qu'une première barrière.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = request.nextUrl.pathname === "/admin/login";

  // Sans Supabase, l'admin affiche un écran de configuration.
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Les Server Actions vérifient elles-mêmes les droits (adminClientOrNull) et
  // renvoient « Session expirée » : on ne les redirige pas, pour que le
  // formulaire affiche le message sans perdre la saisie.
  const isServerAction = request.method === "POST" && request.headers.has("next-action");

  if (!user && !isLogin && !isServerAction) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    if (request.nextUrl.pathname !== "/admin") loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Pas de redirection « connecté → /admin » ici : un utilisateur connecté mais
  // non administrateur serait renvoyé en boucle entre /admin et /admin/login.
  // C'est la page de connexion qui vérifie le rôle (getAdmin) avant de rediriger.

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
