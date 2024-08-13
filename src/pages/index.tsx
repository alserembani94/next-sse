import axios from 'axios';

export default function Home() {

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
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log(value);
      }
    } catch(error) {
      console.error('decube-error', error);
    }
  }
  
  return (
    <div>
      <button onClick={getData} className="my-button">Get Data</button>
      {/* <p>{data}</p> */}
    </div>
  );
}
