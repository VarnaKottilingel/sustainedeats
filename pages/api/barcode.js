export default async function handler(req, res) {
  const { barcode } = req.query;
  const apiKey = process.env.BARCODE_LOOKUP_API_KEY;

  try {
    const response = await fetch(`https://api.barcodelookup.com/v3/products?barcode=${barcode}&key=${apiKey}`);
    const text = await response.text();
    if (!text) {
      return res.status(500).json({ error: 'Empty response from API' });
    }

    const data = JSON.parse(text);
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: 'Failed to fetch product details' });
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
