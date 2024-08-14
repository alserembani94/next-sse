import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [description, setDescription] = useState('');

  const getData = async () => {
    try {
      const response = await axios.post('https://api.data.decube.ninja/ai/suggestion/asset_description_sse', {
        "asset_id": 193,
        "asset_type": "property",
        "hint": ""
      }, {
        headers: {
          'Accept': 'text/event-stream',
          'X-Decube-Org': 'abc12345'
        },
        responseType: 'stream',
        adapter: 'fetch',
      });

      const stream = response.data;
      const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
      setDescription('');
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const data = value.split('data: ')[1];
        const suggestions = JSON.parse(data).description.suggestion;
        setDescription((prev) => prev + suggestions);
      }
    } catch(error) {
      console.error('decube-error', error);
    }
  }
  
  return (
    <div>
      <button onClick={getData} className="my-button">Get Data</button>
      <p>{description}</p>
    </div>
  );
}
