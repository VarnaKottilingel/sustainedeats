export default async function handler(req, res) {
  const { image } = req.body;
  const apiKey = process.env.OCR_SPACE_API_KEY;

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Image: `data:image/jpeg;base64,${image}`,
      language: 'eng',
    }),
  });

  const data = await response.json();
  let expiryDate = 'Unknown';

  if (data.ParsedResults && data.ParsedResults.length > 0) {
    const parsedText = data.ParsedResults[0].ParsedText;
    const datePattern = /\b\d{4}-\d{2}-\d{2}\b/;
    const match = parsedText.match(datePattern);
    if (match) {
      expiryDate = match[0];
    }
  }

  res.status(200).json({ expiryDate });
}
