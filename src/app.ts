import axios from 'axios';

const form = document.querySelector<HTMLFormElement>('form')!;
const addresInput = document.querySelector<HTMLInputElement>('#address')!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
const body = document.body!;
const script = document.createElement('script');

script.src = scriptUrl;
body.appendChild(script);

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

const searchAddressHandler = async (event: Event) => {
  event.preventDefault();
  const enteredAddress = addresInput.value;

  try {
    const response = await axios.get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.status !== 'OK') {
      throw new Error("I couldn't get the coordinates.");
    }

    const coordinates = response.data.results[0].geometry.location;
    const map = new google.maps.Map(document.getElementById('map')!, {
      center: coordinates,
      zoom: 16,
    });

    new google.maps.Marker({
      position: coordinates,
      map: map,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message);
    }
  }
};

form.addEventListener('submit', searchAddressHandler);
