import { Buffer } from "buffer";

export function isValidBase64Image(base64String: string): boolean {
  // Verificar se a string está no formato base64 de imagem
  const base64Pattern = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,/;
  if (!base64Pattern.test(base64String)) {
    return false;
  }

  // Remover o prefixo 'data:image/png;base64,' se existir
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Tentar decodificar a imagem
  try {
    // Obter o tipo MIME da imagem
    const mimeTypeMatch = base64String.match(base64Pattern);
    if (!mimeTypeMatch) return false;

    const mimeType = mimeTypeMatch[1];

    // Verificar se a conversão de volta para base64 é válida
    const reconstructedBase64 = buffer.toString("base64");
    const reconstructedImage = `data:image/${mimeType};base64,${reconstructedBase64}`;

    return reconstructedImage === base64String;
  } catch (error) {
    return false;
  }
}
