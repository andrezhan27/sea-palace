export const spacePhotos = [
  ["Mesa redonda posta numa sala privada", "Round table set in a private dining room"],
  ["Bonsai num nicho redondo", "Bonsai in a round wall niche"],
  ["Bancos cor de vinho junto às plantas da sala", "Burgundy booths beside plants in the dining room"],
  ["Prateleiras iluminadas com garrafas e um gato da sorte", "Lit shelves with bottles and a lucky cat"],
  ["Mesa redonda junto à janela, sob um lustre dourado", "Round table beside a window beneath a gold chandelier"],
  ["Garrafeira de madeira com vinhos portugueses", "Wooden display rack of Portuguese wines"],
  ["Lanternas vermelhas junto ao balcão", "Red lanterns beside the counter"],
  ["Placa redonda com um ramo em relevo", "Round plaque with a sculpted branch"],
  ["Sala de refeições com cadeiras cor de vinho", "Dining room with burgundy chairs"],
  ["Fachada do Sea Palace e mesas da esplanada", "Sea Palace storefront and terrace tables"],
].map(([pt, en], index) => ({ name: `space-${index + 1}`, pt, en }));
