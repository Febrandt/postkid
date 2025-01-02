import { useEffect } from 'react';
import './Workbench.css';
import '../../assets/base.css';
import TextAreaWithTabs from '../TextAreaWithTabs/TextAreaWithTabs';
import { useAutoAnimate } from '@formkit/auto-animate/react';

function Workbench({ tabName = 'Workbench 1', tabData = {
  url: '',
  method: 'GET',
  params: [{ key: '', value: '' }],
  body: '',
  response: '',
  headers: [{ key: '', value: '' }]
}, setTabData }) {
  const { url, method, params, body, response, headers } = tabData;
  const [parent, enableAnimations] = useAutoAnimate();
  const [headerParent, enableHeaderAnimations] = useAutoAnimate();
  const [paramParent, enableParamAnimations] = useAutoAnimate();

  // Sync parameters with the URL
  useEffect(() => {
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = url.slice(queryIndex + 1);
      const newParams = queryString
        .split('&')
        .map((pair) => {
          const [key, value] = pair.split('=');
          return { key: decodeURIComponent(key || ''), value: decodeURIComponent(value || '') };
        });
      setTabData({ ...tabData, params: newParams });
    } else {
      setTabData({ ...tabData, params: [{ key: '', value: '' }] });
    }
  }, [url]);

  // Update URL and params
  const updateUrl = (newParams) => {
    const baseUrl = url.split('?')[0];
    const queryString = newParams
      .filter(({ key }) => key)
      .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    setTabData({ ...tabData, url: `${baseUrl}${queryString ? `?${queryString}` : ''}`, params: newParams });
  };

  // Handle parameter updates
  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    updateUrl(newParams);
  };

  const handleAddParamRow = () => updateUrl([...params, { key: '', value: '' }]);
  const handleRemoveParamRow = (index) => updateUrl(params.filter((_, i) => i !== index));

  // Handle header updates
  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setTabData({ ...tabData, headers: newHeaders });
  };

  const handleAddHeaderRow = () => setTabData({ ...tabData, headers: [...headers, { key: '', value: '' }] });
  const handleRemoveHeaderRow = (index) => setTabData({ ...tabData, headers: headers.filter((_, i) => i !== index) });

  // Send request
  const sendRequest = async () => {
    try {
      const options = {
        method,
        headers: Object.fromEntries(
          headers.filter(({ key }) => key).map(({ key, value }) => [key, value])
        ),
      };
      if (method !== 'GET') {
        options.body = body;
      }

      const res = await window.api.fetch(url, options);
      setTabData({ ...tabData, response: res });
    } catch (error) {
      console.error('Request failed:', error);
      setTabData({ ...tabData, response: `Error: ${error.message}` });
    }
  };

  return (
    <div className="workbench" ref={parent}>
      <h2>{tabName}</h2>

      <div className="url">
        <select onChange={(e) => setTabData({ ...tabData, method: e.target.value })} value={method}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          onChange={(e) => setTabData({ ...tabData, url: e.target.value })}
          value={url}
          placeholder="Enter URL"
        />

        <button onClick={sendRequest}>Send</button>
      </div>

      <table ref={paramParent}>
        <th>Parameters</th>
        {params.map((param, index) => (
          <tr key={index}>
            <input
              type="text"
              placeholder="Key"
              value={param.key}
              onChange={(e) => handleParamChange(index, 'key', e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={param.value}
              onChange={(e) => handleParamChange(index, 'value', e.target.value)}
            />
            <button disabled={index === 0} onClick={() => handleRemoveParamRow(index)}>
              Remove
            </button>
          </tr>
        ))}
        <button onClick={handleAddParamRow}>Add Parameter</button>
      </table>

      <table ref={headerParent}>
        <th>Headers</th>
        {headers.map((header, index) => (
          <tr key={index}>
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
            />
            <button disabled={index === 0} onClick={() => handleRemoveHeaderRow(index)}>
              Remove
            </button>
          </tr>
        ))}
        <button onClick={handleAddHeaderRow}>Add Header</button>
      </table>

      {method !== 'GET' && (
        <section>
          <label className="textarea">Body</label>
          <TextAreaWithTabs
            onChange={(e) => setTabData({ ...tabData, body: e.target.value })}
            value={body}
            rows={7}
            placeholder="Enter request body"
          />
        </section>
      )}

      <section>
        <label>Response</label>
        <pre>{response}</pre>
      </section>
    </div>
  );
}

export default Workbench;
