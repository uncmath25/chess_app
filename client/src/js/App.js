import React, {useState} from 'react';

import Header from './components/Header';
import { getPaddingStyle } from './utils/style';

export default function App() {
  const [testMessage, setTestMessage] = useState("");
  const header = <Header testMessage={testMessage} setTestMessage={setTestMessage} />;
  return (
    <div>
      {header}
      Chess App
      <span style={getPaddingStyle(5)} />
      {testMessage}
    </div>
  );
}
