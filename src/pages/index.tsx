import axios from 'axios';
import { useEffect, useState } from 'react';

type Asset = {
  asset_id	:	number;
  asset_name	:	string;
  asset_type	:	string;
  parent_id	:	number;
  parent_name	:	string;
  parent_type	:	string;
}

type DescriptionToken = {
  description: {
    existing: string | null;
    suggestion: string | null;
  }
}

type AssetDescription = {
  description: string;
}

export default function Home() {
  const [assetCursor, setAssetCursor] = useState<(Asset & DescriptionToken)[]>();
  const [savedAssets, setSavedAssets] = useState<(Asset & AssetDescription)[]>([]);
  const getData = async () => {
    try {
      const response = await axios.post('https://api.data.decube.ninja/ai/suggestion/asset_descriptions', {
        "asset_id": 101135,
        "asset_type": "dataset",
        "empty_description_only": false
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
        if (done) {
          break;
        }
        const lines: string[] = value.replaceAll("data: ", "").split('\n').filter(Boolean);
        const streamedData: (Asset & DescriptionToken)[] = lines.map((line) => JSON.parse(line));
        setAssetCursor(streamedData);
      }
    } catch(error) {
      console.error('decube-error', error);
    }
  }
  
  useEffect(() => {
    if (assetCursor) {
      setSavedAssets((prevSavedAssets) => {
        const newSavedAssets = [...prevSavedAssets];
        assetCursor.forEach((cursor) => {
          const isExist = newSavedAssets.some((savedAsset) => savedAsset.asset_id === cursor.asset_id);
          if (!isExist) {
            newSavedAssets.push({
              ...cursor,
              description: cursor.description.suggestion || cursor.description.existing || ''
            });
          } else {
            const index = newSavedAssets.findIndex((savedAsset) => savedAsset.asset_id === cursor.asset_id);
            newSavedAssets[index] = {
              ...cursor,
              description: newSavedAssets[index].description + (cursor.description.suggestion || cursor.description.existing || '')
            };
          }
        })
        return newSavedAssets;
      })
    }
  }, [assetCursor]);
  
  return (
    <div>
      <button onClick={getData} className="my-button">Get Data</button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {
        savedAssets.map((asset) => (
          <div key={asset.asset_id} style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{asset.asset_name}</p>
            <p>{asset.description}</p>
          </div>
        ))
      }
      </div>
    </div>
  );
}
