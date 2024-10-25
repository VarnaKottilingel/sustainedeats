import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Quagga from "quagga";

const BarcodeScannerComponent = () => {
  const webcamRef = useRef(null);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [barcodeData, setBarcodeData] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            Quagga.decodeSingle(
              {
                src: imageSrc,
                numOfWorkers: 0,
                inputStream: {
                  size: 800,
                },
                decoder: {
                  readers: [
                    "code_128_reader",
                    "ean_reader",
                    "ean_8_reader",
                    "code_39_reader",
                    "code_39_vin_reader",
                    "codabar_reader",
                    "upc_reader",
                    "upc_e_reader",
                    "i2of5_reader",
                  ],
                },
              },
              function (result) {
                if (result && result.codeResult) {
                  setBarcodeData(result.codeResult.code);
                  setScanning(false);
                  fetchProductDetails(result.codeResult.code).then(
                    (productDetails) => {
                      setName(productDetails.name);
                    },
                  );
                } else {
                  console.error("No barcode detected");
                }
              },
            );
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageSrc = reader.result;
      Quagga.decodeSingle(
        {
          src: imageSrc,
          numOfWorkers: 0,
          inputStream: {
            size: 800,
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader",
            ],
          },
        },
        function (result) {
          if (result && result.codeResult) {
            setBarcodeData(result.codeResult.code);
            fetchProductDetails(result.codeResult.code).then(
              (productDetails) => {
                setName(productDetails.name);
              },
            );
          } else {
            console.error("No barcode detected");
            alert(
              "Failed to read barcode from image. Please ensure the barcode is clear and try again.",
            );
          }
        },
      );
    };
    reader.readAsDataURL(file);
  };

  const fetchProductDetails = async (barcode) => {
    try {
      const response = await fetch(`/api/barcode?barcode=${barcode}`);
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        return { name: data.products[0].title };
      } else {
        return { name: "Unknown Product" };
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      return { name: "Error fetching product details" };
    }
  };

  const addItem = () => {
    setItems([...items, { name }]);
    setName("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Add Food Item</h1>
      {!scanning && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setScanning(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Scan Barcode
          </button>
          <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
      {scanning && (
        <div className="mb-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
            className="mb-4"
          />
        </div>
      )}
      {barcodeData && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Barcode Data:</h2>
          <p>{barcodeData}</p>
        </div>
      )}
      <input
        type="text"
        placeholder="Food Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={addItem}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
      >
        Add to Inventory
      </button>
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-2 p-2 border rounded">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BarcodeScannerComponent;
