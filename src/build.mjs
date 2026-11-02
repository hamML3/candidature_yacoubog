// Builds the candidature website into ../docs (served by GitHub Pages)
// Usage: node src/build.mjs
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, '..', 'docs');
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">';

function write(path, html) {
  const full = join(OUT, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
}

const SITES = {
  yacoubog: {
    domain: 'yacoubog.com',
    logo: 'YACOU B OG',
    cta: ['Billets', '../enroutedu26mars/billets.html'],
    nav: [['index', 'Accueil'], ['musique', 'Musique'], ['concerts', 'Concerts'], ['boutique', 'Boutique'], ['bio', 'Bio'], ['booking', 'Booking']],
    tagline: 'Rappeur malien. Kati, Bamako.',
  },
  civilisationmalienne: {
    domain: 'civilisationmalienne.com',
    logo: 'CIVILISATION MALIENNE',
    cta: ['Travailler avec nous', 'contact.html'],
    nav: [['index', 'Accueil'], ['equipe', "L'équipe"], ['projets', 'Projets'], ['coulisses', 'Coulisses'], ['contact', 'Partenaires']],
    tagline: "L'équipe de Yacou B OG.",
  },
  enroutedu26mars: {
    domain: 'enroutedu26mars.com',
    logo: 'EN ROUTE DU 26 MARS',
    cta: ['Acheter mon billet', 'billets.html'],
    nav: [['index', 'Accueil'], ['billets', 'Billets'], ['programme', 'Programme'], ['acces', 'Accès'], ['faq', 'FAQ']],
    tagline: 'Yacou B OG au Stade du 26 Mars, Bamako.',
  },
};

const SOCIAL = `
  <a href="https://www.youtube.com/@yacoubog" target="_blank" rel="noopener">YouTube</a>
  <a href="https://www.instagram.com/yacou_b_og_off/" target="_blank" rel="noopener">Instagram</a>
  <a href="https://www.facebook.com/yacoubogoff" target="_blank" rel="noopener">Facebook</a>
  <a href="https://x.com/yacoubogoff" target="_blank" rel="noopener">X</a>`;

function page(siteKey, slug, title, body, extraCss = '') {
  const s = SITES[siteKey];
  const nav = s.nav.map(([k, label]) => `<a href="${k}.html"${k === slug ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const others = Object.entries(SITES).filter(([k]) => k !== siteKey)
    .map(([k, o]) => `<a href="../${k}/index.html">${o.domain}</a>`).join('');
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${title} · ${s.domain} (démo)</title>
${FONTS}
<link rel="stylesheet" href="../assets/demo.css">
${extraCss ? `<style>${extraCss}</style>` : ''}
</head>
<body class="site-${siteKey}">
<div class="demo-bar"><div class="in"><span>Maquette de démonstration pour ${s.domain} · proposée par Hamady Diallo</span><a href="../../proposition/index.html">← Retour à la proposition</a></div></div>
<header class="hd"><div class="in">
  <a class="logo" href="index.html">${s.logo}</a>
  <nav class="nav" id="nav" aria-label="Menu principal">${nav}</nav>
  <div class="row"><a class="btn sm hd-cta" href="${s.cta[1]}">${s.cta[0]}</a><button class="burger" type="button" aria-expanded="false" aria-controls="nav">Menu</button></div>
</div></header>
<main>
${body}
</main>
<footer class="ft"><div class="in">
  <div><span class="logo">${s.logo}</span><p>${s.tagline}</p><p class="note" style="margin-top:12px">Maquette : textes et visuels provisoires, à remplacer par les contenus de l'équipe.</p></div>
  <div><b>Suivre</b>${SOCIAL}</div>
  <div><b>Les autres sites</b>${others}</div>
</div></footer>
<script src="../assets/demo.js"></script>
</body>
</html>`;
  write(`demos/${siteKey}/${slug}.html`, html);
}

/* ---------------- yacoubog.com ---------------- */
const PLATS = `<div class="plats">
  <a class="plat" href="#" data-soon="Lien Spotify officiel à fournir par l'équipe.">Spotify</a>
  <a class="plat" href="#" data-soon="Lien Apple Music officiel à fournir par l'équipe.">Apple Music</a>
  <a class="plat" href="#" data-soon="Lien Audiomack officiel à fournir par l'équipe.">Audiomack</a>
  <a class="plat" href="https://www.youtube.com/@yacoubog" target="_blank" rel="noopener">YouTube</a>
  <a class="plat" href="#" data-soon="Lien Boomplay officiel à fournir par l'équipe.">Boomplay</a>
</div>`;

const GIGS = `<div class="gigs">
  <div class="gig big"><span class="d">Date à annoncer</span><span><b>Bamako</b> <span class="v">· Stade du 26 Mars</span></span><a class="btn white sm" href="../enroutedu26mars/billets.html">Billets</a></div>
  <div class="gig"><span class="d">Date à confirmer</span><span><b>Kita</b> <span class="v">· Mali</span></span><a class="btn line sm" href="#" data-soon="Page du concert à créer avec les infos de l'organisateur.">Infos</a></div>
  <div class="gig"><span class="d">Date à confirmer</span><span><b>Kéniéba</b> <span class="v">· Mali</span></span><a class="btn line sm" href="#" data-soon="Page du concert à créer avec les infos de l'organisateur.">Infos</a></div>
  <div class="gig"><span class="d">Date à confirmer</span><span><b>Kangaba</b> <span class="v">· Mali</span></span><a class="btn line sm" href="#" data-soon="Page du concert à créer avec les infos de l'organisateur.">Infos</a></div>
  <div class="gig"><span class="d">Date à confirmer</span><span><b>Bruxelles</b> <span class="v">· Belgique</span></span><a class="btn line sm" href="#" data-soon="Page du concert à créer avec les infos de l'organisateur.">Infos</a></div>
</div>`;

const RELEASES = [
  ['Baye Fall 1', 'EP · 2023 · 5 titres', 'Dernier projet'],
  ['Venom III', 'Projet', ''],
  ['Venom II', 'Projet', ''],
  ['Venom I', 'Projet', ''],
  ['Koungo Fitini', 'Mixtape · 2020', 'Première mixtape'],
];

const YB_CSS = `
.yb-hero { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: center; padding-block: 56px 72px; }
.yb-hero > * { min-width: 0; }
.yb-hero .h-xl { margin: 10px 0 22px; }
.rel { display: grid; gap: 10px; text-decoration: none; }
.rel b { font-family: var(--cond); font-size: 22px; text-transform: uppercase; }
.rel span { color: var(--grey); font-size: 15px; }
.clip { position: relative; aspect-ratio: 16 / 9; border-radius: 14px; overflow: hidden; display: grid; place-items: center; text-decoration: none; color: var(--white); background: repeating-linear-gradient(-35deg, #2A2627 0 14px, #1A1718 14px 28px); }
.clip i { width: 84px; height: 84px; border-radius: 50%; background: var(--red); display: grid; place-items: center; }
.clip i::before { content: ""; border-left: 26px solid var(--white); border-top: 16px solid transparent; border-bottom: 16px solid transparent; margin-left: 6px; }
.clip span { position: absolute; left: 18px; bottom: 14px; font-family: var(--cond); text-transform: uppercase; letter-spacing: .08em; }
.disco { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding-block: 36px; border-top: 1px solid #2A2627; }
.disco > * { min-width: 0; }
.tracks { list-style: none; margin: 16px 0 0; padding: 0; counter-reset: t; }
.tracks li { counter-increment: t; display: flex; gap: 14px; padding-block: 10px; border-top: 1px solid #2A2627; color: #D5CFD0; }
.tracks li::before { content: counter(t, decimal-leading-zero); font-family: var(--mono); font-size: 13px; color: var(--grey); padding-top: 3px; }
.cart { display: inline-flex; gap: 6px; align-items: center; font-family: var(--cond); font-weight: 700; text-transform: uppercase; }
.cart b { background: var(--red); color: var(--white); border-radius: 999px; min-width: 26px; text-align: center; padding: 0 8px; }
@media (max-width: 860px) { .yb-hero, .disco { grid-template-columns: 1fr; } }
`;

page('yacoubog', 'index', 'Accueil', `
<section class="dark"><div class="in yb-hero">
  <div>
    <div class="kicker">Dernier projet · EP · 5 titres</div>
    <h1 class="h-xl">Baye<br>Fall 1</h1>
    <div class="row" style="margin-bottom:22px"><a class="btn" href="musique.html">Écouter l'EP</a><a class="btn line" href="#clip">Voir le dernier clip</a></div>
    ${PLATS}
  </div>
  <div class="ph sq cover-art"><span class="big">Baye<br>Fall 1</span></div>
</div></section>

<section class="sec"><div class="in">
  <div class="sec-head"><h2 class="h-l">Concerts</h2><a class="btn line sm" href="concerts.html">Toutes les dates</a></div>
  ${GIGS}
</div></section>

<section class="sec dark" id="clip"><div class="in grid g2" style="align-items:center;gap:40px">
  <a class="clip" href="https://www.youtube.com/@yacoubog" target="_blank" rel="noopener" aria-label="Voir les clips sur YouTube"><i></i><span>Dernier clip · YouTube</span></a>
  <div style="display:grid;gap:16px">
    <div class="kicker">Dernier clip</div>
    <h2 class="h-l">Titre du clip</h2>
    <p class="lead">Le dernier clip s'affiche ici automatiquement à chaque nouvelle sortie sur la chaîne YouTube.</p>
    <div><a class="btn" href="https://www.youtube.com/@yacoubog" target="_blank" rel="noopener">S'abonner à la chaîne</a></div>
  </div>
</div></section>

<section class="sec"><div class="in">
  <div class="sec-head"><h2 class="h-l">Discographie</h2><a class="btn line sm" href="musique.html">Tout écouter</a></div>
  <div class="grid g4">
    ${RELEASES.slice(0, 4).map(([t, m], i) => `<a class="rel" href="musique.html"><div class="ph sq ${i === 0 ? 'cover-art' : i % 2 ? 'red' : ''}"></div><b>${t}</b><span>${m}</span></a>`).join('')}
  </div>
</div></section>

<section class="sec paper"><div class="in grid g2" style="align-items:center;gap:40px">
  <div class="ph light"><span class="cap">Photo officielle de l'artiste</span></div>
  <div style="display:grid;gap:16px">
    <div class="kicker">Biographie</div>
    <h2 class="h-l">De Kati au Stade du 26 Mars</h2>
    <p class="lead">Yacouba Diakité, alias Yacou B OG, est un rappeur malien né en 1998, originaire de Kati et de Bamako. De la mixtape Koungo Fitini en 2020 à l'EP Baye Fall 1, il trace sa route jusqu'au plus grand stade du pays.</p>
    <div><a class="btn black" href="bio.html">Lire la biographie</a></div>
  </div>
</div></section>

<section class="sec redbg"><div class="in grid g2" style="align-items:center;gap:32px">
  <div style="display:grid;gap:10px"><div class="kicker">Newsletter</div><h2 class="h-l">Ne rate aucune date</h2><p>Sorties, concerts et billetterie en avant-première.</p></div>
  <form class="f" data-demo="Merci ! Démo : l'inscription serait enregistrée dans la liste de fans.">
    <div class="field"><label for="nl-mail">E-mail ou numéro WhatsApp</label><input id="nl-mail" required placeholder="vous@exemple.com ou 70 00 00 00"></div>
    <div><button class="btn black" type="submit">Je m'inscris</button></div>
  </form>
</div></section>
`, YB_CSS);

page('yacoubog', 'musique', 'Musique', `
<section class="dark"><div class="in sec">
  <div class="kicker">Musique</div>
  <h1 class="h-xl" style="margin:10px 0 32px">Discographie</h1>
  ${RELEASES.map(([t, m, tag], i) => `
  <article class="disco">
    <div class="ph sq ${i === 0 ? 'cover-art' : i % 2 ? 'red' : ''}"><span class="big" style="font-size:clamp(28px,4vw,48px)">${t}</span></div>
    <div style="display:grid;gap:14px;align-content:start">
      ${tag ? `<div class="kicker">${tag}</div>` : ''}
      <h2 class="h-l">${t}</h2>
      <p style="color:#BDB6B8">${m}</p>
      ${PLATS}
      ${i === 0 ? `<ol class="tracks"><li>Titre 1</li><li>Titre 2</li><li>Titre 3</li><li>Titre 4</li><li>Titre 5</li></ol><p class="note">Liste des titres et extraits audio à reprendre du site actuel.</p>` : ''}
    </div>
  </article>`).join('')}
</div></section>
`, YB_CSS);

page('yacoubog', 'concerts', 'Concerts', `
<section class="sec"><div class="in">
  <div class="kicker">Concerts</div>
  <h1 class="h-xl" style="margin:10px 0 32px">En tournée</h1>
  ${GIGS}
  <p class="note" style="margin-top:16px">Les dates passées basculent automatiquement dans l'historique.</p>
  <h2 class="h-m" style="margin:56px 0 16px">Historique</h2>
  <div class="gigs">
    <div class="gig past"><span class="d">Date passée</span><span><b>Ville</b> <span class="v">· Lieu</span></span><span class="note">Photos</span></div>
    <div class="gig past"><span class="d">Date passée</span><span><b>Ville</b> <span class="v">· Lieu</span></span><span class="note">Photos</span></div>
  </div>
</div></section>
<section class="sec redbg"><div class="in row" style="justify-content:space-between">
  <h2 class="h-m">Organiser un concert avec Yacou B OG</h2><a class="btn black" href="booking.html">Demande de booking</a>
</div></section>
`, YB_CSS);

const PRODUCTS = [
  ['T-shirt Civilisation Malienne', 'red'],
  ['Casquette Yacou B OG', ''],
  ['Hoodie Baye Fall', 'red'],
  ['T-shirt En route du 26 Mars', ''],
];
page('yacoubog', 'boutique', 'Boutique', `
<section class="sec"><div class="in">
  <div class="sec-head">
    <div><div class="kicker">Boutique</div><h1 class="h-xl" style="margin-top:10px">Merch</h1></div>
    <div class="row"><span class="cart">Panier <b id="cart-n">0</b></span><button class="btn sm" id="checkout" type="button">Commander</button></div>
  </div>
  <p class="note" style="margin-bottom:24px">Produits et prix d'exemple. Paiement par Orange Money, Moov Money ou à la livraison à Bamako.</p>
  <div class="grid g4">
    ${PRODUCTS.map(([n, c]) => `<div class="card"><div class="ph sq ${c}"><span class="cap">Photo produit</span></div><h3>${n}</h3><span class="price">Prix à fixer</span><button class="btn sm" type="button" data-add="${n}">Ajouter au panier</button></div>`).join('')}
  </div>
</div></section>
`, YB_CSS);

page('yacoubog', 'bio', 'Biographie', `
<section class="dark"><div class="in sec grid g2" style="gap:48px;align-items:center">
  <div><div class="kicker">Biographie</div><h1 class="h-xl" style="margin-top:10px">Yacou<br>B OG</h1></div>
  <div class="ph"><span class="cap">Photo officielle de l'artiste</span></div>
</div></section>
<section class="sec"><div class="in" style="display:grid;gap:22px;max-width:760px">
  <p class="lead" style="color:var(--black)">Yacouba Diakité, connu sous le nom de Yacou B OG, est un rappeur malien né en 1998. Il a grandi entre Kati et Bamako.</p>
  <p>Il se fait connaître avec la mixtape <b>Koungo Fitini</b> en 2020, puis enchaîne avec la série <b>Venom</b> (I, II et III) et l'EP <b>Baye Fall 1</b> en 2023.</p>
  <p>Accompagné par son équipe Civilisation Malienne, il prépare aujourd'hui un concert au <b>Stade du 26 Mars</b> de Bamako.</p>
  <p class="note">Texte de démonstration rédigé à partir du site actuel. La biographie définitive sera validée avec l'équipe.</p>
  <h2 class="h-m" style="margin-top:24px">Espace presse</h2>
  <div class="grid g3">
    <div class="card"><h3>Photos HD</h3><p>Photos officielles libres de droits pour la presse.</p><a class="btn line sm" href="#" data-soon="Le pack photos sera fourni par l'équipe.">Télécharger</a></div>
    <div class="card"><h3>Bio courte</h3><p>Version de 100 mots pour les médias et les affiches.</p><a class="btn line sm" href="#" data-soon="La bio courte sera validée avec l'équipe.">Copier</a></div>
    <div class="card"><h3>Contact presse</h3><p>Interviews et passages radio ou télé.</p><a class="btn line sm" href="booking.html">Contacter</a></div>
  </div>
</div></section>
`, YB_CSS);

page('yacoubog', 'booking', 'Booking', `
<section class="sec"><div class="in grid g2" style="gap:48px">
  <div style="display:grid;gap:16px;align-content:start">
    <div class="kicker">Booking</div>
    <h1 class="h-xl">Inviter Yacou B OG</h1>
    <p class="lead">Concert, festival, événement d'entreprise ou showcase. Votre demande arrive directement au management.</p>
    <p class="note">Ce formulaire remplace l'ancien « Formulaire de demande de programmation d'un concert ».</p>
  </div>
  <form class="f" data-demo="Demande envoyée. Démo : le management recevrait votre demande par e-mail et WhatsApp.">
    <div class="field"><label for="bk-name">Nom et structure</label><input id="bk-name" required></div>
    <div class="grid g2"><div class="field"><label for="bk-phone">Téléphone</label><input id="bk-phone" type="tel" required></div><div class="field"><label for="bk-mail">E-mail</label><input id="bk-mail" type="email"></div></div>
    <div class="grid g2"><div class="field"><label for="bk-type">Type d'événement</label><select id="bk-type"><option>Concert</option><option>Festival</option><option>Showcase</option><option>Événement privé</option><option>Autre</option></select></div><div class="field"><label for="bk-date">Date souhaitée</label><input id="bk-date" type="date"></div></div>
    <div class="grid g2"><div class="field"><label for="bk-city">Ville</label><input id="bk-city" required></div><div class="field"><label for="bk-cap">Public attendu</label><input id="bk-cap" placeholder="ex. 2 000 personnes"></div></div>
    <div class="field"><label for="bk-msg">Message</label><textarea id="bk-msg"></textarea></div>
    <div><button class="btn" type="submit">Envoyer la demande</button></div>
  </form>
</div></section>
`, YB_CSS);

/* ---------------- civilisationmalienne.com ---------------- */
const CM_CSS = `
.hd { background: var(--white); color: var(--black); border-bottom: 1px solid var(--line); }
.nav a { color: var(--text-grey); }
.nav a:hover, .nav a[aria-current="page"] { color: var(--black); }
@media (max-width: 860px) { .nav { background: var(--white); } .nav a { border-top-color: var(--line); } }
.cm-hero { position: relative; overflow: hidden; padding-block: 72px 80px; }
.cm-hero::before { content: ""; position: absolute; right: -120px; top: -160px; width: 560px; height: 560px; border: 64px solid var(--red); border-radius: 50%; border-left-color: transparent; transform: rotate(-20deg); }
.cm-hero .in { position: relative; display: grid; gap: 20px; }
.cm-hero .h-xl span { color: var(--red); }
.mate { display: grid; gap: 8px; }
.mate .ph { aspect-ratio: 4 / 5; border-bottom: 6px solid var(--red); }
.mate b { font-family: var(--cond); font-size: 22px; text-transform: uppercase; }
.mate span { color: var(--text-grey); font-size: 15px; }
.tile { border-radius: 14px; padding: 24px; min-height: 220px; display: grid; align-content: space-between; gap: 18px; background: var(--paper); text-decoration: none; }
.tile.r { background: var(--red); color: var(--white); }
.tile.k { background: var(--black); color: var(--white); }
.tile small { font-family: var(--cond); font-weight: 700; text-transform: uppercase; letter-spacing: .14em; opacity: .75; }
.tile b { font-family: var(--display); font-weight: 400; font-size: 34px; line-height: 1; text-transform: uppercase; }
.tile:hover { transform: translateY(-2px); }
@media (prefers-reduced-motion: no-preference) { .tile { transition: transform .15s; } }
.proj { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; padding-block: 36px; border-top: 1px solid var(--line); align-items: center; }
.proj > * { min-width: 0; }
@media (max-width: 860px) { .proj { grid-template-columns: 1fr; } .cm-hero::before { width: 320px; height: 320px; border-width: 40px; right: -110px; top: -90px; } }
`;
const TEAM = [['Management', 'Stratégie, carrière, contrats'], ['Booking', 'Concerts et tournées'], ['Communication', 'Réseaux sociaux et presse'], ['Production', 'Studio, clips, scène']];
const TEAM_HTML = `<div class="grid g4">${TEAM.map(([r, d]) => `<div class="mate"><div class="ph light"><span class="cap">Photo</span></div><b>${r}</b><span>Nom du membre · ${d}</span></div>`).join('')}</div>`;

page('civilisationmalienne', 'index', 'Accueil', `
<section class="cm-hero"><div class="in">
  <div class="kicker">L'équipe de Yacou B OG · Bamako</div>
  <h1 class="h-xl">Civilisation<br><span>Malienne</span></h1>
  <p class="lead" style="max-width:46ch">Management, booking, communication, production : l'équipe qui porte Yacou B OG de Kati jusqu'au Stade du 26 Mars.</p>
  <div class="row"><a class="btn" href="equipe.html">Rencontrer l'équipe</a><a class="btn line" href="contact.html">Devenir partenaire</a></div>
</div></section>
<section class="sec paper"><div class="in">
  <div class="sec-head"><h2 class="h-l">L'équipe</h2><a class="btn line sm" href="equipe.html">Tous les membres</a></div>
  ${TEAM_HTML}
</div></section>
<section class="sec"><div class="in grid g4">
  <a class="tile k" href="../yacoubog/index.html"><small>L'artiste</small><b>Yacou B OG</b></a>
  <a class="tile r" href="../enroutedu26mars/index.html"><small>Le projet</small><b>En route du 26 Mars</b></a>
  <a class="tile" href="coulisses.html"><small>Coulisses</small><b>Studio, tournée, vidéos</b></a>
  <a class="tile" href="contact.html"><small>Partenaires</small><b>Sponsors et presse</b></a>
</div></section>
`, CM_CSS);

page('civilisationmalienne', 'equipe', "L'équipe", `
<section class="cm-hero"><div class="in"><div class="kicker">Qui fait quoi</div><h1 class="h-xl">L'<span>équipe</span></h1>
<p class="lead">Chaque membre a sa fiche : rôle, photo et contact direct. Les partenaires savent tout de suite à qui s'adresser.</p></div></section>
<section class="sec paper"><div class="in">${TEAM_HTML}<p class="note" style="margin-top:20px">Noms, photos et rôles à fournir par l'équipe.</p></div></section>
<section class="sec"><div class="in" style="display:grid;gap:18px;max-width:760px">
  <h2 class="h-l">Notre mission</h2>
  <p class="lead" style="color:var(--black)">Faire grandir la carrière de Yacou B OG au Mali et à l'international, et porter une image fière de la culture malienne.</p>
  <p class="note">Texte de démonstration, à réécrire avec l'équipe.</p>
</div></section>
`, CM_CSS);

page('civilisationmalienne', 'projets', 'Projets', `
<section class="cm-hero"><div class="in"><div class="kicker">Projets</div><h1 class="h-xl">Ce qu'on <span>construit</span></h1></div></section>
<section class="sec" style="padding-top:0"><div class="in">
  <article class="proj"><div class="ph red"><span class="big">En route<br>du 26 Mars</span></div><div style="display:grid;gap:14px"><div class="kicker">En cours</div><h2 class="h-l">Concert au Stade du 26 Mars</h2><p class="lead">Le plus grand concert de Yacou B OG à ce jour, au stade national de Bamako.</p><div class="row"><a class="btn" href="../enroutedu26mars/index.html">Voir le site du concert</a></div></div></article>
  <article class="proj"><div class="ph sq cover-art" style="aspect-ratio:4/3"><span class="big">Baye Fall 1</span></div><div style="display:grid;gap:14px"><div class="kicker">2023</div><h2 class="h-l">EP Baye Fall 1</h2><p class="lead">Cinq titres, disponibles sur toutes les plateformes.</p><div class="row"><a class="btn black" href="../yacoubog/musique.html">Écouter</a></div></div></article>
  <article class="proj"><div class="ph"><span class="cap">Photo de tournée</span></div><div style="display:grid;gap:14px"><div class="kicker">Tournée</div><h2 class="h-l">Kita, Kéniéba, Kangaba, Bruxelles</h2><p class="lead">Les dates de la tournée, au Mali et en Europe.</p><div class="row"><a class="btn black" href="../yacoubog/concerts.html">Voir les dates</a></div></div></article>
</div></section>
`, CM_CSS);

page('civilisationmalienne', 'coulisses', 'Coulisses', `
<section class="cm-hero"><div class="in"><div class="kicker">Coulisses</div><h1 class="h-xl">Derrière la <span>scène</span></h1>
<p class="lead">Photos et vidéos de studio, de tournée et de préparation du concert, publiées par l'équipe depuis son téléphone.</p></div></section>
<section class="sec paper"><div class="in grid g3">
  ${['En studio', 'Répétition', 'Tournage du clip', 'Sur la route', 'Avant la scène', 'Rencontre avec les fans'].map((c, i) => `<div class="ph ${i % 3 === 1 ? 'red' : i % 3 === 2 ? 'light' : ''}"><span class="cap">${c}</span></div>`).join('')}
</div></section>
`, CM_CSS);

page('civilisationmalienne', 'contact', 'Partenaires', `
<section class="cm-hero"><div class="in"><div class="kicker">Partenaires et presse</div><h1 class="h-xl">Travailler <span>avec nous</span></h1></div></section>
<section class="sec paper"><div class="in grid g2" style="gap:48px">
  <div style="display:grid;gap:18px;align-content:start">
    <div class="card"><h3>Sponsoring du concert</h3><p>Visibilité au Stade du 26 Mars, sur les réseaux et sur les billets.</p><a class="btn line sm" href="#" data-soon="L'offre de sponsoring sera préparée avec l'équipe.">Voir l'offre</a></div>
    <div class="card"><h3>Dossier de presse</h3><p>Biographie, photos HD, chiffres clés et contacts.</p><a class="btn line sm" href="../yacoubog/bio.html">Espace presse</a></div>
  </div>
  <form class="f" data-demo="Message envoyé. Démo : l'équipe recevrait votre demande sur son adresse @civilisationmalienne.com.">
    <div class="field"><label for="ct-name">Nom et entreprise</label><input id="ct-name" required></div>
    <div class="grid g2"><div class="field"><label for="ct-phone">Téléphone</label><input id="ct-phone" type="tel" required></div><div class="field"><label for="ct-mail">E-mail</label><input id="ct-mail" type="email"></div></div>
    <div class="field"><label for="ct-sub">Objet</label><select id="ct-sub"><option>Sponsoring</option><option>Presse</option><option>Collaboration</option><option>Autre</option></select></div>
    <div class="field"><label for="ct-msg">Message</label><textarea id="ct-msg" required></textarea></div>
    <div><button class="btn" type="submit">Envoyer</button></div>
  </form>
</div></section>
`, CM_CSS);

/* ---------------- enroutedu26mars.com ---------------- */
const E26_CSS = `
.hd { background: var(--red); }
.nav a { color: rgba(255,255,255,.75); }
.nav a[aria-current="page"] { box-shadow: 0 2px 0 var(--white); }
.hd .btn { background: var(--black); border-color: var(--black); }
@media (max-width: 860px) { .nav { background: var(--red); } .nav a { border-top-color: rgba(255,255,255,.2); } }
.e-hero { position: relative; overflow: hidden; padding-block: 56px 72px; }
.e-hero::before { content: "26"; position: absolute; right: -30px; top: -120px; font-family: var(--display); font-size: clamp(320px, 52vw, 720px); line-height: 1; color: rgba(0,0,0,.12); pointer-events: none; }
.e-hero .in { position: relative; display: grid; gap: 22px; }
.count { display: flex; gap: 10px; flex-wrap: wrap; }
.count div { background: var(--black); border-radius: 12px; padding: 12px 16px; min-width: 92px; text-align: center; }
.count b { display: block; font-family: var(--display); font-weight: 400; font-size: clamp(36px, 5vw, 56px); line-height: 1; font-variant-numeric: tabular-nums; }
.count small { font-family: var(--cond); text-transform: uppercase; letter-spacing: .12em; color: var(--grey); }
.tier { border-radius: 14px; padding: 24px; display: grid; gap: 10px; background: var(--white); color: var(--black); border: 1px solid var(--line); }
.tier.vip { background: var(--black); color: var(--white); border-color: var(--black); }
.tier b { font-family: var(--display); font-weight: 400; font-size: 40px; text-transform: uppercase; line-height: 1; }
.tier ul { margin: 0; padding-left: 18px; font-size: 15px; }
.pay { display: flex; gap: 8px; flex-wrap: wrap; }
.pay span { font-family: var(--cond); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; font-size: 14px; border: 1px solid currentColor; border-radius: 6px; padding: 4px 12px; }
/* purchase flow */
.flow { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; scroll-margin-top: 90px; }
.flow > * { min-width: 0; }
.steps-nav { list-style: none; margin: 0 0 24px; padding: 0; display: flex; gap: 8px; flex-wrap: wrap; counter-reset: s; }
.steps-nav li { counter-increment: s; font-family: var(--cond); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; font-size: 14px; padding: 6px 14px; border-radius: 999px; background: var(--paper); color: var(--grey); }
.steps-nav li::before { content: counter(s) ". "; }
.steps-nav li.on { background: var(--red); color: var(--white); }
.steps-nav li.done { background: var(--black); color: var(--white); }
.opt { display: flex; gap: 14px; align-items: center; border: 2px solid var(--line); border-radius: 12px; padding: 16px 18px; cursor: pointer; }
.opt:has(input:checked) { border-color: var(--red); background: #FFF5F5; }
.opt input { accent-color: var(--red); width: 20px; height: 20px; }
.opt b { font-family: var(--cond); font-size: 22px; text-transform: uppercase; }
.opt .pr { margin-left: auto; font-family: var(--display); font-size: 22px; white-space: nowrap; }
.qty { display: inline-flex; align-items: center; gap: 0; border: 2px solid var(--line); border-radius: 999px; overflow: hidden; }
.qty button { background: none; border: 0; font-size: 22px; width: 46px; height: 44px; cursor: pointer; }
.qty span { min-width: 36px; text-align: center; font-family: var(--display); font-size: 22px; font-variant-numeric: tabular-nums; }
.recap { position: sticky; top: 90px; background: var(--black); color: var(--white); border-radius: 14px; padding: 22px; display: grid; gap: 10px; }
.recap b { font-family: var(--display); font-size: 26px; line-height: 1.1; }
.eticket { background: var(--white); color: var(--black); border: 1px solid var(--line); border-radius: 18px; padding: 20px; display: grid; gap: 12px; max-width: 320px; box-shadow: 0 18px 40px -24px rgba(0,0,0,.4); }
.eticket b { font-family: var(--display); font-weight: 400; font-size: 26px; line-height: 1; text-transform: uppercase; }
.eticket canvas { width: 100%; aspect-ratio: 1; image-rendering: pixelated; display: block; }
.eticket .rows { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; }
.eticket .rows span { display: block; font-family: var(--cond); text-transform: uppercase; letter-spacing: .08em; color: var(--grey); font-size: 12px; }
.tickets { display: flex; gap: 18px; flex-wrap: wrap; }
.timeline { list-style: none; margin: 0; padding: 0; }
.timeline li { display: grid; grid-template-columns: 160px 1fr; gap: 20px; padding-block: 20px; border-top: 1px solid var(--line); }
.timeline .t { font-family: var(--mono); color: var(--red); }
.timeline b { font-family: var(--cond); font-size: 24px; text-transform: uppercase; display: block; }
.gate-out { margin-top: 16px; border-radius: 12px; padding: 18px; font-family: var(--cond); font-size: 24px; font-weight: 700; text-transform: uppercase; }
.gate-out.good { background: #E3F3EA; color: var(--ok); }
.gate-out.bad { background: #FDE8E8; color: var(--red-dark); }
.gate-out.warn { background: #FBF0DC; color: #8A5300; }
@media (max-width: 860px) { .flow { grid-template-columns: 1fr; } .recap { position: static; } .timeline li { grid-template-columns: 1fr; gap: 4px; } }
`;
const TIERS = `<div class="grid g3">
  <div class="tier"><span class="kicker">Catégorie</span><b>Pelouse</b><ul><li>Accès pelouse, debout</li><li>Entrée porte A</li></ul><span class="price">Prix à annoncer</span></div>
  <div class="tier"><span class="kicker">Catégorie</span><b>Tribune</b><ul><li>Place assise en tribune</li><li>Entrée porte B</li></ul><span class="price">Prix à annoncer</span></div>
  <div class="tier vip"><span class="kicker">Catégorie</span><b>VIP</b><ul><li>Espace réservé face à la scène</li><li>Entrée dédiée, boissons</li></ul><span class="price">Prix à annoncer</span></div>
</div>`;

page('enroutedu26mars', 'index', 'Accueil', `
<section class="redbg e-hero"><div class="in">
  <div class="kicker">Yacou B OG · En concert · Date à annoncer</div>
  <h1 class="h-xl">Stade du<br>26 Mars</h1>
  <div class="count" data-countdown aria-label="Compte à rebours de démonstration">
    <div><b data-cd="d">--</b><small>Jours</small></div><div><b data-cd="h">--</b><small>Heures</small></div><div><b data-cd="m">--</b><small>Min</small></div><div><b data-cd="s">--</b><small>Sec</small></div>
  </div>
  <p class="note" style="color:rgba(255,255,255,.8)">Compte à rebours de démonstration : il sera réglé sur la date officielle.</p>
  <div class="row"><a class="btn black" href="billets.html">Acheter mon billet</a><a class="btn line" href="programme.html">Programme</a></div>
  <div class="pay"><span>Orange Money</span><span>Moov Money</span><span>Carte bancaire</span></div>
</div></section>
<section class="sec"><div class="in">
  <div class="sec-head"><h2 class="h-l">Les billets</h2><a class="btn sm" href="billets.html">Acheter</a></div>
  ${TIERS}
</div></section>
<section class="sec dark"><div class="in grid g3">
  <div style="display:grid;gap:8px"><div class="kicker">Billet sur téléphone</div><p>Après paiement, le billet arrive par SMS, WhatsApp et e-mail avec un QR code unique.</p></div>
  <div style="display:grid;gap:8px"><div class="kicker">Entrée rapide</div><p>Le QR code est scanné aux portes. Un billet ne peut servir qu'une seule fois.</p></div>
  <div style="display:grid;gap:8px"><div class="kicker">Infos pratiques</div><p>Accès, ouverture des portes, objets interdits : tout est sur la page <a href="acces.html">Accès</a>.</p></div>
</div></section>
<section class="sec paper"><div class="in" style="display:grid;gap:16px">
  <div class="kicker">Partenaires</div>
  <div class="grid g4">${[1, 2, 3, 4].map(() => '<div class="ph light" style="aspect-ratio:3/2"><span class="cap">Logo partenaire</span></div>').join('')}</div>
</div></section>
`, E26_CSS);

page('enroutedu26mars', 'billets', 'Billets', `
<section class="sec"><div class="in">
  <div class="kicker">Billetterie</div>
  <h1 class="h-l" style="margin:10px 0 8px">Acheter mon billet</h1>
  <p class="note" style="margin-bottom:28px">Démo : prix d'exemple, aucun paiement réel. Le parcours complet fonctionne, essayez-le.</p>
  <div class="flow" id="ticket-flow">
    <div>
      <ol class="steps-nav"><li>Billets</li><li>Coordonnées</li><li>Paiement</li><li>Mes billets</li></ol>

      <div class="step" style="display:grid;gap:12px">
        <label class="opt"><input type="radio" name="cat" value="Pelouse"><b>Pelouse</b><span class="pr">5 000 FCFA</span></label>
        <label class="opt"><input type="radio" name="cat" value="Tribune" checked><b>Tribune</b><span class="pr">10 000 FCFA</span></label>
        <label class="opt"><input type="radio" name="cat" value="VIP"><b>VIP</b><span class="pr">25 000 FCFA</span></label>
        <div class="row" style="margin-top:8px"><span style="font-family:var(--cond);font-weight:700;text-transform:uppercase">Nombre de billets</span>
          <div class="qty"><button type="button" id="qty-minus" aria-label="Retirer un billet">−</button><span id="qty" aria-live="polite">1</span><button type="button" id="qty-plus" aria-label="Ajouter un billet">+</button></div></div>
        <div><button class="btn" type="button" id="to-2">Continuer</button></div>
      </div>

      <form class="step f" id="form-info" hidden>
        <div class="field"><label for="buyer-name">Nom complet</label><input id="buyer-name" required autocomplete="name"></div>
        <div class="field"><label for="buyer-phone">Numéro de téléphone (billets envoyés par SMS et WhatsApp)</label><input id="buyer-phone" type="tel" required placeholder="70 00 00 00" autocomplete="tel"></div>
        <div class="field"><label for="buyer-mail">E-mail (facultatif)</label><input id="buyer-mail" type="email" autocomplete="email"></div>
        <div class="row"><button class="btn line" type="button" id="back-1">Retour</button><button class="btn" type="submit">Continuer</button></div>
      </form>

      <div class="step" style="display:grid;gap:12px" hidden>
        <label class="opt"><input type="radio" name="pay" value="Orange Money" checked><b>Orange Money</b></label>
        <label class="opt"><input type="radio" name="pay" value="Moov Money"><b>Moov Money</b></label>
        <label class="opt"><input type="radio" name="pay" value="Carte bancaire"><b>Carte bancaire</b></label>
        <p class="note">En production, vous validez le paiement avec votre code secret sur votre téléphone.</p>
        <div class="row"><button class="btn line" type="button" id="back-2">Retour</button><button class="btn" type="button" id="pay-btn">Payer</button></div>
      </div>

      <div class="step" style="display:grid;gap:18px" hidden>
        <div class="ok-msg">Paiement confirmé. Vos billets ont été envoyés au <span id="sent-to"></span> (démo : aucun SMS réel).</div>
        <div class="tickets" id="tickets-out"></div>
        <div class="row"><a class="btn black" href="controle.html">Tester le contrôle à l'entrée</a><a class="btn line" href="billets.html">Acheter d'autres billets</a></div>
      </div>
    </div>
    <aside class="recap" aria-label="Récapitulatif">
      <span class="kicker" style="color:var(--white);opacity:.7">Votre commande</span>
      <b data-sum></b>
      <span style="color:#BDB6B8;font-size:15px">Yacou B OG · Stade du 26 Mars · Bamako</span>
    </aside>
  </div>
</div></section>
`, E26_CSS);

page('enroutedu26mars', 'controle', "Contrôle à l'entrée", `
<section class="sec"><div class="in" style="max-width:640px">
  <div class="kicker">Application des agents aux portes</div>
  <h1 class="h-l" style="margin:10px 0 12px">Contrôle des billets</h1>
  <p class="lead" style="margin-bottom:24px">En production, l'agent scanne le QR code avec son téléphone. Ici, choisissez un billet acheté dans la démo ou tapez son numéro.</p>
  <div class="row" id="gate-list" style="margin-bottom:16px"></div>
  <form class="f" id="gate-form">
    <div class="field"><label for="gate-code">Numéro du billet</label><input id="gate-code" required placeholder="E26-XXXXXX" autocomplete="off"></div>
    <div><button class="btn" type="submit">Vérifier</button></div>
  </form>
  <div id="gate-out" role="status"></div>
  <p class="note" style="margin-top:20px">Scannez deux fois le même billet : la deuxième entrée est refusée.</p>
</div></section>
`, E26_CSS);

page('enroutedu26mars', 'programme', 'Programme', `
<section class="redbg e-hero"><div class="in"><div class="kicker">Programme</div><h1 class="h-xl">La soirée</h1></div></section>
<section class="sec"><div class="in">
  <ol class="timeline">
    <li><span class="t">Horaire à annoncer</span><div><b>Ouverture des portes</b><span class="lead">Contrôle des billets par QR code.</span></div></li>
    <li><span class="t">Horaire à annoncer</span><div><b>DJ set d'ouverture</b><span class="lead">Artiste à annoncer.</span></div></li>
    <li><span class="t">Horaire à annoncer</span><div><b>Premières parties</b><span class="lead">Invités à annoncer.</span></div></li>
    <li><span class="t">Horaire à annoncer</span><div><b>Yacou B OG</b><span class="lead">Le concert.</span></div></li>
  </ol>
</div></section>
`, E26_CSS);

page('enroutedu26mars', 'acces', 'Accès', `
<section class="redbg e-hero"><div class="in"><div class="kicker">Infos pratiques</div><h1 class="h-xl">Venir au stade</h1></div></section>
<section class="sec"><div class="in grid g2" style="gap:40px">
  <div class="ph light" style="aspect-ratio:1"><span class="cap">Plan d'accès et portes du Stade du 26 Mars</span></div>
  <div style="display:grid;gap:22px;align-content:start">
    <div class="card"><h3>Adresse</h3><p>Stade du 26 Mars, Yirimadio, Commune VI, Bamako.</p></div>
    <div class="card"><h3>Portes</h3><p>Porte A : Pelouse. Porte B : Tribune. Entrée VIP dédiée. Numéros définitifs à confirmer avec l'organisation.</p></div>
    <div class="card"><h3>Transport et parking</h3><p>Informations sur les parkings, les taxis et les Sotrama à ajouter avec l'organisation.</p></div>
    <div class="card"><h3>Objets interdits</h3><p>Liste à valider avec la sécurité du stade.</p></div>
  </div>
</div></section>
`, E26_CSS);

page('enroutedu26mars', 'faq', 'FAQ', `
<section class="redbg e-hero"><div class="in"><div class="kicker">Questions fréquentes</div><h1 class="h-xl">FAQ</h1></div></section>
<section class="sec"><div class="in" style="max-width:860px">
  <details class="q" open><summary>Comment acheter un billet ?</summary><p>Sur la page Billets : choisissez la catégorie, entrez votre numéro, puis payez par Orange Money, Moov Money ou carte. Le billet arrive tout de suite sur votre téléphone.</p></details>
  <details class="q"><summary>J'ai perdu mon billet, que faire ?</summary><p>Entrez votre numéro de téléphone sur la page Billets pour le recevoir à nouveau. Le QR code reste le même.</p></details>
  <details class="q"><summary>Puis-je acheter pour quelqu'un d'autre ?</summary><p>Oui. Vous pouvez transférer le billet par WhatsApp. Chaque QR code n'est valable qu'une seule fois.</p></details>
  <details class="q"><summary>Les enfants paient-ils ?</summary><p>Règle à définir avec l'organisation.</p></details>
  <details class="q"><summary>Le billet est-il remboursable ?</summary><p>Conditions à définir avec l'organisation.</p></details>
  <details class="q"><summary>Où acheter un billet sans téléphone ?</summary><p>Des points de vente physiques peuvent être ajoutés ici avec leurs adresses.</p></details>
</div></section>
`, E26_CSS);

/* ---------------- assets ---------------- */
mkdirSync(join(OUT, 'demos/assets'), { recursive: true });
copyFileSync(join(SRC, 'demo.css'), join(OUT, 'demos/assets/demo.css'));
copyFileSync(join(SRC, 'demo.js'), join(OUT, 'demos/assets/demo.js'));

/* ---------------- portfolio and proposal (artifact sources wrapped as full pages) ---------------- */
function wrap(srcFile, outPath, replacements = []) {
  let body = readFileSync(join(SRC, srcFile), 'utf8').replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, '');
  for (const [a, b] of replacements) {
    if (!body.includes(a)) throw new Error(`Replacement not found in ${srcFile}: ${a.slice(0, 60)}`);
    body = body.split(a).join(b);
  }
  const titleMatch = body.match(/<title>[\s\S]*?<\/title>\n?/);
  const head = titleMatch ? titleMatch[0] : '';
  body = body.replace(head, '');
  const styles = body.match(/^[\s\S]*?<\/style>\n?/)[0];
  body = body.replace(styles, '');
  write(outPath, `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
${head}${styles}</head>
<body>
${body}
</body>
</html>`);
}
wrap('portfolio.html', 'portfolio/index.html', [
  ['<nav aria-label="Sections">', '<nav aria-label="Sections">\n      <a href="../index.html">Candidature</a>'],
]);
wrap('proposition.html', 'proposition/index.html', [
  ['https://claude.ai/artifact/9Dk8UFf6onb8F1wKQ459zi', '../portfolio/index.html'],
  ['<span>De : Hamady Ibrahim Diallo</span>', '<span>De : Hamady Ibrahim Diallo · <a href="../index.html">Accueil candidature</a></span>'],
  ['<p>La dernière sortie en grand, les plateformes d\'écoute en un clic, et les dates de concert avec un vrai bouton d\'achat.</p>', '<p>La dernière sortie en grand, les plateformes d\'écoute en un clic, et les dates de concert avec un vrai bouton d\'achat.</p><a class="demo-link" href="../demos/yacoubog/index.html">Visiter la démo →</a>'],
  ['<p>Le domaine devient le site de l\'équipe. Il montre les personnes qui portent le projet et renvoie vers l\'artiste et vers l\'événement.</p>', '<p>Le domaine devient le site de l\'équipe. Il montre les personnes qui portent le projet et renvoie vers l\'artiste et vers l\'événement.</p><a class="demo-link" href="../demos/civilisationmalienne/index.html">Visiter la démo →</a>'],
  ['<p>Le site le plus urgent. Il doit vendre les billets, tenir la charge le jour de l\'ouverture des ventes et rassurer sur l\'accès au stade.</p>', '<p>Le site le plus urgent. Il doit vendre les billets, tenir la charge le jour de l\'ouverture des ventes et rassurer sur l\'accès au stade.</p><a class="demo-link" href="../demos/enroutedu26mars/index.html">Visiter la démo →</a>'],
  ['.flag {', '.demo-link { font-family: var(--cond); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; background: var(--red); color: #fff; padding: 10px 20px; border-radius: 999px; text-decoration: none; white-space: nowrap; }\n.demo-link:hover { background: var(--red-ink); }\n.screen-link { display: block; text-decoration: none; color: inherit; }\n.flag {'],
]);

copyFileSync(join(SRC, 'hub.html'), join(OUT, 'index.html'));
console.log('Built into', OUT);
